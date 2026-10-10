// Daily team report: collects the last day's activity from the GitHub API, renders a dark,
// email-safe HTML report and sends it over SMTP. Without SMTP settings it only writes the
// HTML file, which the workflow keeps as an artifact.
//
// Env: GITHUB_TOKEN, GITHUB_REPOSITORY (owner/repo), REPORT_HOURS (default 24),
// REPORT_TZ (default Europe/Istanbul), SMTP_HOST, SMTP_PORT (default 465), SMTP_USER,
// SMTP_PASS, REPORT_FROM, REPORT_TO (comma separated), OUT (default report.html).

import { readFile, writeFile } from "node:fs/promises";

const env = process.env;
const [owner, repo] = (env.GITHUB_REPOSITORY || "Tunaycel/globallife").split("/");
const hours = Number(env.REPORT_HOURS) > 0 ? Number(env.REPORT_HOURS) : 24;
const tz = env.REPORT_TZ || "Europe/Istanbul";
// A scheduled run reports up to the last 17:00 UTC, so a late cron start neither drops nor
// repeats activity between two daily reports.
const until = (() => {
  const now = new Date();
  if (env.GITHUB_EVENT_NAME !== "schedule") return now;
  const cut = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 17));
  return cut > now ? new Date(cut.getTime() - 86400_000) : cut;
})();
const since = new Date(until.getTime() - hours * 3600_000);
const inWindow = (iso) => Boolean(iso) && new Date(iso) >= since && new Date(iso) <= until;
const repoUrl = `https://github.com/${owner}/${repo}`;
const isBot = (login) => /\[bot\]$/i.test(login ?? "");
const isAiReviewer = (login) => /^coderabbitai(\[bot\])?$/i.test(login ?? "");
const roles = JSON.parse(await readFile(new URL("./team.json", import.meta.url), "utf8"));

async function request(url, attempt = 0) {
  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  // Secondary rate limits answer 403/429 with retry-after (seconds or an HTTP date); wait and
  // try again twice. Anything unreadable waits the full minute instead of retrying at once.
  const retryAfter = res.headers.get("retry-after");
  if ((res.status === 403 || res.status === 429) && retryAfter && attempt < 2) {
    const seconds = /^\d+$/.test(retryAfter.trim()) ? Number(retryAfter) : (Date.parse(retryAfter) - Date.now()) / 1000;
    const wait = Number.isFinite(seconds) ? Math.min(Math.max(seconds, 1), 60) : 60;
    await new Promise((done) => setTimeout(done, wait * 1000));
    return request(url, attempt + 1);
  }
  if (!res.ok) {
    const error = new Error(`${res.status} ${res.statusText} for ${url}`);
    error.status = res.status;
    throw error;
  }
  return res;
}

// Pages through a list endpoint. `stop(item)` ends paging early once a sorted list has gone
// past the report window.
async function gh(path, params = {}, stop) {
  const url = new URL(`https://api.github.com/repos/${owner}/${repo}${path}`);
  for (const [k, v] of Object.entries({ per_page: 100, ...params })) url.searchParams.set(k, v);
  const out = [];
  let next = url.toString();
  while (next) {
    const res = await request(next);
    const data = await res.json();
    if (!Array.isArray(data)) return data;
    out.push(...data);
    if (stop && data.some(stop)) break;
    next = res.headers.get("link")?.match(/<([^>]+)>;\s*rel="next"/)?.[1];
  }
  return out;
}

// Runs `fn` over `items` a few at a time, to stay clear of secondary rate limits.
async function each(items, fn, limit = 5) {
  const results = [];
  for (let i = 0; i < items.length; i += limit) {
    results.push(...(await Promise.all(items.slice(i, i + limit).map(fn))));
  }
  return results;
}

