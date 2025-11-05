# Repository Guidelines

## Project Structure & Module Organization
- Next.js App Router lives in `src/app` with route segments (e.g., `community/[category]/[postId]`).
- Shared UI and state live in `src/components`, `src/hooks`, `src/lib` (DAL, utilities), and `src/types`.
- Prisma schema and migrations sit in `prisma/`; regenerate the client when models change.
- E2E Playwright specs live in `e2e/`; keep fixtures alongside specs.
- Static assets live in `public/`; docs & research in `docs/` and `claudedocs/`; legacy prototypes remain in `src_vite/` (read-only unless refactoring).

## Build, Test, and Development Commands
- Install dependencies with `npm install` (Node 20+).
- `npm run dev` starts the Next.js dev server at `http://localhost:3000`.
- `npm run build` runs the production build; `npm run start` serves the compiled app.
- `npm run lint` executes the repo-wide ESLint config.
- `npm run test:e2e` executes headless Playwright tests (`npm run test:e2e:headed` for debugging, `npm run test:e2e:ui` for the inspector). Run `npx playwright install` once per machine.

## Coding Style & Naming Conventions
- TypeScript and React function components with two-space indentation and double quotes, auto-formatted via ESLint + Next rules.
- Use PascalCase for React components (`AnswerCard.tsx`), camelCase for variables and helper functions, kebab-case for route folders, and `useX` prefixes for hooks.
- Tailwind CSS 4 powers styling; prefer utility classes and `clsx`/`tailwind-merge` helpers in `src/lib`.
- Keep shared data-fetch logic in `src/lib` DAL modules and colocate component-specific styles next to the component.

## Testing Guidelines
- Maintain Playwright specs under `e2e/` using descriptive names like `community.spec.ts`; mirror user journeys in `src/app`.
- Add accessibility assertions with `@axe-core/playwright` when touching new flows.
- Run `npm run lint && npm run test:e2e` locally before raising a PR; document skipped tests and justify them.
- Target critical path coverage (community feed, auth flows, admin) and include seed/migration updates when tests require data.

## Commit & Pull Request Guidelines
- Follow the existing Conventional Commit pattern (`feat:`, `fix:`, `docs:`) with concise summaries (<60 chars) and bilingual context only when required.
- Reference issues or task IDs in the body; list co-authors with `Co-authored-by` if agents pair.
- PRs should include a short narrative, screenshots or console output for UI-affecting changes, test command results, and notes on schema or env variable changes.
- Keep PRs focused; split cross-cutting work into staging branches and call out follow-up tasks explicitly.

## Environment & Data
- Duplicate `.env.example` to `.env` and populate Supabase/Auth secrets before running auth or community features.
- After editing `prisma/schema.prisma`, run `npx prisma generate` and add migrations via `npx prisma migrate dev --name <change>`.
- Avoid committing seeded credentials or local `.next/` artifacts; ensure migrations and seed scripts stay idempotent.
