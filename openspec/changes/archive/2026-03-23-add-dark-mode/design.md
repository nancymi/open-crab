## Context

The app uses Tailwind CSS 4 with CSS variables for base colors (`--background`, `--foreground`). Dark mode is currently applied via `@media (prefers-color-scheme: dark)` in `globals.css`, with `dark:` utility classes scattered across ~32 component locations. There is no user toggle and no preference persistence. The goal is to add explicit user control while keeping OS-preference as the default.

## Goals / Non-Goals

**Goals:**
- Class-based dark mode (`.dark` on `<html>`) so JS can override OS preference
- User toggle in the header (sun/moon icon via Lucide)
- Persist preference in `localStorage`; restore synchronously on load to prevent flash
- Audit and patch missing `dark:` coverage in existing components

**Non-Goals:**
- Per-page or per-component theme scoping
- Multiple theme variants beyond light/dark
- Animated transitions between themes
- Server-side theme resolution (SSR cookie approach)

## Decisions

### 1. Class-based vs. media-query dark mode

**Decision**: Replace `@media (prefers-color-scheme: dark)` with `.dark { }` selector in `globals.css`. Configure Tailwind to use `darkMode: 'class'` (already the default in Tailwind v4 when a `dark` variant is used with class strategy).

**Why**: Class-based is the only way to support user preference that overrides OS setting. Media-query approach cannot be toggled by JS.

**Alternative considered**: `darkMode: 'media'` — rejected because it makes user toggle impossible.

### 2. Flash-of-wrong-theme prevention

**Decision**: Inject a small inline `<script>` (blocking) in `<head>` inside `layout.tsx` that reads `localStorage` and adds `class="dark"` to `<html>` before the page renders.

**Why**: Next.js App Router renders on the server; the correct class must be present before first paint. A `useEffect`-based approach always causes a flash on hard reload.

**Alternative considered**: Cookie + server component — adds complexity (middleware, cookies API) for marginal benefit in a client-rendered context. Rejected for simplicity.

### 3. ThemeToggle component

**Decision**: Create `src/components/ThemeToggle.tsx` as a `"use client"` component. It reads initial state from `localStorage` (falling back to OS preference), toggles the `.dark` class on `<html>`, and writes to `localStorage`.

**Why**: Isolates theme logic in one place. Header stays a server component (or simple client component) — only ThemeToggle needs client-side hydration.

### 4. Icon choice

**Decision**: Use `Sun` and `Moon` from Lucide React (already a dependency).

**Why**: Zero new dependencies, consistent with existing icon usage in the codebase.

## Risks / Trade-offs

- **Inline script in `<head>`** → slight HTML payload increase and blocks parsing briefly. Mitigation: script is <200 bytes, standard practice for theme flash prevention.
- **`localStorage` unavailable in SSR** → `typeof window === 'undefined'` guard required in ThemeToggle. Mitigation: guarded in the inline script and in the component.
- **Missed `dark:` classes during audit** → some components may remain unthemed. Mitigation: systematic audit of all files in `src/components/` and `src/app/`.

## Open Questions

- Should the toggle default to OS preference when no `localStorage` value exists? (Assumed: yes — OS preference as default.)
- Should theme selection sync across tabs? (Assumed: not required for initial implementation; can be added via `storage` event listener later.)
