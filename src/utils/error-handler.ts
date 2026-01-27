import { ExitCodes, type ExitCode, getExitCodeDescription } from './exit-codes.js';

export interface ErrorDetails {
  message: string;
  exitCode: ExitCode;
  details?: Record<string, string | number>;
  suggestions?: string[];
}

/**
 * Format and write error message to stderr with structured formatting
 */
export function handleError(error: ErrorDetails): void {
  const lines: string[] = [];

  // Main error message
  lines.push(`Error: ${error.message}`);

  // Add exit code description if not success
  if (error.exitCode !== ExitCodes.SUCCESS) {
    lines.push(`  Type: ${getExitCodeDescription(error.exitCode)}`);
  }

  // Add details if provided
  if (error.details && Object.keys(error.details).length > 0) {
    lines.push('');
    for (const [key, value] of Object.entries(error.details)) {
      lines.push(`  ${key}: ${value}`);
    }
  }

  // Add suggestions if provided
  if (error.suggestions && error.suggestions.length > 0) {
    lines.push('');
    lines.push('Suggestions:');
    for (const suggestion of error.suggestions) {
      lines.push(`  - ${suggestion}`);
    }
  }

  // Write to stderr
  console.error(lines.join('\n'));

  // Exit with appropriate code
  process.exit(error.exitCode);
}

/**
 * Handle file not found error
 */
export function handleFileNotFound(filePath: string): never {
  handleError({
    message: `File not found at path '${filePath}'`,
    exitCode: ExitCodes.FILE_NOT_FOUND,
    suggestions: [
      'Verify the file path is correct',
      'Check that the file exists',
      'Ensure you have read permissions for the file',
    ],
  });
}

/**
 * Handle file size exceeded error
 */
export function handleFileSizeExceeded(filePath: string, size: number, limit: number): never {
  handleError({
    message: 'File size exceeded',
    exitCode: ExitCodes.FILE_SIZE_EXCEEDED,
    details: {
      File: filePath,
      Size: `${(size / 1024 / 1024).toFixed(2)} MB`,
      Limit: `${(limit / 1024 / 1024).toFixed(1)} MB`,
    },
    suggestions: [
      'Split the document into smaller sections',
      'Remove embedded images or compress them',
      'Save as a new .docx file to reduce file size',
    ],
  });
}

/**
 * Handle invalid file format error
 */
export function handleInvalidFileFormat(filePath: string, detectedFormat?: string): never {
  handleError({
    message: 'Invalid file format. Expected .docx file.',
    exitCode: ExitCodes.INVALID_FILE_FORMAT,
    details: {
      File: filePath,
      ...(detectedFormat && { 'Detected Format': detectedFormat }),
    },
    suggestions: [
      'Open the file in Microsoft Word',
      'Save As → Word Document (*.docx)',
      'Ensure the file has a .docx extension',
    ],
  });
}

/**
 * Handle corrupted file error
 */
export function handleCorruptedFile(filePath: string): never {
  handleError({
    message: 'Corrupted or unreadable .docx file.',
    exitCode: ExitCodes.CORRUPTED_FILE,
    details: {
      File: filePath,
    },
    suggestions: [
      'Try opening the file in Microsoft Word to verify it works',
      'Save a fresh copy of the document',
      'Check if the file was fully downloaded/copied',
    ],
  });
}

/**
 * Handle configuration error
 */
export function handleConfigurationError(
  configPath: string,
  errorMessage: string,
  suggestions?: string[]
): never {
  handleError({
    message: `Configuration validation failed`,
    exitCode: ExitCodes.CONFIGURATION_ERROR,
    details: {
      'Config File': configPath,
      Error: errorMessage,
    },
    suggestions: suggestions || [
      'Check the configuration file syntax (YAML/JSON)',
      'Verify all required fields are present',
      'Ensure color values meet WCAG 2.1 AA contrast ratios',
    ],
  });
}

/**
 * Handle unsupported structure error
 */
export function handleUnsupportedStructure(filePath: string, reason: string): never {
  handleError({
    message: 'Unsupported document structure',
    exitCode: ExitCodes.UNSUPPORTED_STRUCTURE,
    details: {
      File: filePath,
      Reason: reason,
    },
    suggestions: [
      'Simplify the document structure',
      'Remove complex elements (SmartArt, embedded objects)',
      'Use standard Word formatting features only',
    ],
  });
}

/**
 * Write warning message to stderr (does not exit)
 */
export function writeWarning(message: string, details?: Record<string, string | number>): void {
  const lines: string[] = [];

  lines.push(`Warning: ${message}`);

  if (details && Object.keys(details).length > 0) {
    for (const [key, value] of Object.entries(details)) {
      lines.push(`  ${key}: ${value}`);
    }
  }

  console.error(lines.join('\n'));
}
