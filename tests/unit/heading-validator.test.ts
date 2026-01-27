import { describe, it, expect } from 'vitest';
import { validateHeadingHierarchy } from '../../src/validators/heading-validator.js';

/**
 * Unit tests for heading hierarchy validator
 * T045: Implement heading hierarchy validator
 * T046: Validate no skipped heading levels
 * T047: Integrate heading validation
 * T064: Warn for documents without heading structure
 */

describe('Heading Hierarchy Validator', () => {
  describe('Valid Heading Hierarchies', () => {
    it('should accept proper sequential headings (h1 → h2 → h3)', () => {
      const html = `
        <h1>Title</h1>
        <p>Content</p>
        <h2>Section</h2>
        <p>More content</p>
        <h3>Subsection</h3>
        <p>Even more content</p>
      `;

      const result = validateHeadingHierarchy(html);
      expect(result.valid).toBe(true);
      expect(result.warnings).toHaveLength(0);
      expect(result.hasHeadings).toBe(true);
    });

    it('should accept headings at same level (h2 → h2)', () => {
      const html = `
        <h1>Title</h1>
        <h2>Section 1</h2>
        <p>Content</p>
        <h2>Section 2</h2>
        <p>Content</p>
      `;

      const result = validateHeadingHierarchy(html);
      expect(result.valid).toBe(true);
      expect(result.warnings).toHaveLength(0);
    });

    it('should accept going back up hierarchy (h3 → h2)', () => {
      const html = `
        <h1>Title</h1>
        <h2>Section</h2>
        <h3>Subsection</h3>
        <p>Content</p>
        <h2>Another Section</h2>
      `;

      const result = validateHeadingHierarchy(html);
      expect(result.valid).toBe(true);
      expect(result.warnings).toHaveLength(0);
    });

    it('should accept starting with h1', () => {
      const html = `
        <h1>Main Title</h1>
        <p>Content</p>
      `;

      const result = validateHeadingHierarchy(html);
      expect(result.valid).toBe(true);
      expect(result.warnings).toHaveLength(0);
    });

    it('should accept starting with h2', () => {
      const html = `
        <h2>Section Title</h2>
        <p>Content</p>
      `;

      const result = validateHeadingHierarchy(html);
      expect(result.valid).toBe(true);
      expect(result.warnings).toHaveLength(0);
    });
  });

  describe('Invalid Heading Hierarchies (T046)', () => {
    it('should warn about skipped levels (h1 → h3)', () => {
      const html = `
        <h1>Title</h1>
        <h3>Subsection</h3>
      `;

      const result = validateHeadingHierarchy(html);
      expect(result.valid).toBe(false);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings.some((w) => w.includes('h1'))).toBe(true);
      expect(result.warnings.some((w) => w.includes('h3'))).toBe(true);
      expect(result.warnings.some((w) => w.includes('Skipped heading level'))).toBe(true);
    });

    it('should warn about multiple level skips (h2 → h5)', () => {
      const html = `
        <h2>Section</h2>
        <h5>Deep subsection</h5>
      `;

      const result = validateHeadingHierarchy(html);
      expect(result.valid).toBe(false);
      expect(result.warnings.some((w) => w.includes('h2'))).toBe(true);
      expect(result.warnings.some((w) => w.includes('h5'))).toBe(true);
    });

    it('should warn about starting at h3 or higher', () => {
      const html = `
        <h3>Deep Section</h3>
        <p>Content</p>
      `;

      const result = validateHeadingHierarchy(html);
      expect(result.valid).toBe(false);
      expect(result.warnings.some((w) => w.includes('starts at h3'))).toBe(true);
      expect(result.warnings.some((w) => w.includes('h1 or h2'))).toBe(true);
    });

    it('should warn about excessive nesting (h5, h6)', () => {
      const html = `
        <h1>Title</h1>
        <h2>Section</h2>
        <h3>Subsection</h3>
        <h4>Sub-subsection</h4>
        <h5>Deep nesting</h5>
        <h6>Even deeper</h6>
      `;

      const result = validateHeadingHierarchy(html);
      expect(result.valid).toBe(false);
      expect(result.warnings.some((w) => w.includes('h5') || w.includes('h6'))).toBe(true);
      expect(result.warnings.some((w) => w.includes('simplifying'))).toBe(true);
    });
  });

  describe('Documents Without Headings (T064)', () => {
    it('should warn when document has no headings', () => {
      const html = `
        <p>Just some content</p>
        <p>More content</p>
        <ul>
          <li>List item</li>
        </ul>
      `;

      const result = validateHeadingHierarchy(html);
      expect(result.valid).toBe(false);
      expect(result.hasHeadings).toBe(false);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings.some((w) => w.includes('no headings'))).toBe(true);
      expect(result.warnings.some((w) => w.includes('accessibility'))).toBe(true);
    });

    it('should provide accessibility guidance for missing headings', () => {
      const html = '<p>Content without structure</p>';

      const result = validateHeadingHierarchy(html);
      expect(result.valid).toBe(false);
      expect(result.hasHeadings).toBe(false);
      expect(result.warnings.some((w) => w.toLowerCase().includes('heading'))).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty HTML', () => {
      const html = '';

      const result = validateHeadingHierarchy(html);
      expect(result.valid).toBe(false);
      expect(result.hasHeadings).toBe(false);
    });

    it('should handle HTML with only whitespace', () => {
      const html = '   \n\n   ';

      const result = validateHeadingHierarchy(html);
      expect(result.valid).toBe(false);
      expect(result.hasHeadings).toBe(false);
    });

    it('should extract heading text for warnings', () => {
      const html = `
        <h1>Main Title</h1>
        <h3>This is a very long subsection title that should be truncated in the warning message</h3>
      `;

      const result = validateHeadingHierarchy(html);
      expect(result.valid).toBe(false);
      // Should include part of the heading text in warning
      expect(result.warnings.some((w) => w.includes('This is'))).toBe(true);
    });

    it('should handle multiple skipped levels in same document', () => {
      const html = `
        <h1>Title</h1>
        <h3>Skip once</h3>
        <h2>Back to h2</h2>
        <h5>Skip twice</h5>
      `;

      const result = validateHeadingHierarchy(html);
      expect(result.valid).toBe(false);
      // Should have multiple warnings
      expect(result.warnings.length).toBeGreaterThan(1);
    });

    it('should only warn once about deep nesting', () => {
      const html = `
        <h1>Title</h1>
        <h2>Section</h2>
        <h3>Subsection</h3>
        <h4>Sub-subsection</h4>
        <h5>Deep 1</h5>
        <h5>Deep 2</h5>
        <h5>Deep 3</h5>
        <h6>Even deeper 1</h6>
        <h6>Even deeper 2</h6>
      `;

      const result = validateHeadingHierarchy(html);
      expect(result.valid).toBe(false);
      // Should only have one warning about deep nesting despite multiple h5/h6
      const deepNestingWarnings = result.warnings.filter((w) => w.includes('deeply nested') || w.includes('simplifying'));
      expect(deepNestingWarnings.length).toBe(1);
    });
  });
});
