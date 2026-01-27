import type { PrivacyNoticeConfig } from '../config/types.js';

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

  // Generate inline CSS (placeholder for now - will be implemented in Phase 4)
  const inlineCSS = generatePlaceholderCSS(config);

  // Create the HTML fragment
  const fragment = `<style>
${inlineCSS}
</style>
<div class="${fullClass}">
${contentHTML}
</div>`;

  // Return fragment or preview page based on mode
  if (previewMode) {
    return wrapInPreviewPage(fragment, config);
  }

  return fragment;
}

/**
 * Generate placeholder CSS for MVP
 * This will be replaced with full CSS generation in Phase 4 (T038-T044)
 */
function generatePlaceholderCSS(config: PrivacyNoticeConfig): string {
  const { colors, typography, spacing, bem } = config;
  const baseClass = bem.baseClass;

  return `.${baseClass} {
  font-family: ${typography.fontFamily};
  font-size: ${typography.baseFontSize}px;
  line-height: ${typography.baseLineHeight};
  color: ${colors.text};
  background-color: ${colors.background};
}

.${baseClass} h1 {
  font-size: ${typography.baseFontSize * typography.scaleH1}px;
  font-weight: ${typography.fontWeightHeadings};
  color: ${colors.headings};
  margin-bottom: ${spacing.lg}px;
}

.${baseClass} h2 {
  font-size: ${typography.baseFontSize * typography.scaleH2}px;
  font-weight: ${typography.fontWeightHeadings};
  color: ${colors.headings};
  margin-bottom: ${spacing.md}px;
}

.${baseClass} h3 {
  font-size: ${typography.baseFontSize * typography.scaleH3}px;
  font-weight: ${typography.fontWeightHeadings};
  color: ${colors.headings};
  margin-bottom: ${spacing.md}px;
}

.${baseClass} h4 {
  font-size: ${typography.baseFontSize * typography.scaleH4}px;
  font-weight: ${typography.fontWeightHeadings};
  color: ${colors.headings};
  margin-bottom: ${spacing.sm}px;
}

.${baseClass} p {
  margin-bottom: ${spacing.md}px;
}

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

.${baseClass} ul,
.${baseClass} ol {
  margin-bottom: ${spacing.md}px;
  padding-left: ${spacing.xl}px;
}

.${baseClass} li {
  margin-bottom: ${spacing.sm}px;
}

.${baseClass} table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: ${spacing.lg}px;
}

.${baseClass} th,
.${baseClass} td {
  padding: ${spacing.sm}px ${spacing.md}px;
  text-align: left;
  border: 1px solid ${colors.text};
}

.${baseClass} th {
  background-color: ${colors.tableHeader};
  font-weight: ${typography.fontWeightBold};
}`;
}

/**
 * Wrap HTML fragment in a complete HTML page for preview mode
 * This is for User Story 3 (T052-T056) but implementing the basic structure now
 */
function wrapInPreviewPage(fragment: string, config: PrivacyNoticeConfig): string {
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
