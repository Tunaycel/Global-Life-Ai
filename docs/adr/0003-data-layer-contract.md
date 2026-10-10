# ADR 0003: Screens read data through a typed contract in src/lib

- **Status:** accepted
- **Date:** 2026-10-10
- **Deciders:** @Tunaycel
- **Issue / PR:** #6

## Context

Front-end and back-end work run in parallel by different people. Every screen holds its data
in hardcoded arrays today. The database does not exist yet.

## Decision

Screens call typed async functions in `src/lib/` (`getCountries()`, `getRoadmap(userId)`,
`saveProfile()`, ...). The first implementation returns mock data. The back end later replaces
the function bodies with real queries; signatures and screens do not change. Screens never
import data files or the database client directly. Contract types are approved by the team
lead because they become the database schema.

## Consequences

Front-end work is not blocked on the database. Changing a contract signature is a reviewed
change that names the screens it affects.
