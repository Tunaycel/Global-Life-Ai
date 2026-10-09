// Daily team report: collects the last day's activity from the GitHub API, renders a
// dark email-safe HTML report and sends it over SMTP. Without SMTP settings it only writes
// report.html, which the workflow uploads as an artifact.
//
// Env: GITHUB_TOKEN, GITHUB_REPOSITORY (owner/repo), REPORT_HOURS (default 24),
// REPORT_TZ (default Europe/Istanbul), SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS,
// REPORT_FROM, REPORT_TO (comma separated), OUT (default report.html).

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const env = process.env;
const [owner, repo] = (env.GITHUB_REPOSITORY ?? "Tunaycel/globallife").split("/");
const hours = Number(env.REPORT_HOURS ?? 24);
const tz = env.REPORT_TZ ?? "Europe/Istanbul";
const until = new Date();
const since = new Date(until.getTime() - hours * 3600_000);
const inWindow = (iso) => iso && new Date(iso) >= since && new Date(iso) <= until;
const repoUrl = `https://github.com/${owner}/${repo}`;
const AI_REVIEWERS = new Set(["coderabbitai[bot]", "coderabbitai"]);

async function gh(path, params = {}) {
  const url = new URL(`https://api.github.com/repos/${owner}/${repo}${path}`);
  for (const [k, v] of Object.entries({ per_page: 100, ...params })) url.searchParams.set(k, v);
  const out = [];
  let next = url.toString();
  while (next) {
    const res = await fetch(next, {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${path}`);
    const data = await res.json();
    if (!Array.isArray(data)) return data;
    out.push(...data);
    next = res.headers.get("link")?.match(/<([^>]+)>;\s*rel="next"/)?.[1];
  }
  return out;
}

async function collect() {
  const [collaborators, branches, milestones, openIssues, recentIssues, pulls] = await Promise.all([
    gh("/collaborators", { affiliation: "direct" }),
    gh("/branches"),
    gh("/milestones", { state: "open", sort: "due_on" }),
    gh("/issues", { state: "open" }),
    gh("/issues", { state: "all", since: since.toISOString() }),
    gh("/pulls", { state: "all", sort: "updated", direction: "desc" }),
  ]);
  const { default_branch: defaultBranch } = await gh("");

  const recentPulls = pulls.filter((p) => new Date(p.updated_at) >= since);

  // Commits: every PR touched in the window (their branches may already be deleted) plus
  // every live branch, de-duplicated by sha. Squash commits on the default branch are left
  // out, they repeat work already counted on the PR.
  const commits = new Map();
  const addCommit = (c) => {
    const date = c.commit.author?.date ?? c.commit.committer?.date;
    if (!inWindow(date)) return;
    const login = c.author?.login ?? c.commit.author?.name ?? "unknown";
    commits.set(c.sha, { login, message: c.commit.message.split("\n")[0], sha: c.sha });
  };
  await Promise.all(recentPulls.map(async (p) => (await gh(`/pulls/${p.number}/commits`)).forEach(addCommit)));
  await Promise.all(
    branches
      .filter((b) => b.name !== defaultBranch)
      .map(async (b) => (await gh("/commits", { sha: b.name, since: since.toISOString() })).forEach(addCommit)),
  );

  const reviews = (
    await Promise.all(recentPulls.map(async (p) => (await gh(`/pulls/${p.number}/reviews`)).map((r) => ({ ...r, pr: p }))))
  ).flat().filter((r) => inWindow(r.submitted_at));

  const closedIssues = recentIssues.filter((i) => !i.pull_request && i.state === "closed" && inWindow(i.closed_at));
  const openedIssues = recentIssues.filter((i) => !i.pull_request && inWindow(i.created_at));
  const mergedPulls = recentPulls.filter((p) => inWindow(p.merged_at));
  const openedPulls = recentPulls.filter((p) => inWindow(p.created_at));
  const openTasks = openIssues.filter((i) => !i.pull_request);

  const people = new Map();
  const person = (login) => {
    const key = login.toLowerCase();
    if (!people.has(key)) {
      people.set(key, { login, commits: 0, prsOpened: 0, prsMerged: 0, reviews: 0, tasksClosed: 0, openTasks: 0, added: 0, removed: 0 });
    }
    return people.get(key);
  };
  collaborators.forEach((c) => person(c.login));
  for (const c of commits.values()) if (!AI_REVIEWERS.has(c.login)) person(c.login).commits++;
  openedPulls.forEach((p) => person(p.user.login).prsOpened++);
  mergedPulls.forEach((p) => person(p.user.login).prsMerged++);
  await Promise.all(
    mergedPulls.map(async (p) => {
      const full = await gh(`/pulls/${p.number}`);
      person(p.user.login).added += full.additions;
      person(p.user.login).removed += full.deletions;
    }),
  );
  reviews.filter((r) => !AI_REVIEWERS.has(r.user.login)).forEach((r) => person(r.user.login).reviews++);
  closedIssues.forEach((i) => (i.assignees ?? []).forEach((a) => person(a.login).tasksClosed++));
  openTasks.forEach((i) => (i.assignees ?? []).forEach((a) => person(a.login).openTasks++));

  const aiReviews = reviews.filter((r) => AI_REVIEWERS.has(r.user.login));
  return {
    people: [...people.values()].sort((a, b) => b.commits + b.prsMerged + b.tasksClosed - (a.commits + a.prsMerged + a.tasksClosed)),
    commits: [...commits.values()],
    closedIssues, openedIssues, mergedPulls, openedPulls, openTasks, milestones,
    aiReviews: {
      total: aiReviews.length,
      changesRequested: aiReviews.filter((r) => r.state === "CHANGES_REQUESTED").length,
      approved: aiReviews.filter((r) => r.state === "APPROVED").length,
    },
    waitingForLead: pulls.filter((p) => p.state === "open" && !p.draft),
  };
}

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const C = { bg: "#0B0B14", card: "#14141F", line: "#25253A", text: "#E8E8F0", muted: "#8A8AA3", blue: "#0A84FF", violet: "#5E5CE6", green: "#30D158", amber: "#FFD60A" };
const font = "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;";

function card(title, inner) {
  return `<tr><td style="padding:0 0 16px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.card};border:1px solid ${C.line};border-radius:14px">
    <tr><td style="padding:18px 20px 6px;${font}font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${C.muted}">${esc(title)}</td></tr>
    <tr><td style="padding:0 20px 18px;${font}font-size:14px;color:${C.text}">${inner}</td></tr>
  </table></td></tr>`;
}

function list(items, empty) {
  if (!items.length) return `<p style="margin:6px 0;color:${C.muted}">${esc(empty)}</p>`;
  return items
    .map((i) => `<p style="margin:8px 0;line-height:1.45"><a href="${esc(i.url)}" style="color:${C.blue};text-decoration:none;font-weight:600">#${i.number}</a> ${esc(i.title)}${i.meta ? ` <span style="color:${C.muted}">· ${esc(i.meta)}</span>` : ""}</p>`)
    .join("");
}

function render(d) {
  const date = new Intl.DateTimeFormat("en-GB", { dateStyle: "full", timeZone: tz }).format(until);
  const time = (x) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: tz }).format(x);
  const assignees = (i) => (i.assignees ?? []).map((a) => `@${a.login}`).join(", ") || "unassigned";

  const kpis = [
    ["Tasks done", d.closedIssues.length, C.green],
    ["PRs merged", d.mergedPulls.length, C.blue],
    ["Commits", d.commits.length, C.violet],
    ["Open tasks", d.openTasks.length, C.amber],
  ];
  const kpiRow = `<tr><td style="padding:0 0 16px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>${kpis
    .map(([label, value, color], i) => `<td width="25%" style="padding:0 ${i < 3 ? 8 : 0}px 0 0">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.card};border:1px solid ${C.line};border-radius:14px">
      <tr><td style="padding:16px 14px;${font}">
        <div style="font-size:28px;font-weight:800;color:${color};line-height:1">${value}</div>
        <div style="margin-top:6px;font-size:12px;color:${C.muted}">${label}</div>
      </td></tr></table></td>`)
    .join("")}</tr></table></td></tr>`;

  const th = (t, align = "right") => `<td style="padding:8px 6px;${font}font-size:11px;font-weight:700;color:${C.muted};text-transform:uppercase;letter-spacing:.06em;text-align:${align};border-bottom:1px solid ${C.line}">${t}</td>`;
  const td = (t, align = "right", color = C.text) => `<td style="padding:10px 6px;${font}font-size:14px;color:${color};text-align:${align};border-bottom:1px solid ${C.line}">${t}</td>`;
  const team = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>${th("Person", "left")}${th("Commits")}${th("PRs opened")}${th("PRs merged")}${th("Lines")}${th("Reviews")}${th("Tasks done")}${th("Open tasks")}</tr>
    ${d.people
      .map((p) => `<tr>${td(`<a href="https://github.com/${esc(p.login)}" style="color:${C.text};text-decoration:none;font-weight:600">@${esc(p.login)}</a>`, "left")}${td(p.commits)}${td(p.prsOpened)}${td(p.prsMerged)}${td(`<span style="color:${C.green}">+${p.added}</span> <span style="color:#FF453A">−${p.removed}</span>`)}${td(p.reviews)}${td(p.tasksClosed, "right", p.tasksClosed ? C.green : C.text)}${td(p.openTasks)}</tr>`)
      .join("")}
  </table>
  <p style="margin:12px 0 0;font-size:12px;color:${C.muted}">Activity in the last ${hours} hours, not hours worked. Lines are from PRs merged in that window.</p>`;

  const milestones = d.milestones.length
    ? d.milestones
        .map((m) => {
          const total = m.open_issues + m.closed_issues;
          const pct = total ? Math.round((m.closed_issues / total) * 100) : 0;
          return `<p style="margin:12px 0 6px"><a href="${esc(m.html_url)}" style="color:${C.text};text-decoration:none;font-weight:600">${esc(m.title)}</a> <span style="color:${C.muted}">${m.closed_issues}/${total} · ${pct}%</span></p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.line};border-radius:6px"><tr>
            ${pct ? `<td width="${pct}%" style="height:8px;background:${C.blue};border-radius:6px;font-size:0;line-height:0">&nbsp;</td>` : ""}
            <td style="height:8px;font-size:0;line-height:0">&nbsp;</td></tr></table>`;
        })
        .join("")
    : `<p style="color:${C.muted}">No open milestones.</p>`;

  const byPerson = new Map();
  d.openTasks.forEach((i) => {
    const who = assignees(i);
    if (!byPerson.has(who)) byPerson.set(who, []);
    byPerson.get(who).push(i);
  });
  const workload = [...byPerson.entries()]
    .sort(([a], [b]) => (a === "unassigned") - (b === "unassigned") || a.localeCompare(b))
    .map(([who, items]) => `<p style="margin:14px 0 4px;font-weight:700;color:${who === "unassigned" ? C.muted : C.text}">${esc(who)} <span style="color:${C.muted};font-weight:400">· ${items.length}</span></p>${list(items.slice(0, 8).map((i) => ({ number: i.number, title: i.title, url: i.html_url, meta: i.milestone?.title })), "")}${items.length > 8 ? `<p style="margin:4px 0;color:${C.muted}">+${items.length - 8} more</p>` : ""}`)
    .join("");

  const ai = d.aiReviews;
  const aiCard = `<p style="margin:6px 0">${ai.total} AI reviews · <span style="color:#FF453A">${ai.changesRequested} changes requested</span> · <span style="color:${C.green}">${ai.approved} approved</span></p>
    <p style="margin:12px 0 4px;font-weight:700">Waiting for the team lead</p>${list(d.waitingForLead.map((p) => ({ number: p.number, title: p.title, url: p.html_url, meta: `@${p.user.login}` })), "Nothing waiting.")}`;

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark"><meta name="supported-color-schemes" content="dark"><title>GlobalLife AI · Daily report</title></head>
<body style="margin:0;padding:0;background:${C.bg}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg}"><tr><td align="center" style="padding:28px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:680px">
  <tr><td style="padding:0 0 22px"><table role="presentation" cellpadding="0" cellspacing="0"><tr>
    <td style="padding-right:14px"><img src="cid:globallife-logo" width="48" height="48" alt="GlobalLife AI" style="display:block;border-radius:12px"></td>
    <td style="${font}"><div style="font-size:20px;font-weight:800;color:${C.text}">GlobalLife AI</div>
      <div style="font-size:13px;color:${C.muted}">Daily team report · ${esc(date)} · ${time(since)} – ${time(until)} (${esc(tz)})</div></td>
  </tr></table></td></tr>
  ${kpiRow}
  ${card("Completed", list(d.closedIssues.map((i) => ({ number: i.number, title: i.title, url: i.html_url, meta: assignees(i) })), "No tasks closed today."))}
  ${card("Merged pull requests", list(d.mergedPulls.map((p) => ({ number: p.number, title: p.title, url: p.html_url, meta: `@${p.user.login}` })), "Nothing merged today."))}
  ${card("Team activity", team)}
  ${card("AI first check (CodeRabbit)", aiCard)}
  ${card("Open tasks by person", workload || `<p style="color:${C.muted}">No open tasks.</p>`)}
  ${card("Milestones", milestones)}
  ${card("New today", list([...d.openedIssues.map((i) => ({ number: i.number, title: i.title, url: i.html_url, meta: "issue" })), ...d.openedPulls.map((p) => ({ number: p.number, title: p.title, url: p.html_url, meta: `PR by @${p.user.login}` }))], "Nothing new."))}
  <tr><td style="padding:8px 4px;${font}font-size:12px;color:${C.muted};text-align:center">
    <a href="${repoUrl}" style="color:${C.muted}">${esc(owner)}/${esc(repo)}</a> · sent by the Daily team report workflow
  </td></tr>
</table></td></tr></table></body></html>`;
}

async function send(html, subject) {
  const { default: nodemailer } = await import("nodemailer");
  const transport = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT ?? 465),
    secure: Number(env.SMTP_PORT ?? 465) === 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });
  const logo = await readFile(fileURLToPath(new URL("./logo.png", import.meta.url)));
  await transport.sendMail({
    from: env.REPORT_FROM || `GlobalLife AI <${env.SMTP_USER}>`,
    to: env.REPORT_TO,
    subject,
    html,
    attachments: [{ filename: "globallife-logo.png", content: logo, cid: "globallife-logo" }],
  });
}

const data = await collect();
const html = render(data);
const out = env.OUT ?? "report.html";
// The saved copy shows the logo from disk; the email uses the attached copy.
await writeFile(out, html.replace("cid:globallife-logo", "logo.png"));
const subject = `GlobalLife AI · Daily report · ${data.closedIssues.length} done, ${data.mergedPulls.length} merged, ${data.commits.length} commits`;
console.log(subject);

if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS && env.REPORT_TO) {
  await send(html, subject);
  console.log(`Sent to ${env.REPORT_TO.split(",").length} recipient(s).`);
} else {
  console.log("SMTP settings missing: report written to", out, "but not emailed.");
}
