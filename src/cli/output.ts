/**
 * Output management for stdout/stderr separation with colored output
 * T066: Implement color-based terminal output with chalk
 * T067: Add NO_COLOR environment variable support
 * Following Unix philosophy: data to stdout, diagnostics to stderr
 */

import chalk from 'chalk';

/**
 * Check if output should include color codes
 * T067: Respects NO_COLOR environment variable
 */
export function shouldUseColor(): boolean {
  // Respect NO_COLOR env var (https://no-color.org/)
  if (process.env['NO_COLOR']) {
    return false;
  }

  // Only use color if stderr is a TTY
  return process.stderr.isTTY;
}

/**
 * Write HTML output to stdout
 * This is the primary data output that can be redirected to files or piped to other tools
 */
export function writeOutput(html: string): void {
  process.stdout.write(html);
}

/**
 * Write diagnostic message to stderr
 * Used for progress messages, warnings, and informational output
 */
export function writeDiagnostic(message: string): void {
  console.error(message);
}

/**
 * Write error message to stderr with red color
 * T066: Use chalk for colored output
 */
export function writeError(message: string): void {
  if (shouldUseColor()) {
    console.error(chalk.red(message));
  } else {
    console.error(message);
  }
}

/**
 * Write warning message to stderr with yellow color
 */
export function writeWarningColored(message: string): void {
  if (shouldUseColor()) {
    console.error(chalk.yellow(message));
  } else {
    console.error(message);
  }
}

/**
 * Write success message to stderr with green color
 */
export function writeSuccess(message: string): void {
  if (shouldUseColor()) {
    console.error(chalk.green(message));
  } else {
    console.error(message);
  }
}

/**
 * Write info message to stderr with cyan color
 */
export function writeInfo(message: string): void {
  if (shouldUseColor()) {
    console.error(chalk.cyan(message));
  } else {
    console.error(message);
  }
}

/**
 * Chalk color helpers (respects NO_COLOR)
 */
export const colors = {
  error: (text: string) => (shouldUseColor() ? chalk.red(text) : text),
  warning: (text: string) => (shouldUseColor() ? chalk.yellow(text) : text),
  success: (text: string) => (shouldUseColor() ? chalk.green(text) : text),
  info: (text: string) => (shouldUseColor() ? chalk.cyan(text) : text),
  dim: (text: string) => (shouldUseColor() ? chalk.gray(text) : text),
  bold: (text: string) => (shouldUseColor() ? chalk.bold(text) : text),
};
