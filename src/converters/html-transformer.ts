/**
 * HTML Transformer - Post-process HTML to add BEM classes to table elements
 *
 * This module transforms raw HTML from mammoth.js by injecting BEM-compliant
 * class names into table elements, ensuring proper scoping and preventing
 * style leakage across multiple Umbraco CMS websites.
 */

/**
 * Wrap orphan <tr> elements (direct children of <table>) in <tbody>
 *
 * Browsers auto-generate <tbody> for tables without explicit tbody/thead,
 * which breaks CSS selectors like `.table > .row:nth-child(even)`.
 * This function explicitly wraps orphan rows to maintain selector consistency.
 *
 * @param html HTML content with tables
 * @returns HTML with orphan rows wrapped in <tbody>
 */
function wrapOrphanRowsInTbody(html: string): string {
  // Process each table independently
  const tablePattern = /<table([^>]*)>([\s\S]*?)<\/table>/gi;

  return html.replace(tablePattern, (tableMatch, tableAttrs, tableContent) => {
    // Check if table already has thead or tbody
    const hasStructure = /<thead|<tbody/i.test(tableContent);

    if (hasStructure) {
      // Table already has proper structure, don't modify
      return tableMatch;
    }

    // Table has orphan rows - wrap them in tbody
    // Find all direct <tr> children and wrap them
    const trimmedContent = tableContent.trim();
    if (trimmedContent.startsWith('<tr')) {
      // All content is rows, wrap everything
      return `<table${tableAttrs}><tbody>${tableContent}</tbody></table>`;
    }

    // Mixed content (whitespace + rows), wrap just the rows
    // This preserves any whitespace/formatting
    return `<table${tableAttrs}><tbody>${tableContent}</tbody></table>`;
  });
}

/**
 * Transform table elements by adding BEM classes
 *
 * Adds proper BEM classes to all table-related elements:
 * - <table> → class="text-block__table"
 * - <thead> → class="text-block__table-head"
 * - <tbody> → class="text-block__table-body"
 * - <tr> in thead → class="text-block__table-row text-block__table-row--header"
 * - <tr> in tbody → class="text-block__table-row"
 * - <th> → class="text-block__table-cell text-block__table-cell--header"
 * - <td> → class="text-block__table-cell"
 *
 * @param html Raw HTML from mammoth.js conversion
 * @param baseClass BEM base class (e.g., "text-block")
 * @returns Transformed HTML with BEM classes added to table elements
 */
export function transformTableElements(html: string, baseClass: string): string {
  // Early exit if no tables in HTML
  if (!html.includes('<table')) {
    return html;
  }

  let transformed = html;

  // Step 0: Wrap unwrapped <tr> elements in <tbody> to prevent browser auto-generation
  transformed = wrapOrphanRowsInTbody(transformed);

  // Step 1: Add classes to <table> elements
  transformed = addClassToElement(transformed, 'table', `${baseClass}__table`);

  // Step 2: Add classes to <thead> elements
  transformed = addClassToElement(transformed, 'thead', `${baseClass}__table-head`);

  // Step 3: Add classes to <tbody> elements
  transformed = addClassToElement(transformed, 'tbody', `${baseClass}__table-body`);

  // Step 4: Add classes to <tr> elements
  // We need to differentiate between <tr> in <thead> and <tbody>
  transformed = transformTableRows(transformed, baseClass);

  // Step 5: Add classes to <th> elements (header cells)
  transformed = addClassToElement(
    transformed,
    'th',
    `${baseClass}__table-cell ${baseClass}__table-cell--header`
  );

  // Step 6: Add classes to <td> elements (data cells)
  transformed = addClassToElement(transformed, 'td', `${baseClass}__table-cell`);

  return transformed;
}

/**
 * Add BEM class to an HTML element, preserving existing classes and attributes
 *
 * Handles multiple scenarios:
 * - Element with no class: <table> → <table class="bem-class">
 * - Element with existing class: <table class="foo"> → <table class="foo bem-class">
 * - Element with attributes: <table id="x"> → <table id="x" class="bem-class">
 *
 * @param html HTML content to transform
 * @param tagName HTML tag name (e.g., "table", "tr", "td")
 * @param bemClass BEM class to add
 * @returns HTML with BEM classes added to all matching elements
 */
