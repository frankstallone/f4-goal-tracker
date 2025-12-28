# Repository Guidelines

## Project Structure & Module Organization
- `app/` contains Next.js App Router routes, layouts, and pages.
- `components/` holds shared UI components. `components/ui/` is shadcn/ui output.
- `lib/` is for utilities and shared helpers.
- `public/` contains static assets served at `/` (images, icons, etc.).
- Config files live at repo root (e.g., `next.config.ts`, `eslint.config.mjs`, `tsconfig.json`).

## Shadcn Components (Base UI)
- This repo uses the shadcn CLI with Base UI support. It detects Base UI vs Radix, so keep Base UI in place (see `@base-ui/react` in `package.json`).
- `components.json` is required for CLI installs and controls style, aliases, and where components land (`aliases.ui` -> `components/ui`). Keep it committed.
- Add shadcn components with the CLI (example): `npx shadcn@latest add button`.
- To add Base UI-based components, use the BaseCN registry: `npx shadcn@latest add @basecn/button` or `npx shadcn@latest add https://basecn.dev/r/button.json`.
- Registry directory support is built into the CLI, so `@basecn/*` should work; if needed, add `@basecn` to `components.json` registries with `https://basecn.dev/r/{name}.json`.

## Build, Test, and Development Commands
- `npm run dev` starts the local dev server with hot reloading.
- `npm run build` creates the production build output.
- `npm run start` serves the production build locally.
- `npm run lint` runs ESLint using `eslint.config.mjs`.

## Coding Style & Naming Conventions
- Use TypeScript throughout the app; keep types close to the code that uses them.
- Follow the existing formatting in files you edit; no custom formatter is configured.
- Component files should use PascalCase names (e.g., `HeroSection.tsx`).
- Hooks and utilities should use camelCase (e.g., `usePricing.ts`, `formatCurrency.ts`).
- Route folder names under `app/` should map cleanly to URLs (avoid uppercase).

## Testing Guidelines
- No test framework is configured yet. If you add one, update `package.json` scripts and keep tests near the code (e.g., `app/**/__tests__/` or `components/**/__tests__/`) with filenames like `*.test.tsx`.

## Commit & Pull Request Guidelines
- Current history shows short, descriptive messages (e.g., `init: initial commit`). Continue with concise, imperative summaries; prefixes are optional but welcome.
- PRs should include: a short summary, the key UI changes, and screenshots/GIFs for visual updates. Link related issues if applicable.

## Configuration & Deployment Notes
- The repo is set up for Vercel; keep environment-specific values in `.env.local` (not committed) if needed.
- When changing build behavior, document it in `README.md` and verify with `npm run build`.
