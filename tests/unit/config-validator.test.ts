import { describe, it, expect } from 'vitest';
import { validateConfig, getContrastRatio } from '../../src/config/validator.js';

/**
 * Unit tests for configuration validator
 * T050: Validate configuration loading and validation
 * T051: Validate configuration error handling
 */

describe('Configuration Validator', () => {
  describe('Schema Validation', () => {
    it('should accept valid configuration', () => {
      const validConfig = {
        version: '1.0.0',
        colors: {
          text: '#1a1a1a',
          textMuted: '#666666',
          headings: '#000000',
          links: '#0066cc',
          linksHover: '#004499',
          background: '#ffffff',
          tableHeader: '#f5f5f5',
          tableRowAlt: '#fafafa',
          focus: '#0066cc',
        },
        typography: {
          fontFamily: 'Arial, sans-serif',
          baseFontSize: 16,
          baseLineHeight: 1.6,
          scaleH1: 2.0,
          scaleH2: 1.5,
          scaleH3: 1.25,
          scaleH4: 1.1,
          fontWeightNormal: 400,
          fontWeightBold: 700,
          fontWeightHeadings: 700,
        },
        spacing: {
          xs: 4,
          sm: 8,
          md: 16,
          lg: 24,
          xl: 32,
          xxl: 48,
        },
        breakpoints: {
          tiny: 375,
          small: 768,
          medium: 992,
          landscape: 1024,
          large: 1200,
        },
        tables: {
          borderColor: '#dddddd',
          borderWidth: 1,
          cellPadding: 12,
          headerBackground: '#f5f5f5',
          headerTextColor: '#1a1a1a',
          stripedRows: true,
          mobileScrollable: true,
        },
        bem: {
          baseClass: 'text-block-content',
          variantClass: 'privacy-notice-content',
        },
      };

      const result = validateConfig(validConfig);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid version format', () => {
      const invalidConfig = {
        version: 'v1.0', // Invalid: should be semver
        colors: {
          text: '#1a1a1a',
          textMuted: '#666666',
          headings: '#000000',
          links: '#0066cc',
          linksHover: '#004499',
          background: '#ffffff',
          tableHeader: '#f5f5f5',
          tableRowAlt: '#fafafa',
          focus: '#0066cc',
        },
        typography: {
          fontFamily: 'Arial, sans-serif',
          baseFontSize: 16,
          baseLineHeight: 1.6,
          scaleH1: 2.0,
          scaleH2: 1.5,
          scaleH3: 1.25,
          scaleH4: 1.1,
          fontWeightNormal: 400,
          fontWeightBold: 700,
          fontWeightHeadings: 700,
        },
        spacing: {
          xs: 4,
          sm: 8,
          md: 16,
          lg: 24,
          xl: 32,
          xxl: 48,
        },
        breakpoints: {
          tiny: 375,
          small: 768,
          medium: 992,
          landscape: 1024,
          large: 1200,
        },
        tables: {
          borderColor: '#dddddd',
          borderWidth: 1,
          cellPadding: 12,
          headerBackground: '#f5f5f5',
          headerTextColor: '#1a1a1a',
          stripedRows: true,
          mobileScrollable: true,
        },
        bem: {
          baseClass: 'text-block-content',
          variantClass: 'privacy-notice-content',
        },
      };

      const result = validateConfig(invalidConfig);
      expect(result.valid).toBe(false);
      expect(result.errors.some((err) => err.includes('version'))).toBe(true);
    });

    it('should reject invalid hex color format', () => {
      const invalidConfig = {
        version: '1.0.0',
        colors: {
          text: 'black', // Invalid: should be hex
          textMuted: '#666666',
          headings: '#000000',
          links: '#0066cc',
          linksHover: '#004499',
          background: '#ffffff',
          tableHeader: '#f5f5f5',
          tableRowAlt: '#fafafa',
          focus: '#0066cc',
        },
        typography: {
          fontFamily: 'Arial, sans-serif',
          baseFontSize: 16,
          baseLineHeight: 1.6,
          scaleH1: 2.0,
          scaleH2: 1.5,
          scaleH3: 1.25,
          scaleH4: 1.1,
          fontWeightNormal: 400,
          fontWeightBold: 700,
          fontWeightHeadings: 700,
        },
        spacing: {
          xs: 4,
          sm: 8,
          md: 16,
          lg: 24,
          xl: 32,
          xxl: 48,
        },
        breakpoints: {
          tiny: 375,
          small: 768,
          medium: 992,
          landscape: 1024,
          large: 1200,
        },
        tables: {
          borderColor: '#dddddd',
          borderWidth: 1,
          cellPadding: 12,
          headerBackground: '#f5f5f5',
          headerTextColor: '#1a1a1a',
          stripedRows: true,
          mobileScrollable: true,
        },
        bem: {
          baseClass: 'text-block-content',
          variantClass: 'privacy-notice-content',
        },
      };

      const result = validateConfig(invalidConfig);
      expect(result.valid).toBe(false);
      expect(result.errors.some((err) => err.includes('colors.text'))).toBe(true);
    });

    it('should reject spacing values not on 8px grid', () => {
      const invalidConfig = {
        version: '1.0.0',
        colors: {
          text: '#1a1a1a',
          textMuted: '#666666',
          headings: '#000000',
          links: '#0066cc',
          linksHover: '#004499',
          background: '#ffffff',
          tableHeader: '#f5f5f5',
          tableRowAlt: '#fafafa',
          focus: '#0066cc',
        },
        typography: {
          fontFamily: 'Arial, sans-serif',
          baseFontSize: 16,
          baseLineHeight: 1.6,
          scaleH1: 2.0,
          scaleH2: 1.5,
          scaleH3: 1.25,
          scaleH4: 1.1,
          fontWeightNormal: 400,
          fontWeightBold: 700,
          fontWeightHeadings: 700,
        },
        spacing: {
          xs: 5, // Invalid: not multiple of 4
          sm: 8,
          md: 16,
          lg: 24,
          xl: 32,
          xxl: 48,
        },
        breakpoints: {
          tiny: 375,
          small: 768,
          medium: 992,
          landscape: 1024,
          large: 1200,
        },
        tables: {
          borderColor: '#dddddd',
          borderWidth: 1,
          cellPadding: 12,
          headerBackground: '#f5f5f5',
          headerTextColor: '#1a1a1a',
          stripedRows: true,
          mobileScrollable: true,
        },
        bem: {
          baseClass: 'text-block-content',
          variantClass: 'privacy-notice-content',
        },
      };

      const result = validateConfig(invalidConfig);
      expect(result.valid).toBe(false);
      expect(result.errors.some((err) => err.includes('spacing.xs'))).toBe(true);
    });

    it('should reject breakpoints not in ascending order', () => {
      const invalidConfig = {
        version: '1.0.0',
        colors: {
          text: '#1a1a1a',
          textMuted: '#666666',
          headings: '#000000',
          links: '#0066cc',
          linksHover: '#004499',
          background: '#ffffff',
          tableHeader: '#f5f5f5',
          tableRowAlt: '#fafafa',
          focus: '#0066cc',
        },
        typography: {
          fontFamily: 'Arial, sans-serif',
          baseFontSize: 16,
          baseLineHeight: 1.6,
          scaleH1: 2.0,
          scaleH2: 1.5,
          scaleH3: 1.25,
          scaleH4: 1.1,
          fontWeightNormal: 400,
          fontWeightBold: 700,
          fontWeightHeadings: 700,
        },
        spacing: {
          xs: 4,
          sm: 8,
          md: 16,
          lg: 24,
          xl: 32,
          xxl: 48,
        },
        breakpoints: {
          tiny: 375,
          small: 768,
          medium: 600, // Invalid: should be >= small
          landscape: 1024,
          large: 1200,
        },
        tables: {
          borderColor: '#dddddd',
          borderWidth: 1,
          cellPadding: 12,
          headerBackground: '#f5f5f5',
          headerTextColor: '#1a1a1a',
          stripedRows: true,
          mobileScrollable: true,
        },
        bem: {
          baseClass: 'text-block-content',
          variantClass: 'privacy-notice-content',
        },
      };

      const result = validateConfig(invalidConfig);
      expect(result.valid).toBe(false);
      expect(result.errors.some((err) => err.includes('breakpoints'))).toBe(true);
    });

    it('should reject invalid BEM class names', () => {
      const invalidConfig = {
        version: '1.0.0',
        colors: {
          text: '#1a1a1a',
          textMuted: '#666666',
          headings: '#000000',
          links: '#0066cc',
          linksHover: '#004499',
          background: '#ffffff',
          tableHeader: '#f5f5f5',
          tableRowAlt: '#fafafa',
          focus: '#0066cc',
        },
        typography: {
          fontFamily: 'Arial, sans-serif',
          baseFontSize: 16,
          baseLineHeight: 1.6,
          scaleH1: 2.0,
          scaleH2: 1.5,
          scaleH3: 1.25,
          scaleH4: 1.1,
          fontWeightNormal: 400,
          fontWeightBold: 700,
          fontWeightHeadings: 700,
        },
        spacing: {
          xs: 4,
          sm: 8,
          md: 16,
          lg: 24,
          xl: 32,
          xxl: 48,
        },
        breakpoints: {
          tiny: 375,
          small: 768,
          medium: 992,
          landscape: 1024,
          large: 1200,
        },
        tables: {
          borderColor: '#dddddd',
          borderWidth: 1,
          cellPadding: 12,
          headerBackground: '#f5f5f5',
          headerTextColor: '#1a1a1a',
          stripedRows: true,
          mobileScrollable: true,
        },
        bem: {
          baseClass: 'Text_Block', // Invalid: uppercase and underscore
          variantClass: 'privacy-notice-content',
        },
      };

      const result = validateConfig(invalidConfig);
      expect(result.valid).toBe(false);
      expect(result.errors.some((err) => err.includes('bem.baseClass'))).toBe(true);
    });
  });

  describe('WCAG Contrast Validation (T036)', () => {
    it('should calculate contrast ratio correctly', () => {
      // Black on white should be 21:1 (maximum contrast)
      const blackWhite = getContrastRatio('#000000', '#ffffff');
      expect(blackWhite).toBeCloseTo(21, 0);

      // White on white should be 1:1 (no contrast)
      const whiteWhite = getContrastRatio('#ffffff', '#ffffff');
      expect(whiteWhite).toBeCloseTo(1, 1);

      // Dark gray on white should be around 12.6:1
      const darkGrayWhite = getContrastRatio('#1a1a1a', '#ffffff');
      expect(darkGrayWhite).toBeGreaterThan(12);
    });

    it('should reject insufficient text/background contrast', () => {
      const lowContrastConfig = {
        version: '1.0.0',
        colors: {
          text: '#cccccc', // Low contrast with white background
          textMuted: '#666666',
          headings: '#000000',
          links: '#0066cc',
          linksHover: '#004499',
          background: '#ffffff',
          tableHeader: '#f5f5f5',
          tableRowAlt: '#fafafa',
          focus: '#0066cc',
        },
        typography: {
          fontFamily: 'Arial, sans-serif',
          baseFontSize: 16,
          baseLineHeight: 1.6,
          scaleH1: 2.0,
          scaleH2: 1.5,
          scaleH3: 1.25,
          scaleH4: 1.1,
          fontWeightNormal: 400,
          fontWeightBold: 700,
          fontWeightHeadings: 700,
        },
        spacing: {
          xs: 4,
          sm: 8,
          md: 16,
          lg: 24,
          xl: 32,
          xxl: 48,
        },
        breakpoints: {
          tiny: 375,
          small: 768,
          medium: 992,
          landscape: 1024,
          large: 1200,
        },
        tables: {
          borderColor: '#dddddd',
          borderWidth: 1,
          cellPadding: 12,
          headerBackground: '#f5f5f5',
          headerTextColor: '#1a1a1a',
          stripedRows: true,
          mobileScrollable: true,
        },
        bem: {
          baseClass: 'text-block-content',
          variantClass: 'privacy-notice-content',
        },
      };

      const result = validateConfig(lowContrastConfig);
      expect(result.valid).toBe(false);
      expect(result.errors.some((err) => err.includes('text/background'))).toBe(true);
      expect(result.errors.some((err) => err.includes('WCAG 2.1 AA'))).toBe(true);
    });

    it('should accept sufficient contrast ratios', () => {
      const goodContrastConfig = {
        version: '1.0.0',
        colors: {
          text: '#1a1a1a', // Good contrast: 12.6:1
          textMuted: '#666666', // Acceptable: 5.74:1
          headings: '#000000', // Maximum: 21:1
          links: '#0066cc', // Good: 7.27:1
          linksHover: '#004499', // Good: 10.7:1
          background: '#ffffff',
          tableHeader: '#f5f5f5',
          tableRowAlt: '#fafafa',
          focus: '#0066cc',
        },
        typography: {
          fontFamily: 'Arial, sans-serif',
          baseFontSize: 16,
          baseLineHeight: 1.6,
          scaleH1: 2.0,
          scaleH2: 1.5,
          scaleH3: 1.25,
          scaleH4: 1.1,
          fontWeightNormal: 400,
          fontWeightBold: 700,
          fontWeightHeadings: 700,
        },
        spacing: {
          xs: 4,
          sm: 8,
          md: 16,
          lg: 24,
          xl: 32,
          xxl: 48,
        },
        breakpoints: {
          tiny: 375,
          small: 768,
          medium: 992,
          landscape: 1024,
          large: 1200,
        },
        tables: {
          borderColor: '#dddddd',
          borderWidth: 1,
          cellPadding: 12,
          headerBackground: '#f5f5f5',
          headerTextColor: '#1a1a1a',
          stripedRows: true,
          mobileScrollable: true,
        },
        bem: {
          baseClass: 'text-block-content',
          variantClass: 'privacy-notice-content',
        },
      };

      const result = validateConfig(goodContrastConfig);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('New Table Configuration Options', () => {
    const validBaseConfig = {
      version: '1.0.0',
      colors: {
        text: '#1a1a1a',
        textMuted: '#666666',
        headings: '#000000',
        links: '#0066cc',
        linksHover: '#004499',
        background: '#ffffff',
        tableHeader: '#f5f5f5',
        tableRowAlt: '#fafafa',
        focus: '#0066cc',
      },
      typography: {
        fontFamily: 'Arial, sans-serif',
        baseFontSize: 16,
        baseLineHeight: 1.6,
        scaleH1: 2.0,
        scaleH2: 1.5,
        scaleH3: 1.25,
        scaleH4: 1.1,
        fontWeightNormal: 400,
        fontWeightBold: 700,
        fontWeightHeadings: 700,
      },
      spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
      },
      breakpoints: {
        tiny: 375,
        small: 768,
        medium: 992,
        landscape: 1024,
        large: 1200,
      },
      tables: {
        borderColor: '#dddddd',
        borderWidth: 1,
        cellPadding: 12,
        headerBackground: '#f5f5f5',
        headerTextColor: '#1a1a1a',
        stripedRows: true,
        mobileScrollable: true,
      },
      bem: {
        baseClass: 'text-block-content',
        variantClass: 'privacy-notice-content',
      },
    };

    it('should accept valid hover configuration', () => {
      const config = {
        ...validBaseConfig,
        tables: {
          ...validBaseConfig.tables,
          hoverHighlight: true,
          hoverColor: '#f0f0f0',
        },
      };
      const result = validateConfig(config);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid hoverColor format', () => {
      const config = {
        ...validBaseConfig,
        tables: { ...validBaseConfig.tables, hoverColor: 'blue' },
      };
      const result = validateConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors.some((err) => err.includes('hoverColor'))).toBe(true);
    });

    it('should reject borderRadius > 16', () => {
      const config = {
        ...validBaseConfig,
        tables: { ...validBaseConfig.tables, borderRadius: 20 },
      };
      const result = validateConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors.some((err) => err.includes('borderRadius'))).toBe(true);
    });

    it('should reject borderRadius < 0', () => {
      const config = {
        ...validBaseConfig,
        tables: { ...validBaseConfig.tables, borderRadius: -5 },
      };
      const result = validateConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors.some((err) => err.includes('borderRadius'))).toBe(true);
    });

    it('should reject mobilePadding > 12', () => {
      const config = {
        ...validBaseConfig,
        tables: { ...validBaseConfig.tables, mobilePadding: 15 },
      };
      const result = validateConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors.some((err) => err.includes('mobilePadding'))).toBe(true);
    });

    it('should reject mobilePadding < 4', () => {
      const config = {
        ...validBaseConfig,
        tables: { ...validBaseConfig.tables, mobilePadding: 2 },
      };
      const result = validateConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors.some((err) => err.includes('mobilePadding'))).toBe(true);
    });

    it('should validate hover color contrast', () => {
      const config = {
        ...validBaseConfig,
        tables: {
          ...validBaseConfig.tables,
          hoverHighlight: true,
          hoverColor: '#1a1a1a', // Dark hover with dark text fails contrast
        },
      };
      const result = validateConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors.some((err) => err.includes('hover'))).toBe(true);
      expect(result.errors.some((err) => err.includes('WCAG 2.1 AA'))).toBe(true);
    });

    it('should accept hover color with good contrast', () => {
      const config = {
        ...validBaseConfig,
        tables: {
          ...validBaseConfig.tables,
          hoverHighlight: true,
          hoverColor: '#f0f0f0', // Light hover with dark text passes
        },
      };
      const result = validateConfig(config);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should skip hover color validation when hoverHighlight is false', () => {
      const config = {
        ...validBaseConfig,
        tables: {
          ...validBaseConfig.tables,
          hoverHighlight: false,
          hoverColor: '#1a1a1a', // Bad contrast but should be ignored
        },
      };
      const result = validateConfig(config);
      expect(result.valid).toBe(true);
    });

    it('should accept all new options with valid values', () => {
      const config = {
        ...validBaseConfig,
        tables: {
          ...validBaseConfig.tables,
          hoverHighlight: true,
          hoverColor: '#f0f0f0',
          roundedCorners: true,
          borderRadius: 8,
          compactMobile: true,
          mobilePadding: 6,
          responsiveStacking: true,
        },
      };
      const result = validateConfig(config);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should accept config with only some new options', () => {
      const config = {
        ...validBaseConfig,
        tables: {
          ...validBaseConfig.tables,
          roundedCorners: true,
          borderRadius: 4,
        },
      };
      const result = validateConfig(config);
      expect(result.valid).toBe(true);
    });

    it('should accept config with no new options (backward compatible)', () => {
      const result = validateConfig(validBaseConfig);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