function addClassToElement(html: string, tagName: string, bemClass: string): string {
  // Regex pattern to match opening tags
  // Matches: <tagName>, <tagName >, <tagName attr="val">, <tagName class="existing">
  const tagPattern = new RegExp(`<${tagName}(\\s+[^>]*?)?>`, 'gi');

  return html.replace(tagPattern, (_match, attributes = '') => {
    // Check if element already has a class attribute
    const classPattern = /class=["']([^"']*)["']/i;
    const classMatch = attributes.match(classPattern);

    if (classMatch) {
      // Element has existing class - append BEM class
      const existingClasses = classMatch[1];
      const updatedClasses = `${existingClasses} ${bemClass}`.trim();
      const newAttributes = attributes.replace(classPattern, `class="${updatedClasses}"`);
      return `<${tagName}${newAttributes}>`;
    } else {
      // No existing class - add class attribute
      const trimmedAttrs = attributes.trim();
      if (trimmedAttrs) {
        return `<${tagName} ${trimmedAttrs} class="${bemClass}">`;
      } else {
        return `<${tagName} class="${bemClass}">`;
      }
    }
  });
}

/**
 * Transform <tr> elements with context-aware BEM classes
 *
 * Adds different classes based on whether <tr> is in <thead> or <tbody>:
 * - <tr> in <thead> → class="text-block__table-row text-block__table-row--header"
 * - <tr> in <tbody> → class="text-block__table-row"
 *
 * @param html HTML content with tables
 * @param baseClass BEM base class
 * @returns HTML with context-aware classes on <tr> elements
 */
function transformTableRows(html: string, baseClass: string): string {
  // Process <thead> sections first
  const theadPattern = /<thead[^>]*>([\s\S]*?)<\/thead>/gi;
  let transformed = html.replace(theadPattern, (theadMatch, theadContent) => {
    // Add header modifier to all <tr> in <thead>
    const transformedContent = addClassToElement(
      theadContent,
      'tr',
      `${baseClass}__table-row ${baseClass}__table-row--header`
    );
    return theadMatch.replace(theadContent, transformedContent);
  });

  // Process <tbody> sections
  const tbodyPattern = /<tbody[^>]*>([\s\S]*?)<\/tbody>/gi;
  transformed = transformed.replace(tbodyPattern, (tbodyMatch, tbodyContent) => {
    // Add base class to all <tr> in <tbody>
    const transformedContent = addClassToElement(
      tbodyContent,
      'tr',
      `${baseClass}__table-row`
    );
    return tbodyMatch.replace(tbodyContent, transformedContent);
  });

  // Handle tables without <thead>/<tbody> (direct <tr> children of <table>)
  // Match <table...> content </table> that doesn't have thead/tbody
  const tablePattern = /<table[^>]*>([\s\S]*?)<\/table>/gi;
  transformed = transformed.replace(tablePattern, (tableMatch, tableContent) => {
    // Only process <tr> that are direct children (not already in thead/tbody)
    // Check if this table has thead or tbody
    if (!tableContent.includes('<thead') && !tableContent.includes('<tbody')) {
      const transformedContent = addClassToElement(
        tableContent,
        'tr',
        `${baseClass}__table-row`
      );
      return tableMatch.replace(tableContent, transformedContent);
    }
    return tableMatch;
  });

  return transformed;
}

/**
 * Add data-label attributes to table cells for responsive stacking
 *
 * Extracts header text from <th> elements and adds as data-label attributes
 * to corresponding <td> elements in the same column. This enables responsive
 * stacking where tables transform into card-like layouts on mobile devices.
 *
 * Example transformation:
 * ```html
 * <thead><tr><th>Name</th><th>Email</th></tr></thead>
 * <tbody>
 *   <tr><td>John</td><td>john@example.com</td></tr>
 * </tbody>
 * ```
 * Becomes:
 * ```html
 * <thead><tr><th>Name</th><th>Email</th></tr></thead>
 * <tbody>
 *   <tr>
 *     <td data-label="Name">John</td>
 *     <td data-label="Email">john@example.com</td>
 *   </tr>
 * </tbody>
 * ```
 *
 * @param html HTML with BEM classes already added
 * @param responsiveStacking Whether to add data-label attributes
 * @returns HTML with data-label attributes on <td> elements
 */
