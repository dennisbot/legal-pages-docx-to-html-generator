import mammoth from 'mammoth';
import { handleCorruptedFile } from '../utils/error-handler.js';

/**
 * Style mapping for mammoth.js
 * T020: Configure mammoth style mappings for semantic HTML conversion
 */
const STYLE_MAP = [
  // Headings
  "p[style-name='Heading 1'] => h1:fresh",
  "p[style-name='Heading 2'] => h2:fresh",
  "p[style-name='Heading 3'] => h3:fresh",
  "p[style-name='Heading 4'] => h4:fresh",
  "p[style-name='Heading 5'] => h5:fresh",
  "p[style-name='Heading 6'] => h6:fresh",

  // Paragraphs
  "p[style-name='Normal'] => p:fresh",
  "p[style-name='Body Text'] => p:fresh",

  // Lists remain as default <ul>, <ol>, <li>

  // Tables remain as default <table>, <tr>, <td>, <th>

  // Text formatting
  'b => strong',
  'i => em',
  'u => u',

  // Links remain as default <a>
].join('\n');

/**
 * Parse result from .docx conversion
 */
export interface ParseResult {
  /** Generated HTML content */
  html: string;
  /** Warning messages from parser */
  warnings: string[];
}

/**
 * T063: Process mammoth warnings and add user-friendly messages for unsupported elements
 */
function processWarnings(mammothMessages: Array<{ type: string; message: string }>): string[] {
  const warnings: string[] = [];
  const seenWarnings = new Set<string>();

  for (const msg of mammothMessages) {
    // Extract the original mammoth warning
    const originalWarning = msg.message;

    // Check for common unsupported element patterns
    let userFriendlyWarning: string | null = null;

    // SmartArt graphics
    if (originalWarning.toLowerCase().includes('smartart')) {
      userFriendlyWarning =
        'SmartArt graphics are not supported. Consider replacing with a simple table or list.';
    }
    // Embedded objects (Excel, PowerPoint, etc.)
    else if (
      originalWarning.toLowerCase().includes('embedded') ||
      originalWarning.toLowerCase().includes('ole object')
    ) {
      userFriendlyWarning =
        'Embedded objects (Excel, PowerPoint, etc.) are not supported. Convert content to native Word elements.';
    }
    // Charts and diagrams
    else if (originalWarning.toLowerCase().includes('chart')) {
      userFriendlyWarning =
        'Charts are not supported. Consider converting to a table or describing the data in text.';
    }
    // Images (we skip them intentionally)
    else if (
      originalWarning.toLowerCase().includes('image') ||
      originalWarning.toLowerCase().includes('picture')
    ) {
      userFriendlyWarning =
        'Images are not converted (privacy notices are typically text-only). Images will be omitted from output.';
    }
    // Text boxes
    else if (originalWarning.toLowerCase().includes('text box')) {
      userFriendlyWarning =
        'Text boxes are not fully supported. Consider converting to regular paragraphs for consistent rendering.';
    }
    // Shapes and drawing objects
    else if (
      originalWarning.toLowerCase().includes('shape') ||
      originalWarning.toLowerCase().includes('drawing')
    ) {
      userFriendlyWarning =
        'Shapes and drawing objects are not supported. Use text formatting or tables instead.';
    }
    // Comments
    else if (originalWarning.toLowerCase().includes('comment')) {
      userFriendlyWarning = 'Comments are not included in HTML output.';
    }
    // Track changes / revisions
    else if (
      originalWarning.toLowerCase().includes('revision') ||
      originalWarning.toLowerCase().includes('track change')
    ) {
      userFriendlyWarning =
        'Track changes are not included. Accept or reject all changes before converting.';
    }
    // Equations
    else if (originalWarning.toLowerCase().includes('equation')) {
      userFriendlyWarning =
        'Equations may not render correctly. Consider using plain text or converting to an image description.';
    }
    // Unknown or unrecognized warnings - use original message
    else {
      userFriendlyWarning = `Unsupported element: ${originalWarning}`;
    }

    // Add warning if not already seen (avoid duplicates)
    if (userFriendlyWarning && !seenWarnings.has(userFriendlyWarning)) {
      warnings.push(userFriendlyWarning);
      seenWarnings.add(userFriendlyWarning);
    }
  }

  return warnings;
}

/**
 * Parse a .docx file and convert to semantic HTML
 * T019: Create .docx parser wrapper with mammoth.js
 */
export async function parseDocxFile(filePath: string): Promise<ParseResult> {
  try {
    const result = await mammoth.convertToHtml(
      { path: filePath },
      {
        styleMap: STYLE_MAP,
        includeDefaultStyleMap: true,
        convertImage: mammoth.images.imgElement(() => {
          // Skip images for now - privacy notices are typically text-only
          return Promise.resolve({ src: '' });
        }),
      }
    );

    // T063: Process warnings to provide user-friendly messages
    const warnings = processWarnings(result.messages);

    return {
      html: result.value,
      warnings,
    };
  } catch (error) {
    // If mammoth fails to parse, the file is corrupted
    handleCorruptedFile(filePath);
  }
}

/**
 * Extract text content from HTML for validation purposes
 */
export function extractTextContent(html: string): string {
  // Simple regex-based text extraction (for heading validation)
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extract heading structure from HTML for validation
 */
export function extractHeadings(html: string): { level: number; text: string }[] {
  const headings: { level: number; text: string }[] = [];
  const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h\1>/gi;

  let match;
  while ((match = headingRegex.exec(html)) !== null) {
    headings.push({
      level: parseInt(match[1] || '1', 10),
      text: match[2]?.replace(/<[^>]*>/g, '') || '',
    });
  }

  return headings;
}
