# Implementation Plan: Privacy Notice HTML Generator

**Branch**: `001-privacy-notice-generator` | **Date**: 2026-01-27 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-privacy-notice-generator/spec.md`

## Summary

Build a command-line tool that converts Word documents (.docx) to styled, accessible HTML fragments ready for Umbraco Rich Text Editor (RTE). The tool applies modern web best practices, BEM conventions, and WCAG 2.1 AA accessibility standards through a configurable JSON/YAML system. Output is fragment-only HTML (no wrapper elements) with inline CSS scoped to `.text-block-content` classes.

**Primary Requirement**: Convert .docx → semantic HTML with responsive, accessible styling
**Technical Approach**: Node.js/TypeScript CLI tool using mammoth.js for .docx parsing, custom HTML generation with template literals, YAML configuration, and axe-core for accessibility validation

## Technical Context

**Language/Version**: Node.js 20.x LTS with TypeScript 5.3+
**Primary Dependencies**:
- `mammoth` (0.6.x) - .docx to HTML conversion
- `js-yaml` (4.1.x) - YAML configuration parsing
- `yargs` (17.7.x) - CLI argument parsing
- `chalk` (5.3.x) - Terminal output formatting

**Storage**: N/A (stateless CLI tool, reads .docx files from filesystem)
**Testing**:
- `vitest` (1.1.x) - Unit and integration tests
- `@axe-core/cli` (4.8.x) - Accessibility validation
- `playwright` (1.40.x) - Visual regression tests at breakpoints

**Target Platform**: Cross-platform (Windows, macOS, Linux) via Node.js runtime
**Project Type**: Single project (CLI tool)
**Performance Goals**:
- Process 1MB .docx file in <2 seconds
- Generate HTML <10KB for typical privacy notice
- Zero memory leaks (process exits cleanly)

**Constraints**:
- Input file size: ≤1MB (prevent memory issues)
- Configuration file size: ≤1MB
- Output must be valid HTML5
- Generated CSS must pass WCAG 2.1 AA contrast validation

**Scale/Scope**:
- Single CLI executable
- ~15-20 TypeScript modules
- Support 15+ production websites
- 100% test coverage for core conversion logic

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Modern Web Best Practices First ✅ PASS
- **Compliance**: Using current HTML5 Living Standard and WCAG 2.1 AA guidelines
- **Evidence**: Default configuration will include modern semantic HTML patterns, not extracted from existing sites

### Principle II: Accessibility First (NON-NEGOTIABLE) ✅ PASS
- **Compliance**: WCAG 2.1 AA validation built into core conversion pipeline
- **Evidence**:
  - axe-core integration for automated testing
  - Configuration validation rejects non-compliant color contrasts
  - Semantic HTML generation enforced (proper heading hierarchy, ARIA attributes)

### Principle III: Configuration Over Hardcoding ✅ PASS
- **Compliance**: YAML/JSON configuration system for all styling values
- **Evidence**:
  - Default config file with best-practice values
  - `--config` flag for custom configurations
  - Schema validation with clear error messages

### Principle IV: Unix Philosophy - Composable CLI Tools ✅ PASS
- **Compliance**: stdout for HTML, stderr for diagnostics, specific exit codes
- **Evidence**:
  - Exit codes 0-6 for different error conditions
  - Never mix data and diagnostics streams
  - Supports piping: `tool file.docx | clip` or `tool file.docx > output.html`

### Principle V: BEM Methodology for CSS ✅ PASS
- **Compliance**: All CSS scoped to `.text-block-content` and `.text-block-content--privacy-notice-content`
- **Evidence**: CSS generator enforces BEM patterns, rejects global selectors

**Overall Status**: ✅ ALL PRINCIPLES SATISFIED - Proceed to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/001-privacy-notice-generator/
├── spec.md              # Feature specification
├── plan.md              # This file (/speckit.plan output)
├── research.md          # Phase 0 output (technology evaluation)
├── data-model.md        # Phase 1 output (configuration schema)
├── quickstart.md        # Phase 1 output (usage guide)
├── contracts/           # Phase 1 output (config schema, CLI API)
│   ├── config-schema.json
│   └── cli-interface.md
└── checklists/
    └── requirements.md  # Quality validation checklist
```

### Source Code (repository root)

```text
src/
├── cli/
│   ├── index.ts           # Main CLI entry point
│   ├── args-parser.ts     # yargs configuration
│   └── output.ts          # stdout/stderr management
├── converters/
│   ├── docx-parser.ts     # mammoth.js wrapper
│   ├── html-generator.ts  # HTML template generation
│   └── css-generator.ts   # Inline CSS from config
├── config/
│   ├── loader.ts          # YAML/JSON config loading
│   ├── validator.ts       # Schema validation
│   ├── defaults.ts        # Built-in default config
│   └── types.ts           # TypeScript config interfaces
├── validators/
│   ├── file-validator.ts  # File size, format checks
│   ├── a11y-validator.ts  # WCAG 2.1 AA validation
│   └── heading-validator.ts # Heading hierarchy checks
├── utils/
│   ├── error-handler.ts   # Exit codes, stderr formatting
│   └── bem-scoper.ts      # CSS selector scoping
└── index.ts               # Library entry (if needed)

tests/
├── fixtures/
│   ├── sample-privacy-notice.docx
│   ├── invalid-file.txt
│   └── test-configs/
│       ├── valid-config.yaml
│       └── invalid-config.yaml
├── unit/
│   ├── converters/
│   ├── config/
│   └── validators/
├── integration/
│   ├── cli.test.ts
│   ├── end-to-end.test.ts
│   └── error-handling.test.ts
└── visual/
    └── breakpoint-tests.spec.ts

config/
└── default-config.yaml    # Shipped default configuration
```

