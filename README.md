# Vibe Coding Community Platform

Modern community hub for the Vibe Coding ecosystem. Built with Next.js App Router, Prisma, Supabase PostgreSQL, and shadcn/ui to deliver forums, Q&A, and news in one cohesive experience.

## Prerequisites
- Node.js 20.x and npm 10.x (use `corepack enable` if pnpm is preferred)
- PostgreSQL URL (Supabase friendly) with migrations applied
- `.env` generated from `.env.example` and populated with Auth/Supabase credentials

## Getting Started
1. Install dependencies: `npm install`
2. Bootstrap the database: `npx prisma migrate deploy`
3. Generate Prisma client: `npx prisma generate`
4. Launch the dev server: `npm run dev` (http://localhost:3000)

For detailed contributor guidance, workflows, and tooling conventions see [`AGENTS.md`](./AGENTS.md).

## Key Scripts
- `npm run dev` – Start Next.js in development mode
- `npm run build` – Production build (runs type checking and bundles)
- `npm run start` – Serve the production build locally
- `npm run lint` – Lint with the project-wide flat ESLint config
- `npm run test:e2e` – Execute Playwright end-to-end suite (`test:e2e:ui` and `test:e2e:headed` available for debugging)

## Testing & Quality
- E2E specs live in `e2e/`; install browsers once with `npx playwright install`
- Linting is required before PRs merge; treat warnings as TODOs
- Accessibility smoke tests run via `@axe-core/playwright` (`e2e/accessibility.spec.ts`)

## Project Structure
- `src/app` – Next.js App Router routes, layouts, and server components
- `src/components` – Shared UI (shadcn/ui based) and feature widgets
- `src/lib` – Data access layer, Prisma client bootstrap, stores, and utilities
- `prisma/` – Schema and migrations (`migrations/` committed)
- `docs/` – Product requirements, architecture notes, and Zanzibar authorization blueprint

## Useful References
- [Product Requirements](./docs/PRD.md)
- [Authorization Matrix](./docs/API_Routes_Authorization_Matrix.md)
- [Zanzibar Permission System](./docs/Zanzibar_Permission_System.md)
- [Contributor Guide](./AGENTS.md)
