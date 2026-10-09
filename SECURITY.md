# Security policy

## Reporting a vulnerability

Please do not open a public issue. Use GitHub's
[private vulnerability reporting](https://github.com/Tunaycel/globallife/security/advisories/new)
with steps to reproduce and the impact you expect. You will get an answer within 7 days.

## Scope

The application code in this repository. Third-party services (Google sign-in, hosting,
database provider) should be reported to their vendors.

## Handling secrets and personal data

- Secrets live in environment variables, never in the repository.
- Visa documents and other personal data are stored outside the repository, encrypted, and
  deletable by their owner.
