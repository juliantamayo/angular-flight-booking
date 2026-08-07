# Naming And Linting

## BEM Rules

- Use lowercase kebab-case for every class segment.
- Use `block` for the root component or reusable UI area.
- Use `block__element` for meaningful child parts.
- Use `block--modifier` or `block__element--modifier` for variants and state.
- Avoid element chaining, visual names, and generic reusable names like `field`, `summary`, `status`, or `primary-button`.

## Angular State Classes

Bind modifiers directly:

```html
<button
  class="app-shell__language-button"
  [class.app-shell__language-button--active]="isActive"
>
```

## Selector Guidance

- Prefer class selectors over broad element selectors.
- Scope element selectors under a BEM block only when styling native structure is clearer.
- Keep selectors shallow and easy to search.
- Rename HTML/template classes and SCSS selectors in the same change.
