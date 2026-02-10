# Technology Research & Decisions

**Feature**: Privacy Notice HTML Generator
**Date**: 2026-01-27
**Purpose**: Evaluate technology choices for .docx to HTML conversion CLI tool

## Research Tasks

### 1. .docx Parsing Libraries

**Goal**: Find Node.js library that extracts semantic structure (headings, lists, tables) from .docx files

#### Evaluated Candidates

| Library | Version | Semantic Structure | Table Support | Active Maintenance | Notes |
|---------|---------|-------------------|---------------|-------------------|-------|
| **mammoth.js** | 1.6.0 | ✅ Excellent | ✅ Full | ✅ Active (2024) | Specifically designed for semantic conversion |
| docx.js | 8.3.0 | ⚠️ Limited | ✅ Full | ✅ Active | Better for *writing* .docx, not reading |
| officegen | 0.6.5 | ❌ No | ❌ No | ❌ Unmaintained | Write-only library, deprecated |

#### Decision

**SELECTED: mammoth.js (1.6.0)**

**Rationale**:
- Purpose-built for .docx → HTML semantic conversion
- Maintains document structure (headings, lists, tables) without manual parsing
- Returns structured HTML that can be post-processed
- Active maintenance and well-documented
- Battle-tested in production (used by major publishing platforms)

**Implementation Approach**:
```typescript
import * as mammoth from "mammoth";

const result = await mammoth.convertToHtml({ path: filePath }, {
  styleMap: [
    "p[style-name='Heading 1'] => h1",
    "p[style-name='Heading 2'] => h2",
    // ... style mappings for semantic conversion
  ]
});
```

**Alternatives Rejected**:
- **docx.js**: Focuses on writing/manipulating .docx files, not semantic reading
- **Direct OpenXML parsing**: Too low-level, would require implementing full .docx spec
- **officegen**: Unmaintained, write-only

---

### 2. HTML Generation Approach

**Goal**: Decide template engine vs. programmatic generation for type-safe, maintainable HTML output

#### Evaluated Candidates

| Approach | Type Safety | Maintainability | BEM Enforcement | Learning Curve | Notes |
|----------|-------------|-----------------|-----------------|----------------|-------|
| **Template Literals** | ✅ Full (TS) | ✅ Excellent | ✅ Enforceable | ✅ None | Native TypeScript, zero dependencies |
| JSX/TSX | ✅ Full | ✅ Excellent | ⚠️ Manual | ⚠️ Moderate | Requires React or Preact |
| Handlebars | ❌ Runtime only | ⚠️ String-based | ❌ No | ⚠️ Moderate | No compile-time safety |
| Custom Builder | ✅ Full | ⚠️ Complex | ✅ Enforceable | ❌ High | Over-engineered for this use case |

#### Decision

**SELECTED: Template Literals with TypeScript**

**Rationale**:
- Zero runtime dependencies (built into JavaScript/TypeScript)
- Full type safety at compile time
- Easy to enforce BEM conventions through helper functions
- Familiar to all TypeScript developers
- Allows tagged template literals for escaping/sanitization
- Direct mapping from mammoth output to final HTML

**Implementation Approach**:
```typescript
function generateHTML(content: ParsedContent, styles: string): string {
  return `
<style>
${styles}
</style>
<div class="text-block-content text-block-content--privacy-notice-content">
  ${content.html}
</div>`.trim();
}
```

**Helper Functions**:
- `escapeHTML(text: string)`: Sanitize user content
- `scopeSelector(selector: string)`: Enforce BEM scoping
- `generateStyles(config: Config)`: Create inline CSS from configuration

**Alternatives Rejected**:
- **JSX/TSX**: Adds React dependency unnecessarily, overkill for static HTML generation
- **Handlebars**: No type safety, runtime template compilation overhead
- **Custom Builder**: Would be maintainable but adds unnecessary complexity

---

### 3. Configuration Schema & Validation

**Goal**: Choose validation library for runtime config checking with great TypeScript DX

#### Evaluated Candidates

| Library | Runtime Validation | TypeScript Integration | Error Messages | Bundle Size | Notes |
|---------|-------------------|----------------------|----------------|-------------|-------|
| **Zod** | ✅ Excellent | ✅ Infers types | ✅ Excellent | ~57KB | Best-in-class DX |
| JSON Schema (AJV) | ✅ Excellent | ⚠️ Manual types | ⚠️ Technical | ~120KB | Industry standard |
| io-ts | ✅ Excellent | ✅ Infers types | ⚠️ Complex | ~15KB | Functional programming style |
| Manual validation | ✅ Custom | ✅ Manual | ❌ Poor | 0KB | Error-prone, unmaintainable |

#### Decision

**SELECTED: Zod (3.22.x)**