async function collect() {
  const { default_branch: defaultBranch } = await gh("");
  const iso = since.toISOString();
  const [collaborators, branches, milestones, openIssues, recentIssues, pulls, defaultCommits] = await Promise.all([
    gh("/collaborators", { affiliation: "direct" }).catch((error) => {
      if (error.status === 403 || error.status === 404) return [];
      throw error;
    }),
    gh("/branches"),
    gh("/milestones", { state: "open", sort: "due_on" }),
    gh("/issues", { state: "open" }),
    gh("/issues", { state: "all", since: iso }),
    gh("/pulls", { state: "all", sort: "updated", direction: "desc" }, (p) => new Date(p.updated_at) < since),
    gh("/commits", { sha: defaultBranch, since: iso }),
  ]);

  const recentPulls = pulls.filter((p) => new Date(p.updated_at) >= since && p.user);
  const openPulls = (await gh("/pulls", { state: "open" })).filter((p) => p.user);
  const mergedPulls = recentPulls.filter((p) => inWindow(p.merged_at));

  // Commits made in the window: those on PRs touched in the window (their branches may be
  // deleted already) and on live branches. Anything already on the default branch is left
  // out: squash commits repeat work counted on the PR, and branches contain master's history.
  // Squash commits of PRs merged into other branches (stacked PRs) and "Update branch" merge
  // commits are left out for the same reason.
  const counted = new Set([...defaultCommits.map((c) => c.sha), ...mergedPulls.map((p) => p.merge_commit_sha)]);
  const commits = new Map();
  const addCommit = (c) => {
    if (counted.has(c.sha) || c.parents?.length > 1 || !inWindow(c.commit.author?.date ?? c.commit.committer?.date)) return;
    const login = c.author?.login;
    if (isBot(login)) return;
    commits.set(c.sha, { login: login ?? `${c.commit.author?.name ?? "unknown"} (no GitHub account)`, linked: Boolean(login) });
  };
  (await each(recentPulls, (p) => gh(`/pulls/${p.number}/commits`))).flat().forEach(addCommit);
  (await each(branches.filter((b) => b.name !== defaultBranch), (b) => gh("/commits", { sha: b.name, since: iso })))
    .flat()
    .forEach(addCommit);

  const reviews = (await each(recentPulls, async (p) => (await gh(`/pulls/${p.number}/reviews`)).map((r) => ({ ...r, pr: p }))))
    .flat()
    .filter((r) => inWindow(r.submitted_at));
  // Replying to a review thread creates a COMMENTED review by the replier, so a review counts
  // once per reviewer and PR, and only on someone else's PR.
  const uniquePerPr = (list) => [...new Map(list.map((r) => [`${r.user.login}#${r.pr.number}`, r])).values()];
  const humanReviews = uniquePerPr(reviews.filter((r) => r.user && !isBot(r.user.login) && r.user.login !== r.pr.user.login));
  const aiReviews = reviews.filter((r) => r.user && isAiReviewer(r.user.login) && r.state !== "COMMENTED");

  const closedIssues = recentIssues.filter(
    (i) => !i.pull_request && i.state === "closed" && i.state_reason === "completed" && inWindow(i.closed_at),
  );
  const openedIssues = recentIssues.filter((i) => !i.pull_request && inWindow(i.created_at));
  const openedPulls = recentPulls.filter((p) => inWindow(p.created_at));
  const openTasks = openIssues.filter((i) => !i.pull_request);
  const mergedStats = new Map(
    await each(mergedPulls, async (p) => {
      const full = await gh(`/pulls/${p.number}`);
      return [p.number, { added: full.additions, removed: full.deletions }];
    }),
  );

  const people = new Map();
  const person = (login, linked = true) => {
    const key = login.toLowerCase();
    if (!people.has(key)) {
      people.set(key, {
        login, linked, role: roles[login] ?? "",
        commits: 0, prsOpened: 0, prsMerged: 0, reviews: 0, tasksClosed: 0, openTasks: 0, added: 0, removed: 0,
      });
    }
    return people.get(key);
  };
  collaborators.forEach((c) => person(c.login));
  Object.keys(roles).forEach((login) => person(login));
  if (!collaborators.some((c) => c.login.toLowerCase() === owner.toLowerCase())) person(owner);
  for (const c of commits.values()) person(c.login, c.linked).commits++;
  openedPulls.filter((p) => !isBot(p.user.login)).forEach((p) => person(p.user.login).prsOpened++);
  mergedPulls.filter((p) => !isBot(p.user.login)).forEach((p) => {
    const who = person(p.user.login);
    who.prsMerged++;
    who.added += mergedStats.get(p.number).added;
    who.removed += mergedStats.get(p.number).removed;
  });
  humanReviews.forEach((r) => person(r.user.login).reviews++);
  closedIssues.forEach((i) => (i.assignees ?? []).forEach((a) => person(a.login).tasksClosed++));
  openTasks.forEach((i) => (i.assignees ?? []).forEach((a) => person(a.login).openTasks++));

  const lead = owner.toLowerCase();
  const latestAiState = new Map();
  const leadReviewedHead = new Set();
  for (const r of (await each(openPulls, async (p) => (await gh(`/pulls/${p.number}/reviews`)).map((x) => ({ ...x, pr: p })))).flat()) {
    if (!r.user) continue;
    if (isAiReviewer(r.user.login) && r.state !== "COMMENTED") latestAiState.set(r.pr.number, r.state);
    if (r.user.login.toLowerCase() === lead && r.commit_id === r.pr.head.sha) leadReviewedHead.add(r.pr.number);
  }
  // Contributor PRs the lead has not reviewed at their latest commit, by AI first-check state.
  const contributorPulls = openPulls.filter(
    (p) => !p.draft && p.user.login.toLowerCase() !== lead && !isBot(p.user.login) && !leadReviewedHead.has(p.number),
  );

  return {
    people: [...people.values()].sort(
      (a, b) => b.tasksClosed + b.prsMerged + b.commits - (a.tasksClosed + a.prsMerged + a.commits) || a.login.localeCompare(b.login),
    ),
    commits: [...commits.values()],
    closedIssues, openedIssues, mergedPulls, mergedStats, openedPulls, openTasks, milestones,
    ai: {
      total: aiReviews.length,
      changesRequested: aiReviews.filter((r) => r.state === "CHANGES_REQUESTED").length,
      approved: aiReviews.filter((r) => r.state === "APPROVED").length,
    },
    readyForLead: contributorPulls.filter((p) => latestAiState.get(p.number) === "APPROVED"),
    blockedByAi: contributorPulls.filter((p) => latestAiState.get(p.number) === "CHANGES_REQUESTED"),
    waitingForAi: contributorPulls.filter((p) => !["APPROVED", "CHANGES_REQUESTED"].includes(latestAiState.get(p.number))),
    drafts: openPulls.filter((p) => p.draft),
  };
}

