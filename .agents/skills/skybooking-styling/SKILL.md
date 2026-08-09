---
name: skybooking-styling
description: Creates, modifies, or reviews CSS/SCSS and Angular templates in the SkyBooking Angular project following local conventions for design tokens, BEM class names, component-scoped stylesheets, responsiveness, accessibility states, and build validation. Use when applying a design, creating or extracting a component, renaming classes, fixing styles, or reviewing styling conventions.
license: MIT
metadata:
  author: SkyBooking UI
  version: '1.0'
---

# SkyBooking Styling Skill

## Scope

- Use this skill whenever a task touches component HTML, inline Angular templates, global styles, or SCSS in this project.
- Use this skill when creating, extracting, renaming, or reviewing UI components and their class names.
- Use this skill when applying visual changes, responsive behavior, accessibility focus states, or design-token updates.
- Treat this file as workflow guidance; load reference files only when the task needs their detail.

## Default Decisions

- Source colors, spacing, radii, shadows, and state colors from `design-system/assets/sass` CSS custom properties.
- Do not hardcode new color, spacing, radius, or shadow values when an existing `--color-*`, `--space-*`, `--radius-*`, or `--shadow-*` token fits.
- Prefer scoped component stylesheets via `styleUrl`; keep page styles in the page stylesheet and reusable component styles in the component stylesheet.
- Name Angular component TS and HTML files with the `.component` suffix: `example.component.ts` and `example.component.html`.
- Name Angular component style files with the `.styles` suffix: `example.styles.scss`.
- Store component-owned SCSS inside a local `styles/` folder and point `styleUrl` to `./styles/example.styles.scss`.
- Keep shared SCSS files, such as placeholder page styles or global token imports, outside component `styles/` folders when they are intentionally reused.
- Use BEM for class names:
  - Block: standalone component or page root, such as `search-form`, `search-page`, `results-page`, `app-shell`, `placeholder-page`.
  - Element: `block__element`, such as `search-form__field`.
  - Modifier: `block__element--modifier` or `block--modifier`, such as `app-shell__language-button--active`.
- Keep page-level layout blocks separate from child component blocks. For example, `search-page` consumes `search-form`; do not rename it to `search-page__form`.
- Prefer semantic class names over visual names: `results-page__summary-term`, not `results-page__gray-label`.
- Do not chain BEM elements. Use `search-form__date-input`, not `search-form__dates__input`.
- Add BEM classes only to nodes that need styling, state, structure, or testing hooks.
- Use mobile-first SCSS and keep existing breakpoints unless the design needs a new one.
- Preserve accessibility affordances: visible focus states, `aria-*` attributes, labels, and live regions.
- Use the shared `app-icon` component for UI iconography. Register new Lucide icons in `src/app/shared/icons/app-icons.ts` and consume them through `src/app/shared/components/app-icon`; do not use HTML entities, raw Unicode symbols, or ad hoc inline SVG for functional UI icons.
- After style or template changes, run `npm run build` and fix template, style budget, or CSS warnings.

## References

- Design tokens and value decisions: `references/tokens-and-variables.md`.
- BEM naming and SCSS selector rules: `references/naming-and-linting.md`.
- Component stylesheet boundaries and Angular template rules: `references/component-styling.md`.
- Responsive behavior and layout decisions: `references/responsive-design.md`.
- Build validation and common warnings: `references/build.md`.
