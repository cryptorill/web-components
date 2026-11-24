# CSS Naming Conventions

## Component Name Prefix

- Every component must have the "CryptoRill" prefix in its name
- Example: `CryptoRillPriceTicker` instead of `PriceTicker`
- File names should also reflect this: `cryptorill-price-ticker.tsx`

## Component-Level Classes

- Use component-scoped class names to avoid style leakage
- Prefix all CSS classes with `cryptorill-` followed by the component name in kebab-case
- Example: `.cryptorill-price-ticker` for the root element

## BEM Methodology (Block Element Modifier)

Follow BEM naming convention for component styling:

- **Block**: Component root class with `cryptorill-` prefix (e.g., `.cryptorill-price-ticker`)
- **Element**: Double underscore `__` (e.g., `.cryptorill-price-ticker__symbol`, `.cryptorill-price-ticker__price`)
- **Nested Element**: For deeply nested elements, use `cr-` prefix instead of full `cryptorill-` prefix (e.g., `.cr-price-ticker__inner-wrapper`)
- **Modifier**: Double dash `--` (e.g., `.cryptorill-price-ticker--up`, `.cryptorill-price-ticker__price--large`)

### BEM Examples

```css
/* Block */
.cryptorill-price-ticker {
}

/* Element */
.cryptorill-price-ticker__symbol {
}
.cryptorill-price-ticker__price {
}

/* Nested element (using cr- prefix) */
.cr-price-ticker__inner-wrapper {
}
.cr-price-ticker__icon {
}

/* Modifier on Block */
.cryptorill-price-ticker--up {
}
.cryptorill-price-ticker--down {
}

/* Modifier on Element */
.cryptorill-price-ticker__price--large {
}
```

## CSS Variables (Custom Properties)

- Use kebab-case for CSS variable names
- Prefix all CSS variables with `cryptorill-`
- Component-specific variables should include the component name
- Global variables should be defined in `:root`
- Examples:
  - `--cryptorill-price-ticker-bg-color`
  - `--cryptorill-price-ticker-text-color`
  - `--cryptorill-global-primary-color`
  - `--cryptorill-global-border-radius`

## File Naming

- CSS files must match the component name in kebab-case with `cryptorill-` prefix
- Example: `cryptorill-price-ticker.tsx` → `cryptorill-price-ticker.css`

## Selector Specificity

- Prefer single class selectors over nested selectors
- Keep specificity as low as possible
- Avoid using `!important` unless absolutely necessary
- Use `:host` selector for web component root styling

## Property Ordering

Group CSS properties in the following order:

1. Positioning (position, top, right, bottom, left, z-index)
2. Box Model (display, width, height, margin, padding, border)
3. Typography (font, line-height, text-align, color)
4. Visual (background, box-shadow, opacity)
5. Misc (transform, transition, animation)

## Color and Spacing

- Use CSS custom properties for all colors and spacing values
- Avoid hardcoding pixel values; use CSS variables or relative units
- Support both light and dark themes through CSS variables

## Responsive Design

- Use CSS custom properties for breakpoint values
- Prefer mobile-first approach with `min-width` media queries
- Container queries preferred over media queries when applicable