**Rationale**:
- Best developer experience for TypeScript projects
- Infers TypeScript types from schema (single source of truth)
- Excellent error messages for end users (not just technical JSON paths)
- Can generate JSON Schema for documentation
- Active maintenance and large community
- Reasonable bundle size for a CLI tool

**Implementation Approach**:
```typescript
import { z } from "zod";

const ConfigSchema = z.object({
  colors: z.object({
    text: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    background: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  }).refine(
    (colors) => meetsContrastRatio(colors.text, colors.background, 4.5),
    "Text and background colors must meet WCAG 2.1 AA contrast ratio (4.5:1)"
  ),
  typography: z.object({
    fontFamily: z.string(),
    baseFontSize: z.number().min(14).max(24),
    lineHeight: z.number().min(1.2).max(2.0),
  }),
  breakpoints: z.object({
    tiny: z.number().default(375),
    small: z.number().default(768),
    medium: z.number().default(992),
    landscape: z.number().default(1024),
    large: z.number().default(1200),
  }),
});

type Config = z.infer<typeof ConfigSchema>;
```

**Error Message Example**:
```
Configuration Error:
  colors.text: Expected format #RRGGBB, received "#fff"
  colors: Text and background colors must meet WCAG 2.1 AA contrast ratio (4.5:1)
```

**Alternatives Rejected**:
- **AJV**: Industry standard but verbose, error messages are JSON paths not user-friendly
- **io-ts**: Excellent library but functional programming style has learning curve
- **Manual**: Unmaintainable, error-prone, poor error messages

---

### 4. WCAG 2.1 AA Validation Tools

**Goal**: Automated accessibility testing integrated into conversion pipeline

#### Evaluated Candidates

| Tool | Programmatic API | WCAG 2.1 Coverage | False Positives | Integration | Notes |
|------|-----------------|-------------------|-----------------|-------------|-------|
| **axe-core** | ✅ Excellent | ✅ Comprehensive | ✅ Low | ✅ Node.js native | De facto standard |
| pa11y | ✅ Good | ✅ Good | ⚠️ Moderate | ✅ CLI & Node.js | Wrapper around axe-core/HTML CS |
| Lighthouse CI | ⚠️ CLI-focused | ✅ Comprehensive | ✅ Low | ⚠️ Requires Chrome | Heavyweight for CLI tool |
| Manual checks | ❌ No | ⚠️ Incomplete | ❌ N/A | ❌ No | Not scalable |

#### Decision

**SELECTED: axe-core (4.8.x)**

**Rationale**:
- Industry standard for accessibility testing (Deque Systems)
- Programmatic API designed for integration into build tools
- Comprehensive WCAG 2.1 Level A and AA rule coverage
- Low false positive rate (rules are well-tested)
- Can test HTML strings directly (no browser required for basic checks)
- Used by Google, Microsoft, Adobe, and major accessibility tools

**Implementation Approach**:
```typescript
import { Axe } from "axe-core";
import { JSDOM } from "jsdom";

async function validateAccessibility(html: string): Promise<AccessibilityResult> {
  const dom = new JSDOM(html);
  const results = await axe.run(dom.window.document, {
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa']
    }
  });

  return {
    passed: results.violations.length === 0,
    violations: results.violations.map(v => ({
      rule: v.id,
      description: v.description,
      impact: v.impact,
      nodes: v.nodes.map(n => n.html)
    }))
  };
}
```

**Color Contrast Validation**:
- Use separate color-contrast library (`color-contrast-checker` 2.1.0)
- Validate during configuration loading, not just generated HTML
- Reject configurations that would generate inaccessible HTML

**Alternatives Rejected**:
- **pa11y**: Good tool but adds unnecessary wrapper layer over axe-core
- **Lighthouse CI**: Requires full Chrome headless browser, overkill for CLI
- **Manual checks**: Not scalable, inconsistent, error-prone

---

### 5. CSS Generation Strategy

**Goal**: Generate responsive, BEM-scoped CSS from configuration with breakpoint support

#### Evaluated Candidates

| Approach | Breakpoint Handling | BEM Scoping | Inline Output | Type Safety | Notes |
|----------|-------------------|-------------|---------------|-------------|-------|
| **Template Literals** | ✅ Manual but simple | ✅ Full control | ✅ Native | ✅ TypeScript | Zero dependencies |
| cssinjs (JSS) | ✅ Built-in | ⚠️ Plugin needed | ✅ Supported | ✅ TypeScript | Adds 40KB+ |
| postcss | ✅ Plugins | ✅ Via plugin | ⚠️ Complex | ⚠️ Config-based | Build tool overhead |
| Sass/SCSS | ✅ Built-in | ✅ Manual | ❌ Compile step | ❌ No | Wrong layer (dev tool) |

#### Decision

**SELECTED: Template Literals with Helper Functions**

**Rationale**:
- CSS generation is straightforward for this use case (static styles, known structure)
- Template literals provide full control over output format
- No runtime dependencies or build complexity
- TypeScript ensures type-safe configuration → CSS mapping
- Easy to debug (just strings, no magic)
- Breakpoint generation is simple with helper functions