**Structure Decision**: Single project structure chosen because this is a standalone CLI tool with no separate frontend/backend/API layers. All functionality is self-contained in one executable with clear module separation by responsibility (CLI, conversion, configuration, validation).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*No violations detected - this section intentionally left empty*

---

## Phase 0: Research & Technology Evaluation

**Status**: ✅ COMPLETE

### Research Tasks

1. **.docx Parsing Libraries** ✅
   - **Selected**: mammoth.js (1.6.0)
   - **Rationale**: Purpose-built for semantic conversion, maintains document structure

2. **HTML Generation Approach** ✅
   - **Selected**: Template literals with TypeScript
   - **Rationale**: Zero dependencies, full type safety, simple and maintainable

3. **Configuration Schema Format** ✅
   - **Selected**: Zod (3.22.x)
   - **Rationale**: Best TypeScript DX, excellent error messages, type inference

4. **WCAG 2.1 AA Validation Tools** ✅
   - **Selected**: axe-core (4.8.x)
   - **Rationale**: Industry standard, comprehensive WCAG coverage, low false positives

5. **CSS Generation Strategy** ✅
   - **Selected**: Template literals with helper functions
   - **Rationale**: Simple, maintainable, zero dependencies, full control

### Decision Log Location

All research findings, decisions, and rationales documented in:
**`specs/001-privacy-notice-generator/research.md`** ✅

---

## Phase 1: Design & Contracts

**Status**: ✅ COMPLETE

### Deliverables

1. **data-model.md**: Configuration schema definition ✅
   - Color palette structure (with WCAG validation)
   - Typography settings (font families, sizes, line heights)
   - Spacing scale (based on 8px grid system)
   - Breakpoint definitions
   - BEM class configurations

2. **contracts/config-schema.json**: JSON Schema for configuration validation ✅
   - Required fields
   - Type definitions
   - Validation rules (contrast ratios, file paths)
   - Default values

3. **contracts/cli-interface.md**: CLI command specification ✅
   - Command syntax
   - Flags and options
   - Exit codes reference
   - Usage examples

4. **quickstart.md**: User guide ✅
   - Installation instructions
   - Basic usage examples
   - Configuration customization guide
   - Troubleshooting common errors

---

## Architecture Decisions

### 1. .docx Parsing Strategy ✅
- **Decision**: mammoth.js (1.6.0)
- **Rationale**: Purpose-built for semantic .docx → HTML conversion, maintains document structure (headings, lists, tables) without manual parsing
- **Alternatives Rejected**: Direct OpenXML parsing (too low-level), officegen (write-only)

### 2. HTML Generation Pattern ✅
- **Decision**: Template literals with TypeScript
- **Rationale**: Zero runtime dependencies, full type safety, easy BEM enforcement, familiar to all TypeScript developers
- **Alternatives Rejected**: JSX (requires React), Handlebars (no type safety)

### 3. Configuration Validation ✅
- **Decision**: Zod (3.22.x)
- **Rationale**: Best developer experience for TypeScript, infers types from schema (single source of truth), excellent error messages for end users
- **Alternatives Rejected**: JSON Schema/AJV (verbose, technical errors), io-ts (functional programming learning curve)

### 4. CSS Scoping Mechanism ✅
- **Decision**: Template literals with BEM helper functions
- **Rationale**: Simple, maintainable, zero dependencies, full control over output format
- **Alternatives Rejected**: cssinjs (unnecessary dependency), postcss (build tool overhead)

### 5. Testing Strategy ✅
- **Decision**: Vitest (unit + integration) + Playwright (visual regression) + axe-core (a11y)
- **Rationale**: Vitest for fast TypeScript testing, Playwright for cross-browser visual tests at all breakpoints, axe-core for comprehensive WCAG validation
- **Alternatives Rejected**: Manual testing (not scalable), screenshot diffing only (misses a11y issues)

---

## Next Steps

1. ~~**Phase 0 Execution**: Generate `research.md` by researching all TBD items above~~ ✅ COMPLETE
2. ~~**Phase 1 Execution**: Create data models and contracts based on research decisions~~ ✅ COMPLETE
3. **Phase 2 Planning**: Run `/speckit.tasks` to decompose into actionable development tasks

### Phase 1 Deliverables Summary

All design artifacts have been created:
- ✅ [research.md](./research.md) - Technology evaluation and decisions
- ✅ [data-model.md](./data-model.md) - Configuration schema definition
- ✅ [contracts/config-schema.json](./contracts/config-schema.json) - JSON Schema export
- ✅ [contracts/cli-interface.md](./contracts/cli-interface.md) - CLI specification
- ✅ [quickstart.md](./quickstart.md) - User installation and usage guide

**Ready for**: Task decomposition (`/speckit.tasks`)

---

**Plan Status**: Phase 0 ✅ | Phase 1 ✅ | Constitution Check: ✅ PASSED
