# Data Model: Configuration Schema

**Feature**: Privacy Notice HTML Generator
**Date**: 2026-01-27
**Purpose**: Define configuration structure for styling customization

## Overview

The configuration file (YAML or JSON) defines all styling values used to generate HTML. This enables brand customization while maintaining accessibility and responsive design standards.

## Configuration Structure

### Root Schema

```typescript
interface PrivacyNoticeConfig {
  version: string;                    // Config schema version (semver)
  colors: ColorPalette;               // Color definitions with WCAG validation
  typography: TypographySettings;     // Font and text styling
  spacing: SpacingScale;              // Consistent spacing system
  breakpoints: ResponsiveBreakpoints; // Viewport breakpoints
  tables: TableStyling;               // Table-specific styles
  bem: BEMConfiguration;              // BEM class customization
}
```

---

## Entity Definitions

### ColorPalette

**Purpose**: Define colors for text, backgrounds, links, and interactive elements with automatic WCAG 2.1 AA validation

```typescript
interface ColorPalette {
  // Text colors
  text: HexColor;                // Body text (#000000 - #FFFFFF)
  textMuted: HexColor;           // Secondary text
  headings: HexColor;            // Heading colors
  links: HexColor;               // Hyperlink color
  linksHover: HexColor;          // Hyperlink hover state

  // Background colors
  background: HexColor;          // Page background
  tableHeader: HexColor;         // Table header background
  tableRowAlt: HexColor;         // Alternate table row background

  // Interactive elements
  focus: HexColor;               // Focus outline color (keyboard navigation)
}

type HexColor = string;  // Format: /^#[0-9A-Fa-f]{6}$/
```

**Validation Rules**:
- All hex colors must be 6 digits (no 3-digit shorthand)
- `text` and `background` must meet 4.5:1 contrast ratio
- `textMuted` and `background` must meet 4.5:1 contrast ratio
- `headings` and `background` must meet 4.5:1 contrast ratio (or 3:1 if font-size >= 18pt)
- `links` and `background` must meet 4.5:1 contrast ratio
- `focus` must be visually distinct from `background` (3:1 minimum)

**Default Values** (from `config/default-config.yaml`):
```yaml
colors:
  text: "#1a1a1a"           # Near-black (21:1 contrast with white)
  textMuted: "#666666"      # Gray (5.7:1 contrast with white)
  headings: "#000000"       # Black (21:1 contrast with white)
  links: "#0066cc"          # Accessible blue (7.8:1 contrast with white)
  linksHover: "#004499"     # Darker blue on hover
  background: "#ffffff"     # White
  tableHeader: "#f5f5f5"    # Light gray
  tableRowAlt: "#fafafa"    # Slightly lighter gray
  focus: "#0066cc"          # Same as links (keyboard focus)
```

---

### TypographySettings

**Purpose**: Define font families, sizes, weights, and line heights for readability

```typescript
interface TypographySettings {
  // Font families (system font stack or web fonts)
  fontFamily: FontStack;
  headingFontFamily?: FontStack;   // Optional separate font for headings

  // Base sizes (in pixels)
  baseFontSize: number;            // 14-24px, typically 16px
  baseLineHeight: number;          // 1.2-2.0, typically 1.5

  // Scale multipliers for headings
  scaleH1: number;                 // Multiplier for h1 (e.g., 2.5 = 40px at 16px base)
  scaleH2: number;                 // Multiplier for h2 (e.g., 2.0 = 32px)
  scaleH3: number;                 // Multiplier for h3 (e.g., 1.5 = 24px)
  scaleH4: number;                 // Multiplier for h4 (e.g., 1.25 = 20px)

  // Font weights
  fontWeightNormal: number;        // 400
  fontWeightBold: number;          // 700
  fontWeightHeadings: number;      // 600-700
}

type FontStack = string;  // e.g., "system-ui, -apple-system, Arial, sans-serif"
```

**Validation Rules**:
- `baseFontSize` must be between 14-24px
- `baseLineHeight` must be between 1.2-2.0 (WCAG recommends 1.5+ for body text)
- Scale multipliers must be > 1.0 for headings
- Font weights must be valid CSS values (100-900, multiples of 100)

**Default Values**:
```yaml
typography:
  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif"
  baseFontSize: 16
  baseLineHeight: 1.6
  scaleH1: 2.5      # 40px
  scaleH2: 2.0      # 32px
  scaleH3: 1.5      # 24px
  scaleH4: 1.25     # 20px
  fontWeightNormal: 400
  fontWeightBold: 700
  fontWeightHeadings: 600
```

---

### SpacingScale

**Purpose**: 8px-based spacing system for consistent vertical rhythm

