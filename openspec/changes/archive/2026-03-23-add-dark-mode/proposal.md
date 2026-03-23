## Why

The app has partial dark mode support via `prefers-color-scheme` media queries and scattered `dark:` Tailwind classes, but users have no way to manually switch themes. Adding a user-controlled toggle with preference persistence gives users explicit control regardless of their OS setting.

## What Changes

- Add a theme toggle button (sun/moon icon) to the site header
- Switch dark mode from media-query-only to class-based (`dark` on `<html>`) so user preference overrides OS setting
- Persist the selected theme in `localStorage` and restore it on page load (avoid flash of wrong theme)
- Audit and fill gaps in `dark:` coverage across all UI components

## Capabilities

### New Capabilities
- `theme-toggle`: User-controlled light/dark mode switch with localStorage persistence, rendered in the site header

### Modified Capabilities
<!-- No existing spec-level requirements are changing -->

## Impact

- `src/app/globals.css` — replace `@media (prefers-color-scheme: dark)` with `.dark` class selector
- `src/app/layout.tsx` — add inline script for flash-free theme restore on load
- `src/components/layout/Header.tsx` — add toggle button
- New client component `src/components/ThemeToggle.tsx`
- All components with hardcoded colors lacking `dark:` variants (audit needed)
- No API changes, no new dependencies (Lucide icons already available)
