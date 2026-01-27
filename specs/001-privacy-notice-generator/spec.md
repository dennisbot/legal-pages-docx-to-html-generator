# Feature Specification: Privacy Notice HTML Generator

**Feature Branch**: `001-privacy-notice-generator`
**Created**: 2026-01-27
**Status**: Draft
**Input**: User description: "Convert Word documents (.docx) to styled, accessible HTML fragments for Umbraco RTE with BEM conventions"

## Clarifications

### Session 2026-01-27

- Q: How does the user provide the Word document (.docx) to the system? → A: Command-line tool where user provides file path as argument
- Q: Where does the generated HTML output go? → A: Print to stdout (user can redirect to file or clipboard)
- Q: What is the maximum Word document file size the tool should support? → A: 1MB or less
- Q: How should the tool handle error scenarios (invalid file, corrupted .docx, missing file, etc.)? → A: Descriptive error messages to stderr with specific exit codes per error type
- Q: Should the tool support configuration for styling values (colors, fonts, spacing) or should all styles be hardcoded to match the existing 15 websites? → A: Configuration file (JSON/YAML) allowing customization of colors, fonts, etc., applying modern web best practices rather than extracting patterns from existing sites

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Generate HTML from Word Document (Priority: P1)

A legal team member has a privacy notice document in Word format that needs to be published to one of 15+ websites. They need to convert this document into HTML that can be pasted directly into the Umbraco CMS Rich Text Editor without manual formatting.

**Why this priority**: This is the core value - without document conversion, the feature provides no benefit. Legal team currently struggles with manual HTML formatting, which introduces errors and inconsistencies.

**Independent Test**: Can be fully tested by providing a .docx file with standard privacy notice content (headings, paragraphs, lists, tables) and verifying that clean, semantic HTML is generated that preserves the document structure.

**Acceptance Scenarios**:

1. **Given** a Word document with heading hierarchy (H1-H4), **When** the user provides the file path as a command-line argument, **Then** the system generates HTML with proper semantic heading tags (`<h1>`, `<h2>`, `<h3>`, `<h4>`) preserving the hierarchy
2. **Given** a Word document with bulleted and numbered lists, **When** the document is processed, **Then** the system generates proper `<ul>` and `<ol>` elements with `<li>` items
3. **Given** a Word document with tables, **When** the document is converted, **Then** the system generates proper `<table>` elements with `<thead>`, `<tbody>`, `<tr>`, `<th>`, and `<td>` tags
4. **Given** a Word document with formatted text (bold, italic, links), **When** converted, **Then** the system preserves formatting using semantic HTML (`<strong>`, `<em>`, `<a>`)
5. **Given** the generated HTML, **When** inspected, **Then** it contains NO wrapper elements like `<html>`, `<head>`, `<body>`, `<header>`, `<footer>`, or `<nav>` - only content elements

---

### User Story 2 - Apply Responsive, Accessible Styling (Priority: P2)

The generated HTML needs to work seamlessly across all 15 websites, which follow consistent BEM styling conventions. The HTML must be responsive (work on mobile and desktop) and meet accessibility standards required for legal compliance.

**Why this priority**: Without proper styling and accessibility, the HTML cannot be published to production websites. This is a blocker for legal compliance and user experience.

**Independent Test**: Can be tested by viewing the generated HTML on different screen sizes and using accessibility testing tools to verify WCAG 2.1 AA compliance.

**Acceptance Scenarios**:

1. **Given** the generated HTML, **When** inspected, **Then** it uses BEM class naming with `.text-block-content` as the wrapper class
2. **Given** the generated HTML for a privacy notice, **When** inspected, **Then** it includes the variant class `.text-block-content--privacy-notice-content`
3. **Given** the generated HTML with tables, **When** viewed on mobile devices (tiny/small breakpoints: 375px-768px), **Then** tables are horizontally scrollable (not stacked) to preserve data structure
4. **Given** the generated HTML, **When** inspected, **Then** all styles are inline within a `<style>` tag, not external stylesheets
5. **Given** the generated HTML, **When** inspected, **Then** all CSS selectors are scoped to `.text-block-content` or `.text-block-content--privacy-notice-content` to prevent style leakage
6. **Given** the generated HTML, **When** tested with accessibility tools, **Then** it passes WCAG 2.1 AA criteria including proper color contrast, semantic HTML, and keyboard navigation
7. **Given** the generated HTML with headings, **When** tested with screen readers, **Then** the heading hierarchy provides proper document outline without skipped levels

---

### User Story 3 - Preview HTML Before Use (Priority: P3)

Before copying the HTML fragment into the Umbraco RTE, users want to preview what it will look like in a browser to verify formatting, styling, and responsiveness.

**Why this priority**: This is a quality-of-life feature that reduces errors but is not required for core functionality. Users can paste directly into Umbraco RTE and preview there.

