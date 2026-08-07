---
name: skybooking-a11y
description: Reviews and improves accessibility in the SkyBooking Angular project, including semantic HTML, heading hierarchy, landmarks, buttons vs links, ARIA labels, form relationships, keyboard focus, live regions, and accessible component state. Use when changing Angular templates, building interactive UI, reviewing A11y issues, or fixing heading/order/ARIA problems.
license: MIT
metadata:
  author: SkyBooking UI
  version: '1.0'
---

# SkyBooking A11y Skill

## Scope

- Use this skill whenever a task touches Angular templates, interactive controls, form markup, route pages, dialogs, expandable panels, selected-state UI, or headings.
- Use this skill when the user mentions A11y, accessibility, screen readers, keyboard navigation, semantic HTML, headings, ARIA, labels, or focus.
- Pair with `skybooking-styling` when the task changes both visual structure and accessible markup.

## Default Decisions

- Keep exactly one visible `h1` per route-level page.
- Do not skip heading levels. Use `h2` for major page sections and `h3` for subsections inside those sections.
- Prefer native HTML semantics before ARIA: use `button` for actions, `a` for navigation, `fieldset`/`legend` for grouped form choices, and `dl` for name/value summaries.
- Use `aria-label`, `aria-labelledby`, or visually hidden text only when visible text does not provide the accessible name.
- Keep icons decorative with `aria-hidden="true"` when adjacent text already names the control or content.
- Bind state with native attributes where possible: `disabled`, `aria-expanded`, `aria-controls`, `aria-current`, and `aria-live`.
- Keep keyboard focus visible and do not remove outline without a replacement.
- Ensure dynamically revealed content follows the trigger in DOM order and has a stable `id` when referenced by `aria-controls`.
- Avoid using headings solely for visual size. Style classes can make `h2` look like a hero title when hierarchy requires `h2`.

## Workflow

1. Identify the route/page landmark and its `h1`.
2. Map major sections to `h2` and nested sections to `h3`.
3. Check interactive elements: links navigate, buttons perform actions.
4. Verify form controls have labels and grouped controls have `fieldset`/`legend`.
5. Verify expanded/selected/error states are announced or exposed where needed.
6. Keep BEM class names aligned with the semantic role of the element.
7. Run `npm run build` after template changes; ignore style budget warnings only when the user explicitly says to ignore budgets.

## References

- Heading and landmark rules: `references/headings-and-landmarks.md`.
- Interactive state and ARIA rules: `references/interactive-controls.md`.