```typescript
interface SpacingScale {
  xs: number;   // Extra small (4px)
  sm: number;   // Small (8px)
  md: number;   // Medium (16px)
  lg: number;   // Large (24px)
  xl: number;   // Extra large (32px)
  xxl: number;  // 2X extra large (48px)
}
```

**Usage**:
- **xs**: Tight spacing (inline elements, compact lists)
- **sm**: Base spacing unit (paragraph margins, list item padding)
- **md**: Section spacing (between content blocks)
- **lg**: Major section spacing (between main sections)
- **xl**: Page-level spacing (top/bottom page margins)
- **xxl**: Hero spacing (rarely used in privacy notices)

**Validation Rules**:
- All values must be multiples of 4px (8px grid system)
- Values must be in ascending order (xs < sm < md < lg < xl < xxl)

**Default Values**:
```yaml
spacing:
  xs: 4
  sm: 8
  md: 16
  lg: 24
  xl: 32
  xxl: 48
```

---

### ResponsiveBreakpoints

**Purpose**: Define viewport widths for responsive design (mobile-first)

```typescript
interface ResponsiveBreakpoints {
  tiny: number;      // Mobile portrait (375px)
  small: number;     // Tablet portrait (768px)
  medium: number;    // Tablet landscape (992px)
  landscape: number; // Small desktop (1024px)
  large: number;     // Desktop (1200px)
}
```

**Validation Rules**:
- All values must be in ascending order
- `tiny` must be >= 320px (minimum mobile size)
- Values typically in range 320px-1920px

**Default Values** (project standard):
```yaml
breakpoints:
  tiny: 375
  small: 768
  medium: 992
  landscape: 1024
  large: 1200
```

**Usage in Generated CSS**:
```css
/* Mobile-first approach */
.text-block-content { font-size: 14px; }

@media (min-width: 768px) {
  .text-block-content { font-size: 16px; }
}

@media (min-width: 1200px) {
  .text-block-content { font-size: 18px; }
}
```

---

### TableStyling

**Purpose**: Table-specific styling for responsive, accessible tables

```typescript
interface TableStyling {
  borderColor: HexColor;          // Table border color
  borderWidth: number;            // Border width in pixels (1-3px)
  cellPadding: number;            // Cell padding in pixels (8-16px)
  headerBackground: HexColor;     // Header row background
  headerTextColor: HexColor;      // Header text color
  stripedRows: boolean;           // Enable alternating row colors
  mobileScrollable: boolean;      // Enable horizontal scroll on mobile
}
```

**Validation Rules**:
- `borderWidth` must be 1-3px
- `cellPadding` must be 8-16px
- `headerTextColor` and `headerBackground` must meet 4.5:1 contrast ratio

**Default Values**:
```yaml
tables:
  borderColor: "#dddddd"
  borderWidth: 1
  cellPadding: 12
  headerBackground: "#f5f5f5"
  headerTextColor: "#1a1a1a"
  stripedRows: true
  mobileScrollable: true  # Horizontal scroll, not stack (per spec)
```

**Mobile Behavior** (when `mobileScrollable: true`):
```css
@media (max-width: 768px) {
  .text-block-content table {
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
  }
}
```

---

### BEMConfiguration

**Purpose**: Customize BEM class names for brand-specific variations

```typescript
interface BEMConfiguration {
  baseClass: string;      // Base block class (default: "text-block-content")
  variantClass: string;   // Variant modifier (default: "privacy-notice-content")
}
```

**Validation Rules**:
- Both classes must follow BEM naming: `[a-z][a-z0-9-]*`
- Cannot use double hyphens `--` or underscores `__` (reserved for BEM syntax)

**Default Values**:
```yaml
bem:
  baseClass: "text-block-content"
  variantClass: "privacy-notice-content"
```

**Generated CSS Scoping**:
```css
/* All selectors MUST be scoped */
.text-block-content { /* base styles */ }
.text-block-content--privacy-notice-content { /* variant styles */ }
.text-block-content h1 { /* element styles */ }

/* INVALID (unscoped) */
h1 { /* ERROR: Not scoped to base class */ }
```

---

## Configuration File Format

### YAML Example