**Independent Test**: Can be tested by generating HTML and opening the preview, which should display the content in a browser-like environment.

**Acceptance Scenarios**:

1. **Given** generated HTML content, **When** the user requests a preview, **Then** the system wraps the HTML fragment in a minimal HTML page structure for viewing
2. **Given** the preview page, **When** opened in a browser, **Then** the content displays exactly as it will appear within the Umbraco RTE `<main id="Main">` element
3. **Given** the preview page, **When** resized to mobile dimensions (tiny: 375px, small: 768px), **Then** responsive behaviors (table scrolling, text reflow) function correctly

---

### Edge Cases

- What happens when a Word document contains unsupported elements (embedded objects, SmartArt, charts)? System should skip unsupported elements and generate HTML for supported content only, logging a warning about skipped elements.
- How does the system handle Word documents with custom styles or themes? System should extract structure and content while normalizing styles to match the BEM conventions, ignoring Word-specific styling.
- What happens when a Word document has deeply nested lists (4+ levels)? System should preserve nesting up to 4 levels and flatten deeper nesting to level 4 with a warning.
- How does the system handle very large tables that exceed typical screen widths? Tables should be wrapped in a scrollable container with visual indicators that more content is available horizontally.
- What happens when a Word document has no heading structure? System should generate content without headings but warn the user that accessibility may be impacted.
- How does the system handle special characters and Unicode content? System should properly encode all characters as UTF-8 in the HTML output.
- What happens when a Word document exceeds 1MB in size? System should immediately reject the file with a clear error message to stderr stating the file size limit and actual file size, with exit code 1.
- What happens when the file path does not exist? System should output descriptive error message to stderr "Error: File not found at path '{path}'" with exit code 2.
- What happens when the file is not a valid .docx format? System should output error message to stderr "Error: Invalid file format. Expected .docx file." with exit code 3.
- What happens when the .docx file is corrupted or cannot be parsed? System should output error message to stderr "Error: Corrupted or unreadable .docx file." with exit code 4.
- What happens when no configuration file is specified? System should use the default built-in configuration with modern web best practices.
- What happens when a custom configuration file path is invalid or file doesn't exist? System should output error message to stderr "Error: Configuration file not found at path '{path}'" with exit code 6.
- What happens when a configuration file contains invalid JSON/YAML syntax? System should output error message to stderr "Error: Configuration file is malformed. Invalid JSON/YAML syntax." with exit code 6.
- What happens when a configuration file contains colors that don't meet WCAG 2.1 AA contrast ratios? System should output warning to stderr but proceed with generation, noting which color combinations fail accessibility standards.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST be a command-line tool that accepts a file path to a Word document (.docx) as an argument and processes the file at that location
- **FR-002**: System MUST validate that the input file size does not exceed 1MB before processing; files exceeding this limit MUST be rejected with a clear error message to stderr and exit code 1
- **FR-003**: System MUST output the generated HTML to stdout, allowing users to redirect output to files, clipboard, or pipe to other tools; warnings and errors MUST be written to stderr to keep stdout clean
- **FR-004**: System MUST provide descriptive error messages to stderr for all error conditions, with specific exit codes per error type: 0 (success), 1 (file size exceeded), 2 (file not found), 3 (invalid file format), 4 (corrupted .docx file), 5 (unsupported document structure), 6 (configuration error)
- **FR-005**: System MUST extract document structure including headings (H1-H6), paragraphs, lists (bulleted and numbered), tables, and basic text formatting (bold, italic, underline)
- **FR-006**: System MUST generate HTML fragments containing only content elements (no `<html>`, `<head>`, `<body>`, `<header>`, `<footer>`, `<nav>`, or skip links)
- **FR-007**: System MUST wrap generated content in a container element with class `text-block-content text-block-content--privacy-notice-content`
- **FR-008**: System MUST generate inline CSS styles within a `<style>` tag as part of the HTML fragment
- **FR-009**: System MUST scope all CSS selectors to start with `.text-block-content` or `.text-block-content--privacy-notice-content` to prevent style conflicts
- **FR-010**: System MUST generate responsive styles using standard breakpoints (tiny: 375px, small: 768px, medium: 992px, landscape: 1024px, large: 1200px) where tables are horizontally scrollable on mobile devices (not stacked vertically)
- **FR-011**: System MUST preserve semantic HTML structure using proper heading hierarchy without skipped levels
- **FR-012**: System MUST generate accessible HTML that meets WCAG 2.1 AA standards including proper color contrast ratios (4.5:1 for normal text, 3:1 for large text)
- **FR-013**: System MUST maintain proper ARIA attributes where needed for enhanced accessibility
- **FR-014**: System MUST generate HTML that is ready to paste into Umbraco RTE within a `<main id="Main">` element
- **FR-015**: System SHOULD provide an optional preview flag that outputs a complete HTML page to stdout (instead of just the fragment) for browser testing
- **FR-016**: System MUST handle dynamic content structures where section names and order vary between privacy notice documents
- **FR-017**: System MUST convert Word tables into semantic HTML tables with proper `<thead>`, `<tbody>`, `<th>`, and `<td>` elements
- **FR-018**: System MUST preserve hyperlinks from Word documents as proper `<a>` tags with href attributes
- **FR-019**: System MUST support loading styling configuration from a JSON or YAML file that defines colors, fonts, spacing, and other design tokens
- **FR-020**: System MUST provide a default configuration file with modern web best practices for typography, colors (meeting WCAG 2.1 AA contrast ratios), spacing, and responsive design
- **FR-021**: System MUST allow users to specify a custom configuration file path via command-line argument (e.g., `--config path/to/config.yaml`)
- **FR-022**: System MUST validate the configuration file format and provide clear error messages if the file is missing, malformed, or contains invalid values