// ---------- rendering ----------

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const C = {
  bg: "#07070D", card: "#11111B", inset: "#171725", line: "#232336", text: "#ECECF4", soft: "#B4B4C8",
  muted: "#7D7D96", blue: "#0A84FF", violet: "#5E5CE6", green: "#30D158", amber: "#FFD60A", red: "#FF453A",
};
const F = "font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;";
const table = (attrs = "", style = "") =>
  `<table role="presentation" cellpadding="0" cellspacing="0" border="0" ${attrs} style="border-collapse:separate;${style}">`;

function section(title, inner, accent = C.blue) {
  return `<tr><td style="padding:0 0 14px">
  ${table(`width="100%" bgcolor="${C.card}"`, `background:${C.card};border:1px solid ${C.line};border-radius:16px`)}
    <tr><td style="padding:18px 22px 4px;${F}">
      ${table()}<tr>
        <td width="4" bgcolor="${accent}" style="background:${accent};border-radius:2px;font-size:0;line-height:0">&nbsp;</td>
        <td style="padding-left:10px;${F}font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${C.soft}">${esc(title)}</td>
      </tr></table>
    </td></tr>
    <tr><td style="padding:8px 22px 20px;${F}font-size:14px;line-height:1.5;color:${C.text}">${inner}</td></tr>
  </table></td></tr>`;
}

function rows(items, empty) {
  if (!items.length) return `<p style="margin:4px 0;color:${C.muted};${F}">${esc(empty)}</p>`;
  return table('width="100%"') + items.map((i, n) => `<tr>
    <td width="22" valign="top" style="padding:9px 0;${n ? `border-top:1px solid ${C.line};` : ""}${F}font-size:14px;color:${i.color ?? C.blue}">${i.icon ?? "•"}</td>
    <td valign="top" style="padding:9px 0;${n ? `border-top:1px solid ${C.line};` : ""}${F}font-size:14px;color:${C.text}">
      <a href="${esc(i.url)}" style="color:${C.text};text-decoration:none;font-weight:600">${esc(i.title)}</a>
      <div style="margin-top:2px;font-size:12px;color:${C.muted}">#${i.number}${i.meta ? ` · ${i.meta}` : ""}</div>
    </td></tr>`).join("") + "</table>";
}

