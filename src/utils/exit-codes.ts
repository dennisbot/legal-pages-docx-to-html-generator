/**
 * Exit codes for the privacy-notice-gen CLI tool
 * Following Unix conventions for specific error conditions
 */

export const ExitCodes = {
  /** Success - HTML generated successfully */
  SUCCESS: 0,

  /** File size exceeded - Input file exceeds 1MB limit */
  FILE_SIZE_EXCEEDED: 1,

  /** File not found - Specified file path does not exist */
  FILE_NOT_FOUND: 2,

  /** Invalid file format - File is not a valid .docx format */
  INVALID_FILE_FORMAT: 3,

  /** Corrupted file - .docx file cannot be parsed or is corrupted */
  CORRUPTED_FILE: 4,

  /** Unsupported document structure - Document contains structure that cannot be converted */
  UNSUPPORTED_STRUCTURE: 5,

  /** Configuration error - Configuration file is missing, malformed, or contains invalid values */
  CONFIGURATION_ERROR: 6,
} as const;

export type ExitCode = (typeof ExitCodes)[keyof typeof ExitCodes];

/**
 * Get a human-readable description for an exit code
 */
export function getExitCodeDescription(code: ExitCode): string {
  switch (code) {
    case ExitCodes.SUCCESS:
      return 'Success';
    case ExitCodes.FILE_SIZE_EXCEEDED:
      return 'File size exceeded (maximum 1MB)';
    case ExitCodes.FILE_NOT_FOUND:
      return 'File not found';
    case ExitCodes.INVALID_FILE_FORMAT:
      return 'Invalid file format (expected .docx)';
    case ExitCodes.CORRUPTED_FILE:
      return 'Corrupted or unreadable file';
    case ExitCodes.UNSUPPORTED_STRUCTURE:
      return 'Unsupported document structure';
    case ExitCodes.CONFIGURATION_ERROR:
      return 'Configuration error';
    default:
      return 'Unknown error';
  }
}
