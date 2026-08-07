# Tokens And Variables

## Resolution Order

1. Reuse an existing CSS custom property from `design-system/assets/sass`.
2. Reuse an existing local value in the same component when it represents the same UI decision.
3. Add a new global token only when the value is shared across multiple components or part of the app theme.
4. Use a one-off literal only for unavoidable layout mechanics, such as `100dvh`, `1px` borders, or grid ratios.

## Token Groups

- Colors: `--color-*`
- Spacing: `--space-*`
- Radius: `--radius-*`
- Shadow: `--shadow-*`
- Button component decisions: `--button-*`
- Bottom summary component decisions: `--bottom-summary-*`
- Segmented control component decisions: `--segmented-control-*`

## Branding Source

The SkyBooking color system is defined in `design-system/assets/sass` from the branding guide:

- Brand colors use `--color-brand-*`.
- Neutral and text colors use semantic tokens such as `--color-background`, `--color-surface`, `--color-text-primary`, and `--color-border-default`.
- Status colors use stable semantic groups: `--color-success-*`, `--color-highlight-*`, `--color-warning-*`, `--color-error-*`, and `--color-info-*`.
- Fare category colors use `--fare-basic-*`, `--fare-classic-*`, and `--fare-flex-*`.
- Legacy aliases such as `--color-ink`, `--color-muted`, `--color-primary`, `--color-danger`, `--color-border`, and `--color-focus` exist only for compatibility with current components.

Do not add new literal color values in component stylesheets. Add a global token first, then consume the token.

## Fare Tokens

Fare tokens are defined in `design-system/assets/sass/tokens/colors/_fares.token.scss`.

Use the token families by fare category:

```scss
/* Basic */
--fare-basic-700: #52627a;
--fare-basic-100: #eef2f6;
--fare-basic-border: #cfd8e3;

/* Classic */
--fare-classic-700: #2354a3;
--fare-classic-100: #eaf1fc;
--fare-classic-border: #2354a3;

/* Flex */
--fare-flex-700: #087985;
--fare-flex-100: #e6f5f6;
--fare-flex-border: #73c2c8;

/* Business cabin */
--fare-business-surface: #151a21;
--fare-business-surface-strong: #10213f;
--fare-business-text: #ffffff;
--fare-business-muted: #cfd8e3;
--fare-business-border: #52627a;
--fare-business-classic-accent: #9ec5ff;
--fare-business-classic-action: #d7ecff;
--fare-business-flex-accent: #5ef2c5;
--fare-business-flex-action: #9ff8dd;
```

In components, map each category to local component variables such as `--fare-color`, `--fare-background`, and `--fare-border`. This keeps the component generic while the token family owns the brand decision.

Prefer tokens in component styles:

```scss
.search-form__field {
  gap: var(--space-1);
  padding: var(--space-2) var(--space-3);
}
```

Avoid adding parallel scales or naming schemes.
