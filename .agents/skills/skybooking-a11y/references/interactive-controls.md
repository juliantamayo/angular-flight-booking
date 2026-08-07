# Interactive Controls

## Buttons And Links

- Use `button type="button"` for actions that change UI state.
- Use `a routerLink` only for route navigation.
- Include `aria-expanded` and `aria-controls` for buttons that reveal panels.
- Avoid clickable non-interactive elements.

## Selected State

- Use visible selected styling and an accessible label or state when selection matters.
- If a selected card has only a decorative check icon, keep the icon `aria-hidden="true"` and ensure surrounding text communicates the selected item.

## Dynamic Content

- Use `aria-live="polite"` for totals or status updates that appear after selection.
- Prefer keeping revealed content directly after its trigger or controlling section.
