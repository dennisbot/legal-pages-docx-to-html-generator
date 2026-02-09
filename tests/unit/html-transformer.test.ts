import { describe, it, expect } from 'vitest';
import { transformTableElements, addDataLabels } from '../../src/converters/html-transformer.js';

describe('transformTableElements', () => {
  const baseClass = 'text-block';

  describe('Simple Tables', () => {
    it('should add BEM classes to simple table without thead/tbody', () => {
      const input = `
        <table>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
          <tr>
            <td>John</td>
            <td>john@example.com</td>
          </tr>
        </table>
      `;

      const result = transformTableElements(input, baseClass);

      // Table should have BEM class
      expect(result).toContain('<table class="text-block__table">');

      // Rows should have BEM class
      expect(result).toContain('class="text-block__table-row"');

      // Header cells should have BEM classes
      expect(result).toContain('class="text-block__table-cell text-block__table-cell--header"');

      // Data cells should have BEM class
      expect(result).toContain('class="text-block__table-cell"');
    });

    it('should handle table with thead and tbody', () => {
      const input = `
        <table>
          <thead>
            <tr>
              <th>Column 1</th>
              <th>Column 2</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Value 1</td>
              <td>Value 2</td>
            </tr>
          </tbody>
        </table>
      `;

      const result = transformTableElements(input, baseClass);

      // Table structure elements
      expect(result).toContain('<table class="text-block__table">');
      expect(result).toContain('<thead class="text-block__table-head">');
      expect(result).toContain('<tbody class="text-block__table-body">');

      // Header rows should have modifier
      expect(result).toContain('class="text-block__table-row text-block__table-row--header"');

      // Body rows should have base class only
      expect(result).toMatch(/<tbody[^>]*>[\s\S]*<tr class="text-block__table-row">/);
    });

    it('should return unchanged HTML if no tables present', () => {
      const input = '<div><p>No tables here</p></div>';
      const result = transformTableElements(input, baseClass);
      expect(result).toBe(input);
    });
  });

  describe('Preserve Existing Attributes', () => {
    it('should preserve existing classes on table elements', () => {
      const input = `<table class="existing-class" id="myTable"><tr class="row-class"><td class="cell-class">Data</td></tr></table>`;

      const result = transformTableElements(input, baseClass);

      // Should append BEM classes, not replace
      expect(result).toContain('class="existing-class text-block__table"');
      expect(result).toContain('class="row-class text-block__table-row"');
      expect(result).toContain('class="cell-class text-block__table-cell"');

      // Should preserve id attribute
      expect(result).toContain('id="myTable"');
    });

    it('should preserve multiple attributes', () => {
      const input = `<table id="t1" style="border:1px" data-foo="bar"><tr><td>Data</td></tr></table>`;

      const result = transformTableElements(input, baseClass);

      expect(result).toContain('id="t1"');
      expect(result).toContain('style="border:1px"');
      expect(result).toContain('data-foo="bar"');
      expect(result).toContain('class="text-block__table"');
    });

    it('should handle colspan and rowspan attributes', () => {
      const input = `
        <table>
          <tr>
            <th colspan="2">Header</th>
          </tr>
          <tr>
            <td rowspan="2">Cell 1</td>
            <td>Cell 2</td>
          </tr>
        </table>
      `;

      const result = transformTableElements(input, baseClass);

      expect(result).toContain('colspan="2"');
      expect(result).toContain('rowspan="2"');
      expect(result).toContain('class="text-block__table-cell text-block__table-cell--header"');
    });
  });

  describe('Complex Table Structures', () => {
    it('should handle nested tables', () => {
      const input = `
        <table>
          <tr>
            <td>
              Outer cell
              <table>
                <tr><td>Inner cell</td></tr>
              </table>
            </td>
          </tr>
        </table>
      `;

      const result = transformTableElements(input, baseClass);

      // Both tables should get BEM classes
      const tableMatches = result.match(/class="[^"]*text-block__table[^"]*"/g);
      expect(tableMatches).toHaveLength(2);

      // Both inner and outer cells should get classes
      expect(result.match(/class="[^"]*text-block__table-cell[^"]*"/g)?.length).toBeGreaterThanOrEqual(
        2
      );
    });

    it('should handle multiple tables in same document', () => {
      const input = `
        <div>
          <table><tr><td>Table 1</td></tr></table>
          <p>Some content</p>
          <table><tr><td>Table 2</td></tr></table>
        </div>
      `;

      const result = transformTableElements(input, baseClass);

      const tableMatches = result.match(/<table class="text-block__table">/g);
      expect(tableMatches).toHaveLength(2);
    });

    it('should handle table with both thead and multiple tbody sections', () => {
      const input = `
        <table>
          <thead>
            <tr><th>Header</th></tr>
          </thead>
          <tbody>
            <tr><td>Body 1</td></tr>
          </tbody>
          <tbody>
            <tr><td>Body 2</td></tr>
          </tbody>
        </table>
      `;

      const result = transformTableElements(input, baseClass);

      expect(result).toContain('<thead class="text-block__table-head">');
      const tbodyMatches = result.match(/<tbody class="text-block__table-body">/g);
      expect(tbodyMatches).toHaveLength(2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty table', () => {
      const input = '<table></table>';
      const result = transformTableElements(input, baseClass);
      expect(result).toContain('<table class="text-block__table">');
    });

    it('should handle table with only headers', () => {
      const input = '<table><thead><tr><th>Header</th></tr></thead></table>';
      const result = transformTableElements(input, baseClass);

      expect(result).toContain('<thead class="text-block__table-head">');
      expect(result).toContain('class="text-block__table-row text-block__table-row--header"');
    });

    it('should handle whitespace variations', () => {
      const input = '<table   ><tr   ><td   >Data</td></tr></table>';
      const result = transformTableElements(input, baseClass);

      expect(result).toContain('class="text-block__table"');
      expect(result).toContain('class="text-block__table-row"');
      expect(result).toContain('class="text-block__table-cell"');
    });

    it('should handle self-closing tags gracefully', () => {
      // Although not valid HTML5, some parsers might produce this
      const input = '<table><tr><td>Data</td><td/></tr></table>';
      const result = transformTableElements(input, baseClass);

      // Should still add classes to valid elements
      expect(result).toContain('class="text-block__table"');
    });

    it('should handle case-insensitive tag names', () => {
      const input = '<TABLE><TR><TD>Data</TD></TR></TABLE>';
      const result = transformTableElements(input, baseClass);

      expect(result).toContain('class="text-block__table"');
      expect(result).toContain('class="text-block__table-row"');
      expect(result).toContain('class="text-block__table-cell"');
    });
  });

  describe('Custom Base Class', () => {
    it('should use custom base class', () => {
      const input = '<table><tr><td>Data</td></tr></table>';
      const customBase = 'custom-block';

      const result = transformTableElements(input, customBase);

      expect(result).toContain('class="custom-block__table"');
      expect(result).toContain('class="custom-block__table-row"');
      expect(result).toContain('class="custom-block__table-cell"');
    });
  });
});

describe('addDataLabels', () => {
  describe('Basic Functionality', () => {
    it('should add data-label attributes to table cells', () => {
      const input = `
        <table class="text-block__table">
          <thead>
            <tr><th>Name</th><th>Email</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>John Doe</td>
              <td>john@example.com</td>
            </tr>
          </tbody>
        </table>
      `;

      const result = addDataLabels(input, true);

      expect(result).toContain('data-label="Name"');
      expect(result).toContain('data-label="Email"');
      expect(result).toContain('>John Doe</td>');
      expect(result).toContain('>john@example.com</td>');
    });

    it('should match column index to header index correctly', () => {
      const input = `
        <table>
          <thead>
            <tr><th>First</th><th>Second</th><th>Third</th></tr>
          </thead>
          <tbody>
            <tr><td>A</td><td>B</td><td>C</td></tr>
            <tr><td>D</td><td>E</td><td>F</td></tr>
          </tbody>
        </table>
      `;

      const result = addDataLabels(input, true);

      // First column cells should have "First" label
      expect(result).toMatch(/data-label="First">A</);
      expect(result).toMatch(/data-label="First">D</);

      // Second column cells should have "Second" label
      expect(result).toMatch(/data-label="Second">B</);
      expect(result).toMatch(/data-label="Second">E</);

      // Third column cells should have "Third" label
      expect(result).toMatch(/data-label="Third">C</);
      expect(result).toMatch(/data-label="Third">F</);
    });

    it('should return unchanged HTML when responsiveStacking is false', () => {
      const input = '<table><thead><tr><th>Header</th></tr></thead><tbody><tr><td>Data</td></tr></tbody></table>';

      const result = addDataLabels(input, false);

      expect(result).toBe(input);
      expect(result).not.toContain('data-label');
    });

    it('should return unchanged HTML when no tables present', () => {
      const input = '<div><p>No tables</p></div>';

      const result = addDataLabels(input, true);

      expect(result).toBe(input);
    });
  });

  describe('Edge Cases', () => {
    it('should handle tables without thead', () => {
      const input = `
        <table>
          <tbody>
            <tr><td>Data 1</td><td>Data 2</td></tr>
          </tbody>
        </table>
      `;

      const result = addDataLabels(input, true);

      // Should not add data-label if no headers found
      expect(result).toBe(input);
      expect(result).not.toContain('data-label');
    });

    it('should handle tables without tbody', () => {
      const input = `
        <table>
          <thead>
            <tr><th>Name</th><th>Email</th></tr>
          </thead>
          <tr><td>John</td><td>john@example.com</td></tr>
        </table>
      `;

      const result = addDataLabels(input, true);

      // Should still add labels to <td> outside tbody
      expect(result).toContain('data-label="Name"');
      expect(result).toContain('data-label="Email"');
    });

    it('should handle empty header cells', () => {
      const input = `
        <table>
          <thead>
            <tr><th></th><th>Name</th></tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>John</td></tr>
          </tbody>
        </table>
      `;

      const result = addDataLabels(input, true);

      expect(result).toContain('data-label=""'); // Empty header
      expect(result).toContain('data-label="Name"');
    });

    it('should escape HTML special characters in headers', () => {
      const input = `
        <table>
          <thead>
            <tr><th>Name & Title</th><th>Email "Address"</th></tr>
          </thead>
          <tbody>
            <tr><td>John</td><td>john@example.com</td></tr>
          </tbody>
        </table>
      `;

      const result = addDataLabels(input, true);

      expect(result).toContain('data-label="Name &amp; Title"');
      expect(result).toContain('data-label="Email &quot;Address&quot;"');
    });

    it('should handle headers with HTML tags', () => {
      const input = `
        <table>
          <thead>
            <tr><th><strong>Bold Header</strong></th></tr>
          </thead>
          <tbody>
            <tr><td>Data</td></tr>
          </tbody>
        </table>
      `;

      const result = addDataLabels(input, true);

      // Should strip HTML tags from header text
      expect(result).toContain('data-label="Bold Header"');
    });

    it('should skip cells that already have data-label', () => {
      const input = `
        <table>
          <thead>
            <tr><th>Name</th></tr>
          </thead>
          <tbody>
            <tr><td data-label="Custom">John</td></tr>
          </tbody>
        </table>
      `;

      const result = addDataLabels(input, true);

      // Should preserve existing data-label
      expect(result).toContain('data-label="Custom"');
      expect(result).not.toContain('data-label="Name"');
    });
  });

  describe('Multiple Tables', () => {
    it('should handle multiple tables independently', () => {
      const input = `
        <table>
          <thead><tr><th>Table 1 Header</th></tr></thead>
          <tbody><tr><td>Table 1 Data</td></tr></tbody>
        </table>
        <table>
          <thead><tr><th>Table 2 Header</th></tr></thead>
          <tbody><tr><td>Table 2 Data</td></tr></tbody>
        </table>
      `;

      const result = addDataLabels(input, true);

      expect(result).toContain('data-label="Table 1 Header"');
      expect(result).toContain('data-label="Table 2 Header"');
    });
  });

  describe('Complex Structures', () => {
    it('should handle cells with complex content', () => {
      const input = `
        <table>
          <thead>
            <tr><th>Details</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>John Doe</strong>
                <br/>
                <em>Software Engineer</em>
              </td>
            </tr>
          </tbody>
        </table>
      `;

      const result = addDataLabels(input, true);

      expect(result).toContain('data-label="Details"');
      // Should preserve inner HTML
      expect(result).toContain('<strong>John Doe</strong>');
      expect(result).toContain('<em>Software Engineer</em>');
    });

    it('should handle uneven rows (different column counts)', () => {
      const input = `
        <table>
          <thead>
            <tr><th>A</th><th>B</th><th>C</th></tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>2</td><td>3</td></tr>
            <tr><td>4</td><td>5</td></tr>
            <tr><td>6</td></tr>
          </tbody>
        </table>
      `;

      const result = addDataLabels(input, true);

      // First row: all three labels
      expect(result).toMatch(/data-label="A">1</);
      expect(result).toMatch(/data-label="B">2</);
      expect(result).toMatch(/data-label="C">3</);

      // Second row: only two labels
      expect(result).toMatch(/data-label="A">4</);
      expect(result).toMatch(/data-label="B">5</);

      // Third row: only one label
      expect(result).toMatch(/data-label="A">6</);
    });
  });
});
