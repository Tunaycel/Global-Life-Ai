# ADR 0004: Keep the workflow light while the team is small

- **Status:** accepted; supersedes parts of ADR 0002
- **Date:** 2026-10-10
- **Deciders:** @Tunaycel
- **Issue / PR:** #47

## Context

The first setup (ADR 0002) was built for a larger team: a nine-item checklist checked by the
Task gate, branches that had to be up to date with `master`, every review thread resolved,
CodeRabbit requesting changes, and only the owner allowed to press merge. With three people,
a one-line fix waited on several of those at once, and on the owner twice: once to approve,
once to merge.

## Decision

Keep what protects `master`, drop what only adds waiting:

- **Kept:** pull requests only, squash merges, CI and the Task gate as required checks, the
  code owner's approval on the latest push.
- **Dropped:** the up-to-date requirement, required thread resolution, the "Only the owner
  merges" ruleset, CodeRabbit's request-changes mode, the checklist and branch-name checks in
  the Task gate (the `<user>/<issue>-<name>` naming stays a convention).
- **Added:** auto-merge (a repository setting, not part of the rulesets). The author enables
  it; the PR merges as soon as the lead approves and the checks pass. The lead's own PRs
  cannot be approved by anyone else, so the lead merges them by hand with the bypass.

## Consequences

The lead's only job on a routine PR is one approval, which works from the phone. Two PRs that
pass alone can still conflict once both are merged; CI on `master` catches that. Revisit when
the team grows past five people or the product has real users.