### Exit Codes

The tool uses specific exit codes to indicate different error conditions, enabling scripts to handle errors programmatically:

- **0**: Success - HTML generated successfully
- **1**: File size exceeded - Input file exceeds 1MB limit
- **2**: File not found - Specified file path does not exist
- **3**: Invalid file format - File is not a valid .docx format
- **4**: Corrupted file - .docx file cannot be parsed or is corrupted
- **5**: Unsupported document structure - Document contains structure that cannot be converted
- **6**: Configuration error - Configuration file is missing, malformed, or contains invalid values

### Key Entities *(include if feature involves data)*

- **Privacy Notice Document**: A Word document (.docx) containing legal privacy notice text with headings, paragraphs, lists, tables, and formatted text. Source document maintained by legal team.
- **HTML Fragment**: The generated output containing semantic HTML with inline styles, scoped to BEM classes, ready for Umbraco RTE. Does not include wrapper elements like html/head/body.
- **Style Configuration**: A JSON or YAML file containing design tokens (colors, fonts, spacing, breakpoints) that define the visual styling of generated HTML. Includes default configuration following modern web best practices.
- **Style Rules**: CSS rules scoped to `.text-block-content` and `.text-block-content--privacy-notice-content` classes following BEM conventions. Generated from Style Configuration and includes responsive behaviors and accessibility requirements.
- **Preview Wrapper**: Optional complete HTML page structure that wraps the HTML fragment for browser-based preview before deployment to Umbraco.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Legal team members can convert a Word document to usable HTML in under 2 minutes by running a single command (compared to current manual process taking 30+ minutes)
- **SC-002**: Generated HTML passes automated WCAG 2.1 AA accessibility validation with 0 errors for level A and AA criteria
- **SC-003**: Generated HTML renders correctly across all standard breakpoints (tiny: 375px, small: 768px, medium: 992px, landscape: 1024px, large: 1200px+) without horizontal overflow or layout breaks
- **SC-004**: 100% of generated HTML fragments paste into Umbraco RTE without requiring manual HTML editing or style corrections
- **SC-005**: Table content remains readable on mobile devices (tiny breakpoint: 375px) through horizontal scrolling without content truncation
- **SC-006**: Generated HTML maintains proper heading hierarchy with no skipped levels (e.g., H1 → H2 → H3, never H1 → H3)
- **SC-007**: Color contrast in generated HTML meets minimum ratios of 4.5:1 for normal text and 3:1 for large text (18pt+)
- **SC-008**: Users can successfully publish generated HTML to any of the 15+ websites without additional style modifications
- **SC-009**: Error messages provide clear, actionable information that allows users to diagnose and fix issues without requiring technical support

## Assumptions

- All 15+ websites use consistent BEM conventions with `.text-block-content` and `.text-block-content--privacy-notice-content` classes
- Default styling configuration follows modern web best practices for accessibility, responsive design, and typography rather than extracting patterns from existing 15 websites (which may not follow best practices)
- Umbraco RTE accepts inline styles within `<style>` tags in pasted HTML
- Word documents provided by legal team use standard Word formatting features (no complex macros or custom plugins)
- Privacy notice documents are typically text-heavy and do not exceed 1MB in file size
- Target browsers support modern CSS features including flexbox and CSS Grid for responsive layouts
- All websites use consistent responsive breakpoints: tiny (375px), small (768px), medium (992px), landscape (1024px), large (1200px)
- Users have basic understanding of copying HTML and pasting into Umbraco RTE
- Preview feature (if implemented) will be viewed in modern browsers (Chrome, Firefox, Safari, Edge - last 2 versions)
- Legal team members have access to the command-line tool and can provide file paths to Word documents on their local filesystem
- Users understand basic command-line operations including output redirection to files (> output.html) or clipboard (| clip on Windows, | pbcopy on Mac)
- Generated HTML does not need to support print stylesheets or PDF generation (handled by Umbraco)
