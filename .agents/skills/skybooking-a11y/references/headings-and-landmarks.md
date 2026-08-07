# Headings And Landmarks

## Route Pages

- Use one route-level `h1`.
- Use `section aria-labelledby="..."` when a section has a heading.
- Do not place a later `h1` after an `h2` or `h3` within the same route.
- If a later section visually needs large text, keep the semantic heading level and style it.

## Flight Results Pattern

- Before any flight is selected, use the active segment title as the page `h1`.
- After at least one segment is selected, use `h1` for "Resumen de viaje".
- Use `h2` for each selected segment inside the trip summary.
- Use `h2` for the next pending segment after the trip summary, such as return-flight results.
