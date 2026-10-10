# ADR 0002: Enforce the workflow with three rulesets

- **Status:** accepted
- **Date:** 2026-10-10
- **Deciders:** @Tunaycel
- **Issue / PR:** #1

## Context

Only the team lead may merge, every contributor's PR needs the lead's approval, and nobody,
the lead included, may bypass CI or push to `master` directly. GitHub does not let anyone
approve their own PR, and a bypass applies to a whole ruleset, not to single rules.

## Decision

Three branch rulesets on the default branch, stored as JSON in `.github/rulesets/`:

1. **Protect master**, no bypass: PR required, CI green and up to date, threads resolved,
   squash only, no force push or deletion.
2. **Owner approval**, admin bypass through PRs only: code-owner approval on the latest push,
   stale approvals dismissed. The lead bypasses it on their own PRs only.
3. **Only the owner merges**, admin bypass through PRs only: the `update` rule.

## Alternatives considered

| Option | Why not |
|---|---|
| One ruleset with an admin bypass | The bypass also skips CI and thread resolution |
| Classic branch protection | Cannot express "only the owner merges" on a personal repo |
| Making the repo private | Rulesets are not enforced on private repos on the free plan |

## Consequences

The lead's merge box offers a bypass for the approval rule; using it on someone else's PR is
against the agreement in CONTRIBUTING.md, not technically blocked. The repo must stay public
(or move to a paid plan) for the rules to keep working.