export function addDataLabels(html: string, responsiveStacking: boolean): string {
  // Early exit if feature disabled or no tables
  if (!responsiveStacking || !html.includes('<table')) {
    return html;
  }

  // Process each table independently
  const tablePattern = /<table[^>]*>([\s\S]*?)<\/table>/gi;

  return html.replace(tablePattern, (tableMatch, tableContent) => {
    // Extract headers from <thead>
    const headers = extractHeaders(tableContent);

    // If no headers found, skip this table
    if (headers.length === 0) {
      return tableMatch;
    }

    // Add data-label to <td> elements in <tbody>
    const transformedContent = addDataLabelToTDs(tableContent, headers);

    return tableMatch.replace(tableContent, transformedContent);
  });
}

/**
 * Extract header text from <thead> section
 *
 * @param tableContent HTML content of a single table
 * @returns Array of header texts in column order
 */
function extractHeaders(tableContent: string): string[] {
  const headers: string[] = [];

  // Find <thead> section
  const theadMatch = tableContent.match(/<thead[^>]*>([\s\S]*?)<\/thead>/i);
  if (!theadMatch) {
    return headers;
  }

  const theadContent = theadMatch[1] || '';

  // Extract all <th> elements
  const thPattern = /<th[^>]*>([\s\S]*?)<\/th>/gi;
  let match: RegExpExecArray | null;

  while ((match = thPattern.exec(theadContent)) !== null) {
    // Extract text content, strip HTML tags
    const headerText = (match[1] || '').replace(/<[^>]*>/g, '').trim();
    headers.push(headerText);
  }

  return headers;
}

/**
 * Add data-label attributes to <td> elements based on column index
 *
 * @param tableContent HTML content of a single table
 * @param headers Array of header texts
 * @returns Table content with data-label attributes added to <td> elements
 */
function addDataLabelToTDs(tableContent: string, headers: string[]): string {
  // Find <tbody> section
  const tbodyMatch = tableContent.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i);
  if (!tbodyMatch) {
    // No tbody, process entire table content
    return processRowsForDataLabels(tableContent, headers);
  }

  const tbodyContent = tbodyMatch[1] || '';
  const transformedTbody = processRowsForDataLabels(tbodyContent, headers);

  return tableContent.replace(tbodyContent, transformedTbody);
}

/**
 * Process rows and add data-label to <td> elements
 *
 * @param content HTML content containing <tr> elements
 * @param headers Array of header texts
 * @returns Content with data-label attributes added
 */
function processRowsForDataLabels(content: string, headers: string[]): string {
  // Process each <tr>
  const trPattern = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;

  return content.replace(trPattern, (trMatch, trContent) => {
    // Extract all <td> elements in this row
    let columnIndex = 0;
    const tdPattern = /<td([^>]*)>([\s\S]*?)<\/td>/gi;

    const transformedTr = trContent.replace(
      tdPattern,
      (tdMatch: string, attributes: string, tdContent: string) => {
      // Get header for this column
      const headerLabel = headers[columnIndex] || '';
      columnIndex++;

      // Check if data-label already exists
      if (attributes.includes('data-label')) {
        return tdMatch; // Skip if already has data-label
      }

      // Add data-label attribute
      const trimmedAttrs = attributes.trim();
      const newAttributes = trimmedAttrs
        ? `${trimmedAttrs} data-label="${escapeHtml(headerLabel)}"`
        : `data-label="${escapeHtml(headerLabel)}"`;

        return `<td ${newAttributes}>${tdContent}</td>`;
      }
    );

    return trMatch.replace(trContent, transformedTr);
  });
}

/**
 * Escape HTML special characters for attribute values
 *
 * @param text Text to escape
 * @returns Escaped text safe for HTML attributes
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
