## 1. CSS & Tailwind Configuration

- [x] 1.1 Replace `@media (prefers-color-scheme: dark)` with `.dark { }` selector in `src/app/globals.css`
- [x] 1.2 Verify Tailwind 4 dark mode strategy uses class-based detection (check/update config if needed)

## 2. Flash-Free Theme Initialization

- [x] 2.1 Add inline blocking `<script>` in `<head>` in `src/app/layout.tsx` that reads `localStorage` and applies `class="dark"` to `<html>` before first paint

## 3. ThemeToggle Component

- [x] 3.1 Create `src/components/ThemeToggle.tsx` as a `"use client"` component
- [x] 3.2 Implement toggle logic: read current theme from `localStorage` (fallback to `prefers-color-scheme`), toggle `.dark` on `<html>`, write to `localStorage`
- [x] 3.3 Render `Sun` icon in dark mode, `Moon` icon in light mode (from `lucide-react`)

## 4. Header Integration

- [x] 4.1 Import and render `<ThemeToggle />` in `src/components/layout/Header.tsx`
- [x] 4.2 Verify toggle button is visually consistent with header styling in both themes

## 5. Component Dark Mode Audit

- [x] 5.1 Audit `src/components/layout/Header.tsx` — patch any missing `dark:` classes
- [x] 5.2 Audit `src/components/layout/Footer.tsx` — patch any missing `dark:` classes
- [x] 5.3 Audit `src/components/tools/ToolCard.tsx` — patch hardcoded badge colors and any missing `dark:` classes
- [x] 5.4 Audit `src/components/ui/` (button, card, badge, input, select) — patch missing `dark:` classes
- [x] 5.5 Audit remaining page components in `src/app/` — patch any missing `dark:` classes

## 6. Verification

- [x] 6.1 Manually verify light mode renders correctly across Header, Footer, cards, buttons
- [x] 6.2 Manually verify dark mode renders correctly across Header, Footer, cards, buttons
- [x] 6.3 Verify theme persists after hard reload in both modes
- [x] 6.4 Verify no flash of wrong theme on load in both modes
- [x] 6.5 Verify OS preference is respected when no `localStorage` value exists