**Implementation Approach**:
```typescript
function generateCSS(config: Config): string {
  const { colors, typography, spacing, breakpoints } = config;

  return `
/* Base Styles */
.text-block-content {
  font-family: ${typography.fontFamily};
  font-size: ${typography.baseFontSize}px;
  line-height: ${typography.lineHeight};
  color: ${colors.text};
}

.text-block-content h1 {
  font-size: ${typography.baseFontSize * 2.5}px;
  margin-bottom: ${spacing.large}px;
  color: ${colors.headings};
}

/* Tables */
.text-block-content table {
  width: 100%;
  border-collapse: collapse;
  overflow-x: auto;
}

/* Responsive Breakpoints */
@media (max-width: ${breakpoints.small}px) {
  .text-block-content {
    font-size: ${typography.baseFontSize * 0.875}px;
  }

  .text-block-content table {
    display: block;
    overflow-x: scroll;
  }
}
`.trim();
}
```

**Helper Functions**:
- `scopeSelector(selector: string, base: string)`: Ensures all selectors start with `.text-block-content`
- `generateMediaQuery(breakpoint: number, rules: string)`: Wrap rules in media query
- `validateCSSOutput(css: string)`: Check for unscoped selectors

**Alternatives Rejected**:
- **cssinjs**: Adds unnecessary dependency and bundle size for static CSS generation
- **postcss**: Build tool complexity, overkill for runtime CSS generation
- **Sass/SCSS**: Wrong layer (development tool, not runtime tool)

---

## Summary of Decisions

| Category | Decision | Key Rationale |
|----------|----------|---------------|
| .docx Parsing | **mammoth.js 1.6.0** | Purpose-built for semantic conversion |
| HTML Generation | **Template Literals** | Zero deps, full type safety, simple |
| Configuration | **Zod 3.22.x** | Best TypeScript DX, great error messages |
| Accessibility | **axe-core 4.8.x** | Industry standard, comprehensive WCAG coverage |
| CSS Generation | **Template Literals** | Simple, maintainable, zero dependencies |

**Total Dependencies**: 4 primary libraries (mammoth, zod, axe-core, yargs) + dev dependencies

**Bundle Size Estimate**: ~800KB uncompressed, ~250KB minified (acceptable for Node.js CLI)

**Build Tools**:
- TypeScript 5.3+
- Vitest for testing
- esbuild for bundling (fast builds)

---

## Architecture Patterns

### 1. Error Handling

**Pattern**: Railway-oriented programming with Result types

```typescript
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

function parseDocx(filePath: string): Result<ParsedDocument, ParseError> {
  // Returns Result instead of throwing
}
```

**Exit Code Mapping**:
```typescript
const EXIT_CODES = {
  SUCCESS: 0,
  FILE_TOO_LARGE: 1,
  FILE_NOT_FOUND: 2,
  INVALID_FORMAT: 3,
  CORRUPTED_FILE: 4,
  UNSUPPORTED_STRUCTURE: 5,
  CONFIG_ERROR: 6,
} as const;
```

### 2. Configuration Cascade

**Pattern**: Layered configuration (defaults → file → CLI args)

```typescript
const finalConfig = {
  ...builtInDefaults,
  ...loadConfigFile(configPath),
  ...parseCliArgs(process.argv),
};
```

### 3. Pipeline Architecture

**Pattern**: Functional pipeline for transformation

```typescript
const result = await pipe(
  validateFileSize,
  parseDocx,
  extractStructure,
  generateHTML,
  injectStyles,
  validateAccessibility,
  outputToStdout
)(inputFilePath);
```

---

## Risk Mitigation

### Risk 1: mammoth.js Limited Style Mapping
**Mitigation**: Post-process HTML to normalize structure, add custom style map rules
**Contingency**: Fallback to direct OpenXML parsing for unsupported elements

### Risk 2: Configuration Complexity
**Mitigation**: Extensive default configuration, clear documentation, schema validation
**Contingency**: Provide configuration generator tool if users struggle

### Risk 3: WCAG Validation False Negatives
**Mitigation**: Combine axe-core with manual color contrast checks, heading hierarchy validation
**Contingency**: Add manual review checklist for edge cases

---

## Next Steps

1. ✅ Technology decisions finalized
2. ➡️ Proceed to Phase 1: Design & Contracts
   - Create `data-model.md` (configuration schema)
   - Create `contracts/config-schema.json` (JSON Schema export from Zod)
   - Create `contracts/cli-interface.md` (CLI specification)
   - Create `quickstart.md` (user guide)
3. ➡️ Proceed to Phase 2: Task Decomposition (`/speckit.tasks`)

---

**Research Status**: ✅ COMPLETE | All TBD items resolved | Ready for Phase 1
