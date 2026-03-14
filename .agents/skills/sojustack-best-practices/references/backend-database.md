# Backend Database

Use this reference when changing Drizzle tables, schema exports, relations, or backend persistence code that must match the existing database layout conventions.

## Drizzle

- Add tables in `apps/api/src/databases/tables/{name}.table.ts`.
- Export new tables from `drizzle.schema.ts`.
- Add or update relations in `drizzle.relations.ts`.
- Follow the existing schema naming and file placement conventions in the touched database area.
