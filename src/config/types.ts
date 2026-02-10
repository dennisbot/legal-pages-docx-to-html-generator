/**
 * Configuration types based on data-model.md specification
 * These types define the structure of configuration files (YAML/JSON)
 */

/** 6-digit hexadecimal color code */
export type HexColor = string;

/** System font stack or web fonts */
export type FontStack = string;

/**
 * Color palette with WCAG 2.1 AA validation
 */
export interface ColorPalette {
  /** Body text color */
  text: HexColor;
  /** Secondary text color */
  textMuted: HexColor;
  /** Heading text color */
  headings: HexColor;
  /** Hyperlink color */
  links: HexColor;
  /** Hyperlink hover state color */
  linksHover: HexColor;
  /** Page background color */
  background: HexColor;
  /** Table header background color */
  tableHeader: HexColor;
  /** Alternate table row background color */
  tableRowAlt: HexColor;
  /** Focus outline color (keyboard navigation) */
  focus: HexColor;
}

/**
 * Font families, sizes, weights, and line heights
 */
export interface TypographySettings {
  /** System font stack or web fonts */
  fontFamily: FontStack;
  /** Optional separate font family for headings */
  headingFontFamily?: FontStack;
  /** Base font size in pixels (14-24px) */
  baseFontSize: number;
  /** Base line height ratio (1.2-2.0) */
  baseLineHeight: number;
  /** Font size multiplier for h1 elements */
  scaleH1: number;
  /** Font size multiplier for h2 elements */
  scaleH2: number;
  /** Font size multiplier for h3 elements */
  scaleH3: number;
  /** Font size multiplier for h4 elements */
  scaleH4: number;
  /** Normal font weight (100-900) */
  fontWeightNormal: number;
  /** Bold font weight (100-900) */
  fontWeightBold: number;
  /** Heading font weight (100-900) */
  fontWeightHeadings: number;
}

/**
 * 8px-based spacing system for consistent vertical rhythm
 */
export interface SpacingScale {
  /** Extra small spacing (4px) */
  xs: number;
  /** Small spacing (8px) */
  sm: number;
  /** Medium spacing (16px) */
  md: number;
  /** Large spacing (24px) */
  lg: number;
  /** Extra large spacing (32px) */
  xl: number;
  /** 2X extra large spacing (48px) */
  xxl: number;
}

/**
 * Viewport widths for responsive design (mobile-first)
 */
export interface ResponsiveBreakpoints {
  /** Mobile portrait viewport width (375px) */
  tiny: number;
  /** Tablet portrait viewport width (768px) */
  small: number;
  /** Tablet landscape viewport width (992px) */
  medium: number;
  /** Small desktop viewport width (1024px) */
  landscape: number;
  /** Desktop viewport width (1200px) */
  large: number;
}

/**
 * Table-specific styling for responsive, accessible tables
 */
export interface TableStyling {
  /** Table border color */
  borderColor: HexColor;
  /** Border width in pixels (1-3px) */
  borderWidth: number;
  /** Cell padding in pixels (8-16px) */
  cellPadding: number;
  /** Header row background color */
  headerBackground: HexColor;
  /** Header text color */
  headerTextColor: HexColor;
  /** Enable alternating row colors */
  stripedRows: boolean;
  /** Enable horizontal scroll on mobile (does not stack rows) */
  mobileScrollable: boolean;

  // Interactive features
  /** Enable hover effects on table rows (default: false) */
  hoverHighlight?: boolean;
  /** Background color for hovered table rows (default: #f0f0f0) */
  hoverColor?: HexColor;

  // Visual enhancements
  /** Enable rounded corners on tables (default: false) */
  roundedCorners?: boolean;
  /** Border radius in pixels, 0-16 (default: 0) */
  borderRadius?: number;

  // Mobile optimizations
  /** Reduce padding on mobile devices (default: false) */
  compactMobile?: boolean;
  /** Cell padding on mobile in pixels, 4-12 (default: 8) */
  mobilePadding?: number;
  /** Stack table as definition list on mobile devices (default: false) */
  responsiveStacking?: boolean;
}

/**
 * BEM class name customization
 */
export interface BEMConfiguration {
  /** Base block class name (default: "text-block-content") */
  baseClass: string;
  /** Variant modifier class name without -- prefix (default: "privacy-notice-content") */
  variantClass: string;
}

/**
 * Complete configuration schema for Privacy Notice Generator
 */
export interface PrivacyNoticeConfig {
  /** Config schema version (semver) */
  version: string;
  /** Color definitions with WCAG validation */
  colors: ColorPalette;
  /** Font and text styling */
  typography: TypographySettings;
  /** Consistent spacing system */
  spacing: SpacingScale;
  /** Viewport breakpoints */
  breakpoints: ResponsiveBreakpoints;
  /** Table-specific styles */
  tables: TableStyling;
  /** BEM class customization */
  bem: BEMConfiguration;
}
