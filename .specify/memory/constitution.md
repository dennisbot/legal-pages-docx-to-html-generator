<!--
Sync Impact Report:
- Version: NEW → 1.0.0 (Initial constitution)
- Principles Defined: 5 core principles established
- Added Sections: Technology Standards, Error Handling Standards, Quality Gates
- Templates Status:
  ✅ constitution.md - Created with project principles
  ⚠ plan-template.md - Review required (ensure alignment with principles)
  ⚠ spec-template.md - Review required (ensure alignment with principles)
  ⚠ tasks-template.md - Review required (ensure alignment with principles)
- Follow-up TODOs: None - all fields populated
-->

# Privacy Notice Generator Constitution

## Core Principles

### I. Modern Web Best Practices First

Generated HTML MUST follow current web standards and best practices rather than replicating patterns from existing websites. Rationale: Existing sites may contain outdated or suboptimal implementations. By applying modern standards (semantic HTML, responsive design, accessibility), we ensure long-term maintainability and compliance.

**Rules**:
- Do NOT extract patterns from existing websites without critical evaluation
- DO apply current WHATWG HTML Living Standard and CSS specifications
- DO reference W3C recommendations and industry best practices
- DO validate all output against modern linting and validation tools

### II. Accessibility First (NON-NEGOTIABLE)

All generated HTML MUST meet WCAG 2.1 Level AA standards without exception. Accessibility is a legal requirement for privacy notices and a fundamental user right.

**Rules**:
- Color contrast ratios MUST meet minimum thresholds: 4.5:1 for normal text, 3:1 for large text (18pt+)
- Semantic HTML MUST be used (proper heading hierarchy, ARIA attributes where needed)
- Keyboard navigation MUST be fully supported
- Screen reader compatibility MUST be tested and verified
- Any configuration that violates WCAG 2.1 AA MUST trigger warnings and prevent silent failures

**Rationale**: Privacy notices are legal documents that must be accessible to all users regardless of abilities. Non-compliance exposes organizations to legal risk.

### III. Configuration Over Hardcoding

Styling values (colors, fonts, spacing, breakpoints) MUST be configurable via JSON or YAML files rather than hardcoded in source code.

**Rules**:
- Default configuration MUST follow best practices and meet all accessibility standards
- Custom configurations MUST be validated before use
- Configuration schema MUST be documented and versioned
- Invalid configurations MUST fail fast with clear error messages

**Rationale**: Different websites may require different branding while maintaining consistent structure. Configuration enables reuse without code modification.

### IV. Unix Philosophy - Composable CLI Tools

All tools MUST follow Unix design principles: do one thing well, text-based I/O, composable with other tools.

**Rules**:
- Input via command-line arguments or stdin
- Output to stdout (data) and stderr (diagnostics)
- Use specific exit codes (0-N) for different error conditions
- Support piping and redirection (e.g., `tool input.docx | clip`, `tool input.docx > output.html`)
- Never mix data and diagnostics in the same stream

**Rationale**: CLI tools that follow Unix conventions integrate seamlessly into scripts, CI/CD pipelines, and developer workflows.

### V. BEM Methodology for CSS

All generated CSS MUST follow BEM (Block Element Modifier) naming conventions with project-specific class namespaces.

**Rules**:
- Base class: `.text-block-content`
- Variant class: `.text-block-content--privacy-notice-content`
- All selectors MUST be scoped to these classes to prevent style leakage
- Follow BEM naming: `.block__element--modifier`
- No global styles or tag-only selectors

**Rationale**: 15+ websites share the same Umbraco CMS structure. BEM scoping ensures styles don't conflict with existing site styles.

## Technology Standards

### Responsive Breakpoints

All websites MUST use these standard breakpoints:

- **tiny**: 375px (mobile portrait)
- **small**: 768px (tablet portrait)
- **medium**: 992px (tablet landscape)
- **landscape**: 1024px (small desktop)
- **large**: 1200px (desktop)

Generated HTML MUST be tested and functional at all breakpoints.

### CSS Methodology

- Use SCSS for development when applicable
- Generate inline CSS for Umbraco RTE compatibility
- Support modern CSS features: Flexbox, CSS Grid, Custom Properties
- Target browsers: Chrome, Firefox, Safari, Edge (last 2 versions)

### Umbraco CMS Requirements

- Generated HTML MUST paste cleanly into Umbraco Rich Text Editor (RTE)
- Content MUST be fragment only (no `<html>`, `<head>`, `<body>`, `<header>`, `<footer>`, `<nav>`)
- Content MUST render correctly within `<main id="Main">` element
- Inline styles within `<style>` tags are acceptable

## Error Handling Standards

### Exit Codes

All CLI tools MUST use specific exit codes for different error conditions:

- **0**: Success
- **1**: File size exceeded
- **2**: File not found
- **3**: Invalid file format
- **4**: Corrupted file
- **5**: Unsupported structure
- **6**: Configuration error

Additional exit codes may be added but MUST be documented in tool specifications.

### Error Messages

- All errors MUST go to stderr (never stdout)
- Error messages MUST be descriptive and actionable
- Include relevant context (file paths, limits, expected formats)
- Format: `Error: <description>` with specific details

### Warnings

- Warnings MUST go to stderr
- Warnings MUST NOT prevent successful completion (exit code 0)
- Format: `Warning: <description>` with affected elements

## Quality Gates

### Accessibility Validation

- All generated HTML MUST pass automated WCAG 2.1 AA validation with 0 errors
- Color contrast MUST be validated programmatically
- Heading hierarchy MUST be validated (no skipped levels)
- ARIA attributes MUST be validated for correctness

### File Size Limits

- Input Word documents: 1MB maximum (prevents memory issues)
- Configuration files: 1MB maximum
- Larger files MUST be rejected with clear error messages

### Testing Requirements

For each feature:
- Unit tests for core conversion logic
- Integration tests for file I/O and error handling
- Accessibility tests for generated HTML
- Visual regression tests at all breakpoints (when applicable)

## Governance

This constitution represents the immutable principles governing all features in the Privacy Notice Generator project. Any code, configuration, or documentation that violates these principles MUST be rejected during review.

### Amendment Process

1. Propose amendment with clear rationale in GitHub issue
2. Discuss impact on existing features and specifications
3. Require approval from project maintainers
4. Update constitution version following semantic versioning:
   - **MAJOR**: Backward-incompatible principle removal or redefinition
   - **MINOR**: New principle or materially expanded guidance
   - **PATCH**: Clarifications, wording improvements, non-semantic refinements
5. Update all dependent templates and specifications
6. Document migration path for existing features if needed

### Compliance Verification

- All feature specifications MUST reference applicable principles
- All implementation plans MUST demonstrate compliance
- All pull requests MUST verify adherence to relevant principles
- Code reviews MUST explicitly check for constitutional compliance

### Exceptions

Exceptions to constitutional principles require:
- Explicit justification documented in feature specification
- Trade-off analysis (what we gain vs. what we violate)
- Approval from project maintainers
- Time-bound experiment status (reassess after defined period)

**Version**: 1.0.0 | **Ratified**: 2026-01-27 | **Last Amended**: 2026-01-27
