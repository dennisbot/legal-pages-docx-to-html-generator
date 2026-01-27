#!/usr/bin/env node

/**
 * Privacy Notice HTML Generator CLI Entry Point
 * Converts Word documents (.docx) to styled, accessible HTML fragments
 */

import { parseArguments } from './args-parser.js';
import { writeOutput } from './output.js';
import { handleError } from '../utils/error-handler.js';
import { ExitCodes } from '../utils/exit-codes.js';

/**
 * Main CLI execution function
 */
async function main(): Promise<void> {
  try {
    // Parse command-line arguments
    // Note: --version and --help are handled automatically by yargs
    const args = parseArguments(process.argv);

    // Validate input file is provided
    if (!args.inputFile) {
      handleError({
        message: 'No input file provided',
        exitCode: ExitCodes.FILE_NOT_FOUND,
        suggestions: [
          'Provide a .docx file path as the first argument',
          'Example: privacy-notice-gen document.docx',
          'Run with --help for more information',
        ],
      });
    }

    // T024: Integrate file validation → .docx parsing → HTML generation pipeline

    // Step 1: Validate input file (T025-T028: Error handling for file issues)
    const { validateFile } = await import('../validators/file-validator.js');
    await validateFile(args.inputFile);

    // Step 2: Load configuration
    const { loadConfig, getConfigFromEnvironment } = await import('../config/loader.js');
    const configPath = args.config || getConfigFromEnvironment();
    const config = await loadConfig(configPath);

    // Step 3: Parse .docx file
    const { parseDocxFile } = await import('../converters/docx-parser.js');
    const parseResult = await parseDocxFile(args.inputFile);

    // Step 4: Generate HTML fragment
    const { generateHTMLFragment } = await import('../converters/html-generator.js');
    const html = generateHTMLFragment({
      config,
      contentHTML: parseResult.html,
      previewMode: args.preview,
    });

    // Step 5: Output warnings to stderr if any
    if (parseResult.warnings.length > 0) {
      const { writeWarning } = await import('../utils/error-handler.js');
      for (const warning of parseResult.warnings) {
        writeWarning(warning);
      }
    }

    // Step 6: Write HTML to stdout
    writeOutput(html);

    // Success!
    process.exit(ExitCodes.SUCCESS);
  } catch (error) {
    // Catch any unexpected errors
    if (error instanceof Error) {
      handleError({
        message: error.message,
        exitCode: ExitCodes.UNSUPPORTED_STRUCTURE,
        details: {
          Error: error.name,
        },
      });
    } else {
      handleError({
        message: 'An unexpected error occurred',
        exitCode: ExitCodes.UNSUPPORTED_STRUCTURE,
      });
    }
  }
}

// Execute main function
main().catch((error: Error) => {
  console.error('Fatal error:', error.message);
  process.exit(1);
});
