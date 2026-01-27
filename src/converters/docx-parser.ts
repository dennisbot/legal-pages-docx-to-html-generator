import mammoth from 'mammoth';
import { handleCorruptedFile } from '../utils/error-handler.js';
import type { ConvertResult } from 'mammoth';

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
  "b => strong",
  "i => em",
  "u => u",

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
 * Parse a .docx file and convert to semantic HTML
 * T019: Create .docx parser wrapper with mammoth.js
 */
export async function parseDocxFile(filePath: string): Promise<ParseResult> {
  try {
    const result: ConvertResult = await mammoth.convertToHtml(
      { path: filePath },
      {
        styleMap: STYLE_MAP,
        includeDefaultStyleMap: true,
        convertImage: mammoth.images.imgElement((image) => {
          // Skip images for now - privacy notices are typically text-only
          return { src: '' };
        }),
      }
    );

    return {
      html: result.value,
      warnings: result.messages.map((msg) => msg.message),
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
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
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
