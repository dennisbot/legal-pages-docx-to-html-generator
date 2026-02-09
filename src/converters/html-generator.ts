import type { PrivacyNoticeConfig } from '../config/types.js';
import { transformTableElements, addDataLabels } from './html-transformer.js';

/**
 * Options for HTML generation
 */
export interface HTMLGenerationOptions {
  /** Configuration for styling */
  config: PrivacyNoticeConfig;
  /** Content HTML from .docx conversion */
  contentHTML: string;
  /** Enable preview mode (full HTML page) */
  previewMode: boolean;
}

/**
 * Generate HTML fragment with BEM class wrapper
 * T021: Implement HTML fragment generator
 * T022: Add BEM wrapper generation (text-block-content, text-block-content--privacy-notice-content)
 * T023: Ensure no wrapper elements (html/head/body/header/footer/nav)
 */
export function generateHTMLFragment(options: HTMLGenerationOptions): string {
  const { config, contentHTML, previewMode } = options;

  // Extract BEM classes from configuration
  const baseClass = config.bem.baseClass;
  const variantClass = config.bem.variantClass;
  const fullClass = `${baseClass} ${baseClass}--${variantClass}`;

  // Transform table elements with BEM classes
  let processedContent = transformTableElements(contentHTML, baseClass);

  // Add data-label attributes for responsive stacking
  if (config.tables.responsiveStacking) {
    processedContent = addDataLabels(processedContent, true);
  }

  // Generate inline CSS with responsive styles and BEM selectors
  const inlineCSS = generateCSS(config);

  // Create the HTML fragment
  const fragment = `<style>
${inlineCSS}
</style>
<div class="${fullClass}">
${processedContent}
</div>`;

  // Return fragment or preview page based on mode
  if (previewMode) {
    return wrapInPreviewPage(fragment, config);
  }

  return fragment;
}

/**
 * Generate complete CSS with responsive styles and table behavior
 * Includes media queries for all breakpoints and mobile table scrolling
 */
