import { extractHeadings } from '../converters/docx-parser.js';
import { writeWarning } from '../utils/error-handler.js';

/**
 * T045: Implement heading hierarchy validator
 * T046: Validate no skipped heading levels (e.g., h1 → h3)
 */

export interface HeadingValidationResult {
  valid: boolean;
  warnings: string[];
  hasHeadings: boolean;
}

/**
 * Validate heading hierarchy in HTML content
 * Checks for:
 * - Skipped heading levels (h1 → h3)
 * - Documents without any headings (accessibility concern)
 */
export function validateHeadingHierarchy(html: string): HeadingValidationResult {
  const headings = extractHeadings(html);
  const warnings: string[] = [];

  // Check if document has any headings
  if (headings.length === 0) {
    warnings.push(
      'Document has no headings. Consider adding headings for better accessibility and document structure.'
    );
    return { valid: false, warnings, hasHeadings: false };
  }

  // Check for skipped levels
  let previousLevel = 0;

  for (let i = 0; i < headings.length; i++) {
    const currentLevel = headings[i]?.level || 0;
    const heading = headings[i];

    // First heading should typically be h1 or h2
    if (i === 0 && currentLevel > 2) {
      warnings.push(
        `Document starts at h${currentLevel}. Consider starting with h1 or h2 for better structure.`
      );
    }

    // Check for skipped levels (e.g., h1 → h3, h2 → h5)
    if (previousLevel > 0 && currentLevel > previousLevel + 1) {
      warnings.push(
        `Skipped heading level detected: h${previousLevel} → h${currentLevel} ` +
          `(heading: "${heading?.text?.substring(0, 50) || 'untitled'}"). ` +
          `Use h${previousLevel + 1} instead for proper hierarchy.`
      );
    }

    // Check for excessive nesting (h5 or h6 might indicate over-structuring)
    if (currentLevel >= 5) {
      if (!warnings.some((w) => w.includes('deeply nested'))) {
        warnings.push(
          `Document uses h${currentLevel} headings. Consider simplifying document structure.`
        );
      }
    }

    previousLevel = currentLevel;
  }

  return {
    valid: warnings.length === 0,
    warnings,
    hasHeadings: true,
  };
}

/**
 * T064: Warn for documents without heading structure (accessibility impact)
 */
export function warnIfNoHeadings(html: string): void {
  const result = validateHeadingHierarchy(html);

  if (!result.hasHeadings) {
    writeWarning('Accessibility warning: Document has no heading structure', {
      Impact: 'Screen readers rely on headings for navigation',
      Recommendation: 'Add headings (h1, h2, h3) to structure content',
    });
  }

  // Output all warnings
  for (const warning of result.warnings) {
    writeWarning(warning);
  }
}