function bar(pct, color = C.blue, height = 8) {
  const p = Math.max(0, Math.min(100, Math.round(pct)));
  return `${table(`width="100%" bgcolor="${C.line}"`, `background:${C.line};border-radius:${height}px`)}<tr>
    ${p ? `<td width="${p}%" bgcolor="${color}" style="height:${height}px;background:${color};background-image:linear-gradient(90deg,${color},${color === C.blue ? C.violet : color});border-radius:${height}px;font-size:0;line-height:0">&nbsp;</td>` : ""}
    ${p < 100 ? `<td style="height:${height}px;font-size:0;line-height:0">&nbsp;</td>` : ""}
  </tr></table>`;
}

const chip = (label, value, color = C.text) =>
  `<td style="padding:0 6px 6px 0">${table(`bgcolor="${C.inset}"`, `background:${C.inset};border:1px solid ${C.line};border-radius:10px`)}<tr>
    <td style="padding:7px 10px;${F}white-space:nowrap"><span style="font-size:15px;font-weight:800;color:${color}">${value}</span>
    <span style="font-size:11px;color:${C.muted};padding-left:4px">${label}</span></td></tr></table></td>`;

function render(d) {
  const day = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: tz }).format(until);
  const clock = (x) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: tz }).format(x);
  const assignees = (i) => (i.assignees ?? []).map((a) => `@${esc(a.login)}`).join(", ") || "unassigned";
  const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

  const headline = [
    d.closedIssues.length ? `${plural(d.closedIssues.length, "task")} finished` : "No tasks finished",
    d.mergedPulls.length ? `${plural(d.mergedPulls.length, "PR")} merged` : null,
    d.readyForLead.length ? `${plural(d.readyForLead.length, "PR")} waiting for your review` : null,
  ].filter(Boolean).join(" · ");

  const kpis = [
    ["Tasks done", d.closedIssues.length, C.green],
    ["PRs merged", d.mergedPulls.length, C.blue],
    ["Commits", d.commits.length, C.violet],
    ["Open tasks", d.openTasks.length, C.amber],
  ];
  const kpiRow = `<tr><td style="padding:0 0 14px">${table('width="100%"')}<tr>${kpis.map(([label, value, color], i) => `
    <td width="25%" valign="top" style="padding-right:${i < 3 ? 10 : 0}px">
      ${table(`width="100%" bgcolor="${C.card}"`, `background:${C.card};border:1px solid ${C.line};border-radius:16px`)}
        <tr><td height="3" bgcolor="${color}" style="height:3px;background:${color};border-radius:16px 16px 0 0;font-size:0;line-height:0">&nbsp;</td></tr>
        <tr><td style="padding:16px 16px 18px;${F}">
          <div style="font-size:32px;font-weight:800;line-height:1;color:${C.text}">${value}</div>
          <div style="margin-top:8px;font-size:12px;font-weight:600;color:${C.muted}">${label}</div>
        </td></tr>
      </table></td>`).join("")}</tr></table></td></tr>`;

  const attention = [
    ...d.readyForLead.map((p) => ({ icon: "●", color: C.amber, number: p.number, title: p.title, url: p.html_url, meta: `@${esc(p.user.login)} · passed the AI first check, needs your review` })),
    ...d.blockedByAi.map((p) => ({ icon: "●", color: C.red, number: p.number, title: p.title, url: p.html_url, meta: `@${esc(p.user.login)} · AI first check requested changes` })),
    ...d.waitingForAi.map((p) => ({ icon: "◌", color: C.muted, number: p.number, title: p.title, url: p.html_url, meta: `@${esc(p.user.login)} · waiting for the AI first check` })),
  ];

  const max = Math.max(1, ...d.people.map((p) => p.openTasks));
  const team = d.people.map((p, n) => `
    <tr><td style="padding:${n ? 16 : 4}px 0 14px;${n ? `border-top:1px solid ${C.line};` : ""}">
      ${table('width="100%"')}<tr>
        <td width="48" valign="top">${p.linked
          ? `<img src="https://github.com/${esc(p.login)}.png?size=96" width="40" height="40" alt="" style="display:block;border-radius:20px;border:1px solid ${C.line}">`
          : `<div style="width:40px;height:40px;border-radius:20px;background:${C.inset}"></div>`}</td>
        <td valign="top" style="${F}">
          ${p.linked ? `<a href="https://github.com/${esc(p.login)}" style="font-size:15px;font-weight:700;color:${C.text};text-decoration:none">@${esc(p.login)}</a>` : `<span style="font-size:15px;font-weight:700;color:${C.text}">${esc(p.login)}</span>`}
          ${p.role ? `<div style="font-size:12px;color:${C.muted}">${esc(p.role)}</div>` : ""}
          ${table("", "margin-top:10px")}<tr>
            ${chip("tasks done", p.tasksClosed, p.tasksClosed ? C.green : C.text)}
            ${chip("commits", p.commits)}
            ${chip("PRs merged", p.prsMerged)}
            ${chip("reviews", p.reviews)}
          </tr></table>
          <div style="margin:4px 0 6px;font-size:12px;color:${C.muted}">
            ${plural(p.prsOpened, "PR")} opened · <span style="color:${C.green}">+${p.added}</span> <span style="color:${C.red}">−${p.removed}</span> lines merged · ${plural(p.openTasks, "open task")}
          </div>
          ${bar((p.openTasks / max) * 100, C.violet, 6)}
        </td>
      </tr></table>
    </td></tr>`).join("");

  const byPerson = new Map();
  d.openTasks.forEach((i) => {
    const who = assignees(i);
    if (!byPerson.has(who)) byPerson.set(who, []);
    byPerson.get(who).push(i);
  });
  const workload = [...byPerson.entries()]
    .sort(([a], [b]) => (a === "unassigned") - (b === "unassigned") || a.localeCompare(b))
    .map(([who, items], n) => `
      <div style="margin:${n ? 16 : 0}px 0 4px;${F}font-size:13px;font-weight:700;color:${who === "unassigned" ? C.muted : C.text}">${who} <span style="font-weight:400;color:${C.muted}">· ${items.length}</span></div>
      ${rows(items.slice(0, 6).map((i) => ({ icon: "○", color: C.muted, number: i.number, title: i.title, url: i.html_url, meta: esc(i.milestone?.title ?? "") })), "")}
      ${items.length > 6 ? `<div style="${F}font-size:12px;color:${C.muted};padding-top:4px">+${items.length - 6} more</div>` : ""}`)
    .join("");

  const milestones = d.milestones.length
    ? d.milestones.map((m, n) => {
        const total = m.open_issues + m.closed_issues;
        const pct = total ? (m.closed_issues / total) * 100 : 0;
        return `<div style="margin:${n ? 14 : 0}px 0 7px">
          ${table('width="100%"')}<tr>
            <td style="${F}font-size:14px;font-weight:600"><a href="${esc(m.html_url)}" style="color:${C.text};text-decoration:none">${esc(m.title)}</a></td>
            <td align="right" style="${F}font-size:12px;color:${C.muted}">${m.closed_issues}/${total} · ${Math.round(pct)}%</td>
          </tr></table></div>${bar(pct)}`;
      }).join("")
    : `<p style="color:${C.muted}">No open milestones.</p>`;

  const ai = d.ai;
  const aiBlock = `${table()}<tr>${chip("AI reviews", ai.total)}${chip("changes requested", ai.changesRequested, ai.changesRequested ? C.red : C.text)}${chip("approved", ai.approved, ai.approved ? C.green : C.text)}</tr></table>
    <p style="margin:8px 0 0;${F}font-size:12px;color:${C.muted}">CodeRabbit is the first check on every PR; your review is the second.</p>`;

  const newItems = [
    ...d.openedPulls.map((p) => ({ icon: "↗", color: C.blue, number: p.number, title: p.title, url: p.html_url, meta: `PR by @${esc(p.user.login)}` })),
    ...d.openedIssues.map((i) => ({ icon: "+", color: C.muted, number: i.number, title: i.title, url: i.html_url, meta: `issue · ${assignees(i)}` })),
  ];

  return `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark"><meta name="supported-color-schemes" content="dark">
<title>GlobalLife AI · Daily report</title>
<!--[if mso]><style>table,td{font-family:Segoe UI,Arial,sans-serif!important}</style><![endif]-->
</head>
<body bgcolor="${C.bg}" style="margin:0;padding:0;background:${C.bg};-webkit-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;color:${C.bg}">${esc(headline)}</div>
${table(`width="100%" bgcolor="${C.bg}"`, `background:${C.bg}`)}<tr><td align="center" style="padding:28px 12px 36px">
<!--[if mso]><table role="presentation" width="680" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
${table('width="100%"', "max-width:680px")}

  <tr><td style="padding:0 0 14px">
    ${table(`width="100%" bgcolor="#101030"`, `background:#101030;background-image:linear-gradient(135deg,#0A2A5E 0%,#1B1650 55%,#101030 100%);border:1px solid #2A2A55;border-radius:20px`)}
      <tr><td style="padding:24px 24px 22px">
        ${table()}<tr>
          <td valign="middle" style="padding-right:14px"><img src="cid:globallife-logo" width="52" height="52" alt="GlobalLife AI" style="display:block;border-radius:14px"></td>
          <td valign="middle" style="${F}">
            <div style="font-size:22px;font-weight:800;letter-spacing:-.01em;color:#FFFFFF">GlobalLife AI</div>
            <div style="font-size:13px;color:#A9B4E0">Daily team report · ${esc(day)}</div>
          </td>
        </tr></table>
        <div style="margin-top:18px;${F}font-size:17px;font-weight:600;line-height:1.4;color:#FFFFFF">${esc(headline)}</div>
        <div style="margin-top:4px;${F}font-size:12px;color:#8E9AC8">${esc(clock(since))} – ${esc(clock(until))} · ${esc(tz)}</div>
      </td></tr>
    </table>
  </td></tr>

  ${kpiRow}
  ${attention.length ? section("Needs your attention", rows(attention, ""), C.amber) : ""}
  ${section("Completed", rows(d.closedIssues.map((i) => ({ icon: "✓", color: C.green, number: i.number, title: i.title, url: i.html_url, meta: assignees(i) })), "No tasks finished in this window."), C.green)}
  ${section("Merged", rows(d.mergedPulls.map((p) => ({ icon: "⇢", color: C.blue, number: p.number, title: p.title, url: p.html_url, meta: `@${esc(p.user.login)} · <span style="color:${C.green}">+${d.mergedStats.get(p.number).added}</span> <span style="color:${C.red}">−${d.mergedStats.get(p.number).removed}</span>` })), "Nothing merged in this window."), C.blue)}
  ${section("Team", `${table('width="100%"')}${team}</table>
    <p style="margin:10px 0 0;${F}font-size:12px;color:${C.muted}">Activity in the last ${hours} hours, not hours worked. The bar shows open tasks relative to the busiest person.</p>`, C.violet)}
  ${section("AI first check", aiBlock, C.violet)}
  ${section("Milestones", milestones, C.blue)}
  ${section("Open tasks by person", workload || `<p style="color:${C.muted}">No open tasks.</p>`, C.amber)}
  ${section("New in this window", rows(newItems.slice(0, 12), "Nothing new."), C.muted)}
  ${d.drafts.length ? section("Drafts in progress", rows(d.drafts.map((p) => ({ icon: "◌", color: C.muted, number: p.number, title: p.title, url: p.html_url, meta: `@${esc(p.user.login)}` })), ""), C.muted) : ""}

  <tr><td align="center" style="padding:14px 8px 0;${F}font-size:12px;line-height:1.6;color:${C.muted}">
    <a href="${repoUrl}" style="color:${C.soft};text-decoration:none;font-weight:600">${esc(owner)}/${esc(repo)}</a><br>
    Sent by the Daily team report workflow · <a href="${repoUrl}/issues" style="color:${C.muted}">Issues</a> · <a href="${repoUrl}/pulls" style="color:${C.muted}">Pull requests</a>
  </td></tr>