```yaml
# privacy-notice-config.yaml
version: "1.0.0"

colors:
  text: "#1a1a1a"
  textMuted: "#666666"
  headings: "#000000"
  links: "#0066cc"
  linksHover: "#004499"
  background: "#ffffff"
  tableHeader: "#f5f5f5"
  tableRowAlt: "#fafafa"
  focus: "#0066cc"

typography:
  fontFamily: "Georgia, serif"
  baseFontSize: 16
  baseLineHeight: 1.6
  scaleH1: 2.5
  scaleH2: 2.0
  scaleH3: 1.5
  scaleH4: 1.25
  fontWeightNormal: 400
  fontWeightBold: 700
  fontWeightHeadings: 600

spacing:
  xs: 4
  sm: 8
  md: 16
  lg: 24
  xl: 32
  xxl: 48

breakpoints:
  tiny: 375
  small: 768
  medium: 992
  landscape: 1024
  large: 1200

tables:
  borderColor: "#dddddd"
  borderWidth: 1
  cellPadding: 12
  headerBackground: "#f5f5f5"
  headerTextColor: "#1a1a1a"
  stripedRows: true
  mobileScrollable: true

bem:
  baseClass: "text-block-content"
  variantClass: "privacy-notice-content"
```

### JSON Example

```json
{
  "version": "1.0.0",
  "colors": {
    "text": "#1a1a1a",
    "textMuted": "#666666",
    "headings": "#000000",
    "links": "#0066cc",
    "linksHover": "#004499",
    "background": "#ffffff",
    "tableHeader": "#f5f5f5",
    "tableRowAlt": "#fafafa",
    "focus": "#0066cc"
  },
  "typography": {
    "fontFamily": "Georgia, serif",
    "baseFontSize": 16,
    "baseLineHeight": 1.6,
    "scaleH1": 2.5,
    "scaleH2": 2.0,
    "scaleH3": 1.5,
    "scaleH4": 1.25,
    "fontWeightNormal": 400,
    "fontWeightBold": 700,
    "fontWeightHeadings": 600
  },
  "spacing": {
    "xs": 4,
    "sm": 8,
    "md": 16,
    "lg": 24,
    "xl": 32,
    "xxl": 48
  },
  "breakpoints": {
    "tiny": 375,
    "small": 768,
    "medium": 992,
    "landscape": 1024,
    "large": 1200
  },
  "tables": {
    "borderColor": "#dddddd",
    "borderWidth": 1,
    "cellPadding": 12,
    "headerBackground": "#f5f5f5",
    "headerTextColor": "#1a1a1a",
    "stripedRows": true,
    "mobileScrollable": true
  },
  "bem": {
    "baseClass": "text-block-content",
    "variantClass": "privacy-notice-content"
  }
}
```

---

## Validation Error Examples

### Color Contrast Failure

```
Configuration Error (exit code 6):
  colors.text and colors.background contrast ratio: 2.8:1
  Required: 4.5:1 (WCAG 2.1 AA for normal text)

  Suggestion: Use darker text color or lighter background
```

### Invalid Hex Color

```
Configuration Error (exit code 6):
  colors.links: Expected format #RRGGBB, received "#fff"

  Hint: Use 6-digit hex colors only (e.g., #ffffff)
```

### Spacing Not Multiple of 4

```
Configuration Error (exit code 6):
  spacing.md: 15
  Expected: Multiple of 4 (8px grid system)

  Suggestion: Use 12 or 16
```

---

## State Transitions

**Configuration Loading Flow**:

```
START
  ├─> Check file exists → (No) → Use built-in defaults → VALIDATE
  └─> (Yes) → Parse YAML/JSON
       ├─> Parse error → Exit code 6 (malformed)
       └─> Success → Merge with defaults → VALIDATE

VALIDATE
  ├─> Schema validation (Zod) → Fail → Exit code 6 (invalid structure)
  └─> Pass → Contrast validation
       ├─> Fail → Exit code 6 (WCAG violation)
       └─> Pass → Configuration ready → GENERATE HTML
```

---

## Relationships

```
Config (Root)
  ├── ColorPalette
  │   └── Used by: CSS Generator, A11y Validator
  ├── TypographySettings
  │   └── Used by: CSS Generator
  ├── SpacingScale
  │   └── Used by: CSS Generator
  ├── ResponsiveBreakpoints
  │   └── Used by: CSS Generator (media queries)
  ├── TableStyling
  │   └── Used by: CSS Generator (table-specific rules)
  └── BEMConfiguration
      └── Used by: CSS Scoper, HTML Generator
```

---

## Implementation Notes

1. **Default Configuration**: Ships as `config/default-config.yaml` in the package
2. **Configuration Discovery**: Looks for `.privacy-notice-config.yaml` in current directory if `--config` not specified
3. **Validation Order**: File existence → Parse → Schema → Contrast → Ready
4. **Error Handling**: All validation errors write to stderr with exit code 6
5. **Type Safety**: TypeScript types generated from Zod schema (single source of truth)

---

**Data Model Status**: ✅ COMPLETE | Configuration schema defined
