# Definition of Done (DoD)

A user story is **done only when all of these are true**:

- [ ] Acceptance criteria met and verified.
- [ ] Code merged to `main` via a reviewed, approved PR.
- [x] Unit + API tests added and passing.
- [ ] Runs on **both** target platforms without regressions.
- [ ] No new linter, type, or accessibility warnings introduced.
- [ ] Loading, empty, error, and offline states handled.
- [ ] Strings localized (no hardcoded user-facing text).
- [ ] Analytics / crash reporting events added where relevant.
- [ ] Documentation updated (feature doc, ADR if an architectural decision was made).

> A story that does not meet the full DoD is **not done** — it stays open. Partial work is not closed "to be finished later".