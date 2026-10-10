# Contributing

A small team, a short path: every change goes through a pull request, CI checks it, the
team lead approves it, and it merges itself.

## The flow

```
Issue → branch → PR (auto-merge on) → CI + Task gate + CodeRabbit → lead approves → merged
```

1. **Work starts from an issue assigned to you.** Ask the team lead if you want a new one.
2. **Branch from fresh `master`**, named `<your-github-user>/<issue-number>-<short-name>`:

   ```bash
   git switch master && git pull
   git switch -c alice/12-visa-wizard
   ```

   One issue, one branch, one PR. Small PRs get reviewed fastest.
3. **Before pushing:** `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`, and open
   the screens you changed. For bigger changes, ask for a code review (an AI review or a
   teammate) before you push.
4. **Open the PR**, fill in the short template with `Closes #N`, and press
   **Enable auto-merge (squash)**.
5. **Automatic checks** run on every push:
   - **CI**: typecheck, unit tests, build, smoke test.
   - **Task gate**: the PR closes an open issue that is assigned to you.
   - **CodeRabbit**: an AI review with comments and suggestions. It advises; it does not
     block. Fix what is right, answer what is not.
6. **The team lead approves.** The PR then merges by itself and the issue closes. A push
   after the approval needs a fresh approval. The lead's own PRs are merged by hand with the
   bypass, since nobody else can approve them.

## What GitHub enforces on `master`

- No direct or force pushes; changes land only through a pull request, squash merged.
- CI (`Typecheck and build`) and `Task gate` must pass.
- One approval from the code owner (the team lead) on the latest push. GitHub does not let
  anyone approve their own PR, so the lead's own PRs use the lead's bypass.

Why it is this light: [ADR 0004](docs/adr/0004-simplify-the-workflow.md).

## Content rules

- Any visa rule, fee, duration or requirement shown to users links to its official source.
- No invented testimonials, logos, user counts or prices.
- No secrets or `.env` values in commits. Personal documents never go into the repo.
