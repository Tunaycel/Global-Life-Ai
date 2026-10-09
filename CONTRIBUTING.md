# Contributing

Two people work on this repo. These rules are enforced by a branch ruleset on `master`;
they are not suggestions.

## The flow

```
Issue → branch → commits → local checks + two reviews → push → draft PR
      → CI green → ready for review → owner review → squash merge
```

1. **Every piece of work starts as an issue.** Use the *Task* or *Bug* template. The issue
   has acceptance criteria, an assignee and a milestone. No issue, no branch.
2. **Branch from fresh `master`**, named `<github-user>/<issue-number>-<short-name>`:

   ```bash
   git switch master && git pull
   git switch -c alice/12-visa-wizard
   ```

   One issue = one branch = one PR. Keep PRs small enough to review in one sitting.
3. **Commits** are short English sentences that say what changed
   (`Add eligibility step to the visa wizard`). Explain *why* in the body when it isn't obvious.
4. **Before every push**, in this order:
   1. `npx tsc --noEmit`
   2. `npm run lint` (no new errors)
   3. `npm run build`
   4. **Two independent code reviews** of the diff (for example two separate review passes
      with different tools or agents). Fix every real bug they find, then run 1–3 again.
      Push only when both come back clean.
   5. Open the changed screens in the browser and check them yourself.
5. **Open the PR as a draft**, fill in the template, link the issue with `Closes #N`.
   CodeRabbit reviews every push automatically. Fix what it finds or reply with the reason
   it does not apply; its comments are review threads, so they must be resolved before merging.
   When CI is green, CodeRabbit's threads are resolved and the checklist is done, mark it
   *Ready for review*.
6. **Review.** Both of us are code owners, and nobody can approve their own PR, so the
   collaborator's PRs need the owner's approval and the owner's PRs need the collaborator's
   (CODEOWNERS requests it automatically):
   - *Approve* – it can be merged.
   - *Request changes* – push fixes to the same branch. A new push dismisses the old approval,
     so the PR needs a fresh approval.
   - Every review conversation must be resolved before merging.
7. **Merge** is squash only, done by the owner, after approval and green CI.
   The branch is deleted automatically and the issue closes through `Closes #N`.

## What the ruleset enforces on `master`

- No direct pushes, no force pushes, no deleting the branch.
- Changes land only through a pull request.
Two rulesets, so the owner's merge right does not switch off the review rules:

- **Protect master** (no bypass, applies to everyone, the owner included):
  no direct pushes, no force pushes, no deleting the branch; changes land only through a PR;
  one code-owner approval on the latest push, stale approvals dismissed; all review threads
  resolved; CI (`Typecheck and build`, from GitHub Actions) green on a branch up to date with
  `master`; squash merge only.
- **Only the owner merges**: nobody can update `master` except the repository admin,
  and the admin only through a pull request.

## Content rules

- Any visa rule, fee, duration or requirement shown to users links to its official source.
- No invented testimonials, logos, user counts or prices.
- No secrets or `.env` values in commits. Personal documents never go into the repo.
