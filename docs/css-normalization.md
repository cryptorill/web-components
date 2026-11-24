# CSS Normalization Guide

This document explains the CSS normalization system for CryptoRill web components and how to achieve cross-browser consistency.

## Overview

We've implemented a **lightweight custom CSS normalization** (~400 bytes gzipped) specifically designed for Stencil.js Shadow DOM web components. This approach:

- ✅ Adds minimal bundle overhead
- ✅ Targets only elements we actually use
- ✅ Works within Shadow DOM boundaries
- ✅ Provides consistent base without overriding your theming
- ✅ Includes accessibility features (reduced motion, focus states)

## What the Normalize.css Includes

### 1. Box Model Normalization

```css
:host *,
:host *::before,
:host *::after {
  box-sizing: border-box;
}
```

**Why:** Ensures padding and borders don't affect element dimensions across all browsers.

### 2. Form Element Resets

- **Buttons:** Removes default browser styling (`appearance: none`)
- **Inputs:** Resets borders, backgrounds, outlines for clean styling
- **Number inputs:** Removes spinners consistently across browsers
- **Search inputs:** Removes decoration in Webkit/Safari

**Why:** Each browser has different default styles for form elements. Without normalization, you'd need to reset these manually in every component.

### 3. Interactive Elements

- **Tap highlight:** Removes default blue tap highlight on mobile
- **Touch callout:** Prevents iOS callout menu
- **Focus states:** Consistent focus ring styling

**Why:** Mobile browsers add visual feedback that often conflicts with custom designs.

### 4. Typography Improvements

- **Font smoothing:** Better text rendering on macOS/iOS
- **Text size adjust:** Prevents iOS zoom on orientation change

**Why:** Text can look thicker/thinner across different operating systems.

### 5. Scrollbar Normalization

- Thin, consistent scrollbars across browsers
- Uses CSS custom properties for theming

**Why:** Scrollbars look drastically different in Safari, Chrome, and Firefox.

### 6. Flexbox/Grid Fixes

- `min-width: 0` fix for flex items
- Prevents content overflow issues

**Why:** Some browsers don't handle flex item sizing consistently.

## Migration Guide

### Step 1: Remove Redundant Resets from Components

After adding the global normalize, you can remove manual resets from component CSS files:

**Before (in component CSS):**

```css
.cr-amount-input__field {
  background: transparent; /* REMOVE */
  border: none; /* REMOVE */
  outline: none; /* REMOVE */
  padding: 10px 12px;
  font-size: 16px;
}

.cr-price-alert__toggle {
  background: none; /* REMOVE */
  border: none; /* REMOVE */
  padding: 0; /* REMOVE */
  cursor: pointer;
}
```

**After:**

```css
.cr-amount-input__field {
  padding: 10px 12px;
  font-size: 16px;
  /* Resets are now handled globally */
}

.cr-price-alert__toggle {
  cursor: pointer;
  /* Resets are now handled globally */
}
```

### Step 2: Import Global Styles (Optional)

For components that need the normalization, you have two options:

**Option A: Global config (Recommended)**
The `globalStyle` is already configured in `stencil.config.ts`:

```typescript
globalStyle: 'src/global/normalize.css',
```

This automatically injects the normalize styles into all components.

**Option B: Per-component import**
For specific components that need the variables:

```css
@import '../../global/index.css';

:host {
  /* Component styles */
}
```

### Step 3: Use Shared Variables (Optional)

Replace repetitive variable definitions with shared tokens:

**Before:**

```css
:host {
  --cryptorill-price-ticker-font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --cryptorill-price-ticker-transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

**After:**

```css
:host {
  /* Import global variables first */
  @import '../../global/variables.css';

  /* Use shared tokens */
  font-family: var(--cryptorill-font-primary);
  --my-component-transition: var(--cryptorill-transition-fast);
}
```

## Browser Support

The normalization provides consistent styling for:

| Browser        | Version | Notes        |
| -------------- | ------- | ------------ |
| Chrome         | 88+     | Full support |
| Firefox        | 78+     | Full support |
| Safari         | 14+     | Full support |
| Edge           | 88+     | Full support |
| iOS Safari     | 14+     | Full support |
| Chrome Android | 88+     | Full support |

## Accessibility Considerations

### Reduced Motion

The normalize includes automatic reduced motion support:

```css
@media (prefers-reduced-motion: reduce) {
  /* Disables animations for users who prefer reduced motion */
}
```

### Focus Management

- Uses `:focus-visible` for keyboard-only focus indicators
- Respects user focus preferences
- Customizable focus ring color via `--cryptorill-focus-color`

## Troubleshooting

### "My component styles look different after adding normalize"

Check if you have conflicting resets. Remove any `background: transparent`, `border: none`, or `outline: none` declarations that are now handled globally.

### "Form elements still have browser styling"

Ensure the component's Shadow DOM is properly isolated. The `:host` selector in the normalize only affects elements inside the shadow tree.

### "Scrollbars don't look consistent"

Firefox uses `scrollbar-width` and `scrollbar-color` properties, while Webkit browsers use `::-webkit-scrollbar` pseudo-elements. Both are included in the normalize.

## Comparison with Alternatives

| Solution                 | Size    | Shadow DOM          | Flexibility    |
| ------------------------ | ------- | ------------------- | -------------- |
| **Our Custom Normalize** | ~400 B  | ✅ Native           | ✅ Tailored    |
| normalize.css            | ~2.5 KB | ❌ Needs adaptation | Generic        |
| reset.css                | ~1.5 KB | ❌ Needs adaptation | Too aggressive |
| sanitize.css             | ~1.8 KB | ❌ Needs adaptation | Opinionated    |

## Future Improvements

As the component library grows, consider:

1. **CSS Layer support** (`@layer`) when browser support improves
2. **Container query** normalization for more responsive componentseedxx
3. **Color scheme** preference detection for better dark mode support

## Related Files

- [`src/global/normalize.css`](../src/global/normalize.css) - The main normalization stylesheet
- [`src/global/variables.css`](../src/global/variables.css) - Shared design tokens
- [`stencil.config.ts`](../stencil.config.ts) - Global style configuration
