# Release checklist: vX.Y.Z

- [ ] Milestone issues closed or moved
- [ ] `master` CI green
- [ ] `CHANGELOG.md` has a section for this version
- [ ] Database migrations reviewed and applied to staging
- [ ] Environment variables set in production
- [ ] Smoke test on staging: sign in, onboarding, visa analysis, assistant
- [ ] Every visa rule shown has a source and a check date
- [ ] Tag `vX.Y.Z` and GitHub release with notes from the changelog
- [ ] Production smoke test after deploy
- [ ] Rollback plan written down (previous tag, migration down steps)