</table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr></table></body></html>`;
}

async function send(html, subject) {
  const { default: nodemailer } = await import("nodemailer");
  const port = Number(env.SMTP_PORT) || 465;
  const transport = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port,
    secure: port === 465,
    requireTLS: port !== 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });
  await transport.sendMail({
    from: env.REPORT_FROM || `GlobalLife AI <${env.SMTP_USER}>`,
    to: env.REPORT_TO,
    subject,
    html,
    attachments: [{ filename: "globallife-logo.png", content: await readFile(new URL("./logo.png", import.meta.url)), cid: "globallife-logo" }],
  });
}

const data = await collect();
const html = render(data);
const out = env.OUT || new URL("./report.html", import.meta.url);
// The saved copy shows the logo from disk; the email carries it as an inline attachment.
await writeFile(out, html.replace("cid:globallife-logo", "logo.png"));
const subject = `GlobalLife AI · ${data.closedIssues.length} done · ${data.mergedPulls.length} merged · ${data.readyForLead.length} waiting for review`;
console.log(subject);

if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS && env.REPORT_TO) {
  await send(html, subject);
  console.log(`Sent to ${env.REPORT_TO.split(",").length} recipient(s).`);
} else {
  console.log(`SMTP settings missing: report written to ${out} but not emailed.`);
}
