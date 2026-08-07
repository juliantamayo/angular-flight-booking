# Component Styling

## Boundaries

- Keep each Angular component's styling in its own `styles/*.styles.scss` file.
- Name Angular component TS and HTML files with `.component`: `example.component.ts` and `example.component.html`.
- Name Angular component style files with `.styles`: `styles/example.styles.scss`.
- Point component metadata to `templateUrl: './example.component.html'` and `styleUrl: './styles/example.styles.scss'`.
- Shared placeholder styles can remain in `src/app/shared/styles/placeholder-page.scss`.
- Global app theme tokens belong in `design-system/assets/sass`; `src/styles.scss` only imports the design system entry points.
- Reusable Angular design-system components belong in `design-system/src/lib/components`.
- Do not move component-specific styles into global styles.

## Blocks

- Use the component/page concept as the block name.
- Root application layout: `app-shell`.
- Search page: `search-page`.
- Search form component: `search-form`.
- Flight results page: `results-page`.
- Shared placeholder pages: `placeholder-page`.

## Accessibility

- Keep keyboard focus styles visible.
- Preserve labels, `aria-label`, `aria-describedby`, and `aria-live`.
- When adding dynamic states, prefer class modifiers plus native disabled/expanded states where appropriate.