function generateCSS(config: PrivacyNoticeConfig): string {
  const { colors, typography, spacing, breakpoints, tables, bem } = config;
  const baseClass = bem.baseClass;

  // Base styles (mobile-first)
  const baseStyles = `
/* Base styles (mobile-first) */
.${baseClass} {
  font-family: ${typography.fontFamily};
  font-size: ${typography.baseFontSize}px;
  line-height: ${typography.baseLineHeight};
  color: ${colors.text};
  background-color: ${colors.background};
  max-width: 100%;
  overflow-wrap: break-word;
}

/* Typography - Base (mobile) */
.${baseClass} h1 {
  font-size: ${typography.baseFontSize * typography.scaleH1 * 0.75}px; /* Smaller on mobile */
  font-weight: ${typography.fontWeightHeadings};
  color: ${colors.headings};
  margin-top: ${spacing.lg}px;
  margin-bottom: ${spacing.md}px;
  line-height: 1.2;
}

.${baseClass} h2 {
  font-size: ${typography.baseFontSize * typography.scaleH2 * 0.8}px;
  font-weight: ${typography.fontWeightHeadings};
  color: ${colors.headings};
  margin-top: ${spacing.lg}px;
  margin-bottom: ${spacing.md}px;
  line-height: 1.3;
}

.${baseClass} h3 {
  font-size: ${typography.baseFontSize * typography.scaleH3 * 0.85}px;
  font-weight: ${typography.fontWeightHeadings};
  color: ${colors.headings};
  margin-top: ${spacing.md}px;
  margin-bottom: ${spacing.sm}px;
  line-height: 1.4;
}

.${baseClass} h4 {
  font-size: ${typography.baseFontSize * typography.scaleH4 * 0.9}px;
  font-weight: ${typography.fontWeightHeadings};
  color: ${colors.headings};
  margin-top: ${spacing.md}px;
  margin-bottom: ${spacing.sm}px;
  line-height: 1.4;
}

.${baseClass} p {
  margin-bottom: ${spacing.md}px;
}

/* Links */
.${baseClass} a {
  color: ${colors.links};
  text-decoration: underline;
}

.${baseClass} a:hover {
  color: ${colors.linksHover};
}

.${baseClass} a:focus {
  outline: 2px solid ${colors.focus};
  outline-offset: 2px;
}

/* Lists */
.${baseClass} ul,
.${baseClass} ol {
  margin-bottom: ${spacing.md}px;
  padding-left: ${spacing.lg}px;
}

.${baseClass} li {
  margin-bottom: ${spacing.sm}px;
}

/* Tables - Base structure */
.${baseClass}__table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: ${spacing.lg}px;
  border: ${tables.borderWidth}px solid ${tables.borderColor};
  ${tables.roundedCorners && tables.borderRadius ? `border-radius: ${tables.borderRadius}px; overflow: hidden;` : ''}
}

.${baseClass}__table-head {
  /* Structural element, inherits from table */
}

.${baseClass}__table-body {
  /* Structural element, inherits from table */
}

/* Table Rows */
.${baseClass}__table-row {
  border-bottom: ${tables.borderWidth}px solid ${tables.borderColor};
  ${tables.hoverHighlight ? `transition: background-color 0.15s ease;` : ''}
}

.${baseClass}__table-row:last-child {
  border-bottom: none;
}

/* Hover state for data rows */
${
  tables.hoverHighlight && tables.hoverColor
    ? `
.${baseClass}__table-body .${baseClass}__table-row:hover {
  background-color: ${tables.hoverColor};
}
`
    : ''
}

/* Striped rows */
${
  tables.stripedRows
    ? `
.${baseClass}__table-body .${baseClass}__table-row:nth-child(even) {
  background-color: ${colors.tableRowAlt};
}
`
    : ''
}

/* Table Cells */
.${baseClass}__table-cell {
  padding: ${tables.cellPadding}px;
  text-align: left;
  border-right: ${tables.borderWidth}px solid ${tables.borderColor};
}

.${baseClass}__table-cell:last-child {
  border-right: none;
}

/* Header Cells */
.${baseClass}__table-cell--header {
  background-color: ${tables.headerBackground};
  color: ${tables.headerTextColor};
  font-weight: ${typography.fontWeightBold};
}

/* Sticky header for long tables */
.${baseClass}__table-head .${baseClass}__table-row--header .${baseClass}__table-cell--header {
  position: sticky;
  top: 0;
  z-index: 10;
}

/* Mobile: Compact padding */
${
  tables.compactMobile && tables.mobilePadding
    ? `
@media (max-width: ${breakpoints.small - 1}px) {
  .${baseClass}__table-cell {
    padding: ${tables.mobilePadding}px;
    font-size: ${typography.baseFontSize * 0.875}px;
  }
}
`
    : ''
}

/* Mobile: Horizontal scroll */
${
  tables.mobileScrollable && !tables.responsiveStacking
    ? `
@media (max-width: ${breakpoints.small - 1}px) {
  .${baseClass}__table {
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
}
`
    : ''
}

/* Mobile: Responsive stacking (definition list layout) */
${
  tables.responsiveStacking
    ? `
@media (max-width: ${breakpoints.small - 1}px) {
  .${baseClass}__table,
  .${baseClass}__table-head,
  .${baseClass}__table-body,
  .${baseClass}__table-row {
    display: block;
    width: 100%;
  }

  .${baseClass}__table-head {
    display: none; /* Hide headers, they'll be inline */
  }

  .${baseClass}__table-row {
    margin-bottom: ${spacing.md}px;
    border: ${tables.borderWidth}px solid ${tables.borderColor};
    ${tables.roundedCorners && tables.borderRadius ? `border-radius: ${tables.borderRadius}px;` : ''}
  }

  .${baseClass}__table-cell {
    display: block;
    width: 100%;
    text-align: left;
    border: none;
    border-bottom: ${tables.borderWidth}px solid ${tables.borderColor};
    padding: ${tables.mobilePadding || 8}px;
  }

  .${baseClass}__table-cell:last-child {
    border-bottom: none;
  }

  /* Add header labels before each cell using data attributes */
  .${baseClass}__table-cell::before {
    content: attr(data-label);
    font-weight: ${typography.fontWeightBold};
    display: block;
    margin-bottom: ${spacing.xs}px;
  }
}
`
    : ''
}

/* Strong and emphasis */
.${baseClass} strong {
  font-weight: ${typography.fontWeightBold};
}

.${baseClass} em {
  font-style: italic;
}`;

  // Media queries for larger screens
  const mediaQueries = `
/* Tablet portrait and up */
@media (min-width: ${breakpoints.small}px) {
  .${baseClass} {
    font-size: ${typography.baseFontSize}px;
  }

  .${baseClass} h1 {
    font-size: ${typography.baseFontSize * typography.scaleH1 * 0.85}px;
  }

  .${baseClass} h2 {
    font-size: ${typography.baseFontSize * typography.scaleH2 * 0.9}px;
  }

  .${baseClass} h3 {
    font-size: ${typography.baseFontSize * typography.scaleH3 * 0.95}px;
  }
}

/* Tablet landscape and up */
@media (min-width: ${breakpoints.medium}px) {
  .${baseClass} h1 {
    font-size: ${typography.baseFontSize * typography.scaleH1 * 0.95}px;
  }

  .${baseClass} h2 {
    font-size: ${typography.baseFontSize * typography.scaleH2 * 0.95}px;
  }
}

/* Desktop and up */
@media (min-width: ${breakpoints.large}px) {
  .${baseClass} h1 {
    font-size: ${typography.baseFontSize * typography.scaleH1}px; /* Full size */
  }

  .${baseClass} h2 {
    font-size: ${typography.baseFontSize * typography.scaleH2}px;
  }

  .${baseClass} h3 {
    font-size: ${typography.baseFontSize * typography.scaleH3}px;
  }

  .${baseClass} h4 {
    font-size: ${typography.baseFontSize * typography.scaleH4}px;
  }
}`;

  return baseStyles + '\n' + mediaQueries;
}

/**
 * Wrap HTML fragment in a complete HTML page for preview mode
 * This is for User Story 3 (T052-T056) but implementing the basic structure now
 */
function wrapInPreviewPage(fragment: string, _config: PrivacyNoticeConfig): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Privacy Notice Preview</title>
</head>
<body>
  <main id="Main">
${fragment}
  </main>
</body>
</html>`;
}
