# Component CSS Migration Example

This document shows real examples of how component CSS files can be simplified after implementing the global CSS normalization.

## Example 1: cryptorill-amount-input

### Before (with manual resets)

```css
:host {
  --cryptorill-amount-input-font-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace;
  --cryptorill-amount-input-transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);

  display: block;
  font-family: var(--cryptorill-amount-input-font-mono);
}

/* Input field - needs manual reset */
.cr-amount-input__field {
  flex: 1;
  background: transparent; /* RESET - can remove */
  border: none; /* RESET - can remove */
  padding: 10px 12px;
  font-size: 16px;
  font-weight: 600;
  color: var(--cryptorill-amount-input-text);
  font-family: var(--cryptorill-amount-input-font-mono);
  outline: none; /* RESET - can remove */
}

.cr-amount-input__field::placeholder {
  color: var(--cryptorill-amount-input-text-muted);
  font-weight: 400;
}

.cr-amount-input__field:disabled {
  cursor: not-allowed;
}

/* Max button - needs manual reset */
.cr-amount-input__max-btn {
  padding: 4px 10px;
  background: rgba(0, 212, 170, 0.1);
  border: 1px solid var(--cryptorill-amount-input-primary); /* OVERRIDE - keep for styling */
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  color: var(--cryptorill-amount-input-primary);
  cursor: pointer;
  font-family: inherit;
  transition: all var(--cryptorill-amount-input-transition-fast);
}
```

### After (with global normalize)

```css
/* Import shared variables (optional, but recommended) */
@import '../../global/variables.css';

:host {
  display: block;
  font-family: var(--cryptorill-font-mono);
}

/* Input field - no manual resets needed! */
.cr-amount-input__field {
  flex: 1;
  padding: 10px 12px;
  font-size: 16px;
  font-weight: 600;
  color: var(--cryptorill-amount-input-text);
  /* background, border, outline are handled by normalize */
}

.cr-amount-input__field::placeholder {
  color: var(--cryptorill-amount-input-text-muted);
  font-weight: 400;
}

/* Max button - border is for styling, resets are automatic */
.cr-amount-input__max-btn {
  padding: 4px 10px;
  background: rgba(0, 212, 170, 0.1);
  border: 1px solid var(--cryptorill-amount-input-primary);
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  color: var(--cryptorill-amount-input-primary);
  /* background: transparent, border: none, padding: 0 handled by normalize */
}
```

**Lines saved: ~6 lines of reset code**

---

## Example 2: cryptorill-price-alert

### Before (with manual resets)

```css
/* Toggle button - needs full reset */
.cr-price-alert__toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none; /* RESET - can remove */
  border: none; /* RESET - can remove */
  cursor: pointer;
  padding: 0; /* RESET - can remove */
  font-family: inherit;
}
```

### After (with global normalize)

```css
/* Toggle button - clean and simple */
.cr-price-alert__toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  /* All resets are automatic! */
}
```

**Lines saved: ~4 lines of reset code**

---

## Example 3: Simplifying Theme Variables

### Before (each component repeats font definitions)

```css
/* Component A */
:host {
  --cryptorill-market-card-font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --cryptorill-market-card-font-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace;
  --cryptorill-market-card-transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --cryptorill-market-card-transition-base: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  font-family: var(--cryptorill-market-card-font-primary);
}

/* Component B */
:host {
  --cryptorill-price-ticker-font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --cryptorill-price-ticker-font-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace;
  --cryptorill-price-ticker-transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --cryptorill-price-ticker-transition-base: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  font-family: var(--cryptorill-price-ticker-font-primary);
}

/* Component C */
:host {
  --cryptorill-order-book-font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --cryptorill-order-book-font-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace;
  --cryptorill-order-book-transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  font-family: var(--cryptorill-order-book-font-primary);
}
```

### After (using shared variables)

```css
/* All components can use shared tokens */
@import '../../global/variables.css';

/* Component A */
:host {
  font-family: var(--cryptorill-font-primary);
}

/* Component B */
:host {
  font-family: var(--cryptorill-font-primary);
}

/* Component C */
:host {
  font-family: var(--cryptorill-font-primary);
}
```

**Benefits:**

- Consistent values across all components
- Easier to update fonts/transitions globally
- Reduced CSS bundle size
- Single source of truth for design tokens

---

## Migration Checklist

When updating existing components:

- [ ] Remove `background: transparent` from inputs
- [ ] Remove `border: none` from inputs/buttons (keep if adding custom border)
- [ ] Remove `outline: none` from inputs
- [ ] Remove `padding: 0` from buttons
- [ ] Remove `margin: 0` from form elements
- [ ] Remove `appearance: none` / `-webkit-appearance: none` (handled globally)
- [ ] Remove `font: inherit` (handled globally)
- [ ] Remove `color: inherit` (handled globally)
- [ ] Remove `cursor: pointer` from buttons (optional, global sets it)
- [ ] Replace per-component font/transition variables with shared tokens (optional)

---

## Quick Reference: What Gets Normalized

### Automatic (you can remove these from components):

```css
/* Inputs */
background: transparent;
border: none;
outline: none;
margin: 0;
padding: 0;
appearance: none;
-webkit-appearance: none;
font: inherit;
color: inherit;

/* Buttons */
background: transparent;
border: none;
padding: 0;
margin: 0;
appearance: none;
-webkit-appearance: none;
font: inherit;
color: inherit;
cursor: pointer;
text-align: inherit;

/* All elements */
box-sizing: border-box;
-webkit-tap-highlight-color: transparent;
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```

### Keep (these are for styling, not resets):

```css
/* Adding custom styling */
border: 1px solid var(--my-color); /* Keep - adds visible border */
background: var(--my-bg); /* Keep - adds background color */
padding: 12px; /* Keep - adds spacing */
border-radius: 8px; /* Keep - adds rounded corners */

/* Component-specific customization */
outline: 2px solid var(--focus-color); /* Keep - custom focus ring */
cursor: not-allowed; /* Keep - disabled state */
```

## Bundle Size Impact

| Approach                     | Size per Component | 23 Components Total |
| ---------------------------- | ------------------ | ------------------- |
| Manual resets (~5 lines avg) | ~100 bytes         | ~2,300 bytes        |
| Global normalize (one-time)  | ~400 bytes         | ~400 bytes          |
| **Savings**                  | -                  | **~1.9 KB**         |

Plus better maintainability and consistency!
