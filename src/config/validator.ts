import { z } from 'zod';
import type { PrivacyNoticeConfig } from './types.js';

/**
 * T032: Zod schema for configuration validation
 * T035: YAML/JSON syntax validation with clear error messages
 * T036: Color contrast validation (4.5:1 for normal text)
 */

// Hex color pattern
const hexColorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/, {
  message: 'Must be a 6-digit hex color (e.g., #1a1a1a)',
});

// Font weight validation
const fontWeightSchema = z.union([
  z.literal(100),
  z.literal(200),
  z.literal(300),
  z.literal(400),
  z.literal(500),
  z.literal(600),
  z.literal(700),
  z.literal(800),
  z.literal(900),
]);

// BEM class name pattern (lowercase, hyphens only)
const bemClassSchema = z.string().regex(/^[a-z][a-z0-9-]*$/, {
  message: 'Must contain only lowercase letters, numbers, and hyphens',
});

/**
 * Zod schema for PrivacyNoticeConfig
 */
export const configSchema = z.object({
  version: z.string().regex(/^\d+\.\d+\.\d+$/, {
    message: 'Must be semantic version (e.g., 1.0.0)',
  }),

  colors: z.object({
    text: hexColorSchema,
    textMuted: hexColorSchema,
    headings: hexColorSchema,
    links: hexColorSchema,
    linksHover: hexColorSchema,
    background: hexColorSchema,
    tableHeader: hexColorSchema,
    tableRowAlt: hexColorSchema,
    focus: hexColorSchema,
  }),

  typography: z.object({
    fontFamily: z.string().min(1, 'Font family cannot be empty'),
    headingFontFamily: z.string().optional(),
    baseFontSize: z.number().min(14).max(24),
    baseLineHeight: z.number().min(1.2).max(2.0),
    scaleH1: z.number().min(1.0),
    scaleH2: z.number().min(1.0),
    scaleH3: z.number().min(1.0),
    scaleH4: z.number().min(1.0),
    fontWeightNormal: fontWeightSchema,
    fontWeightBold: fontWeightSchema,
    fontWeightHeadings: fontWeightSchema,
  }),

  spacing: z.object({
    xs: z.number().multipleOf(4, 'Must be multiple of 4'),
    sm: z.number().multipleOf(4, 'Must be multiple of 4'),
    md: z.number().multipleOf(4, 'Must be multiple of 4'),
    lg: z.number().multipleOf(4, 'Must be multiple of 4'),
    xl: z.number().multipleOf(4, 'Must be multiple of 4'),
    xxl: z.number().multipleOf(4, 'Must be multiple of 4'),
  }),

  breakpoints: z.object({
    tiny: z.number().min(320),
    small: z.number().min(320),
    medium: z.number().min(320),
    landscape: z.number().min(320),
    large: z.number().min(320),
  }),

  tables: z.object({
    borderColor: hexColorSchema,
    borderWidth: z.number().min(1).max(3),
    cellPadding: z.number().min(8).max(16),
    headerBackground: hexColorSchema,
    headerTextColor: hexColorSchema,
    stripedRows: z.boolean(),
    mobileScrollable: z.boolean(),
  }),

  bem: z.object({
    baseClass: bemClassSchema,
    variantClass: bemClassSchema,
  }),
});

/**
 * Calculate relative luminance for WCAG contrast ratio
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
function getRelativeLuminance(hex: string): number {
  // Convert hex to RGB
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  // Apply gamma correction
  const rsRGB = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gsRGB = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bsRGB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  return 0.2126 * rsRGB + 0.7152 * gsRGB + 0.0722 * bsRGB;
}

/**
 * Calculate contrast ratio between two colors
 * https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 */
export function getContrastRatio(color1: string, color2: string): number {
  const l1 = getRelativeLuminance(color1);
  const l2 = getRelativeLuminance(color2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Validation result interface
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate configuration against schema and WCAG contrast requirements
 * T036: Implement color contrast validation (4.5:1 for normal text)
 */
export function validateConfig(config: unknown): ValidationResult {
  const errors: string[] = [];

  // Schema validation
  const schemaResult = configSchema.safeParse(config);
  if (!schemaResult.success) {
    for (const error of schemaResult.error.errors) {
      const path = error.path.join('.');
      errors.push(`${path}: ${error.message}`);
    }
    return { valid: false, errors };
  }

  const validatedConfig = schemaResult.data as PrivacyNoticeConfig;

  // WCAG 2.1 AA Contrast Validation (4.5:1 for normal text, 3:1 for large text)
  const contrastChecks = [
    {
      fg: validatedConfig.colors.text,
      bg: validatedConfig.colors.background,
      name: 'text/background',
      required: 4.5,
    },
    {
      fg: validatedConfig.colors.textMuted,
      bg: validatedConfig.colors.background,
      name: 'textMuted/background',
      required: 4.5,
    },
    {
      fg: validatedConfig.colors.headings,
      bg: validatedConfig.colors.background,
      name: 'headings/background',
      required: 4.5, // Could be 3:1 if large, but we require 4.5:1 for safety
    },
    {
      fg: validatedConfig.colors.links,
      bg: validatedConfig.colors.background,
      name: 'links/background',
      required: 4.5,
    },
    {
      fg: validatedConfig.tables.headerTextColor,
      bg: validatedConfig.tables.headerBackground,
      name: 'table header text/background',
      required: 4.5,
    },
  ];

  for (const check of contrastChecks) {
    const ratio = getContrastRatio(check.fg, check.bg);
    if (ratio < check.required) {
      errors.push(
        `${check.name}: Contrast ratio ${ratio.toFixed(2)}:1 is below required ${check.required}:1 (WCAG 2.1 AA)`
      );
    }
  }

  // Validate breakpoints are in ascending order
  const { tiny, small, medium, landscape, large } = validatedConfig.breakpoints;
  if (!(tiny <= small && small <= medium && medium <= landscape && landscape <= large)) {
    errors.push('breakpoints: Must be in ascending order (tiny ≤ small ≤ medium ≤ landscape ≤ large)');
  }

  // Validate spacing is in ascending order
  const { xs, sm, md, lg, xl, xxl } = validatedConfig.spacing;
  if (!(xs <= sm && sm <= md && md <= lg && lg <= xl && xl <= xxl)) {
    errors.push('spacing: Must be in ascending order (xs ≤ sm ≤ md ≤ lg ≤ xl ≤ xxl)');
  }

  return { valid: errors.length === 0, errors };
}
