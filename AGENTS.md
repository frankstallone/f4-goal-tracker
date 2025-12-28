# Repository Guidelines

## Project Structure & Module Organization
- `app/` contains Next.js App Router routes, layouts, and pages.
- `components/` holds shared UI components; `components/ui/` is shadcn/ui output.
- `db/schema.sql` defines the Neon/Postgres schema.
- `lib/` for utilities; `lib/data/` for server data access; `lib/__tests__/` for Vitest specs.
- `public/` contains static assets served at `/`.
- Root configs include `next.config.ts`, `eslint.config.mjs`, `tsconfig.json`, and `components.json`.

## Shadcn Components (Base UI)
- Use the shadcn CLI with Base UI (keep `@base-ui/react` in deps).
- `components.json` drives style, aliases, and output (`aliases.ui` -> `components/ui`); keep it committed.
- Add components: `npx shadcn@latest add button`.
- Base UI registry: `npx shadcn@latest add @basecn/button` (or `https://basecn.dev/r/button.json`).
- If needed, register `@basecn` in `components.json` with `https://basecn.dev/r/{name}.json`.

## Build, Test, and Development Commands
- `npm run dev` starts the local dev server with hot reloading.
- `npm run build` creates the production build output.
- `npm run start` serves the production build locally.
- `npm run lint` runs ESLint using `eslint.config.mjs`.
- `npm run test` runs the Vitest suite once.
- `npm run test:watch` runs Vitest in watch mode.
- `npm run test:coverage` runs Vitest with coverage output.

## Coding Style & Naming Conventions
- Use TypeScript throughout the app; keep types close to the code that uses them.
- Follow the existing formatting in files you edit; no custom formatter is configured.
- Component files should use PascalCase names (e.g., `HeroSection.tsx`).
- Hooks and utilities should use camelCase (e.g., `usePricing.ts`, `formatCurrency.ts`).
- Route folder names under `app/` should map cleanly to URLs (avoid uppercase).

## Testing Guidelines
- Vitest 4 is the test runner. Place specs in `lib/__tests__/` (or alongside code) and name them `*.test.ts` / `*.test.tsx`.
- Focus tests on core ledger math, formatting, and data shaping before UI tests.

## Commit & Pull Request Guidelines
- Current history shows short, descriptive messages (e.g., `init: initial commit`). Continue with concise, imperative summaries; prefixes are optional but welcome.
- PRs should include: a short summary, the key UI changes, and screenshots/GIFs for visual updates. Link related issues if applicable.

## Configuration & Deployment Notes
- The repo is set up for Vercel; keep environment-specific values in `.env.local` (not committed) if needed.
- Neon uses `DATABASE_URL`; apply `db/schema.sql` to initialize the database.
- When changing build behavior, document it in `README.md` and verify with `npm run build`.
