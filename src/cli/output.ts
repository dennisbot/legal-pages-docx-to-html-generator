/**
 * Output management for stdout/stderr separation
 * Following Unix philosophy: data to stdout, diagnostics to stderr
 */

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
 * Write error message to stderr
 * For consistency with error-handler.ts
 */
export function writeError(message: string): void {
  console.error(message);
}

/**
 * Check if output should include color codes
 * Respects NO_COLOR environment variable
 */
export function shouldUseColor(): boolean {
  return !process.env['NO_COLOR'] && process.stderr.isTTY;
}

/**
 * Format text with color if color is enabled
 * This is a minimal implementation - chalk will be used if available
 */
export function colorize(text: string, colorCode: number): string {
  if (!shouldUseColor()) {
    return text;
  }
  return `\x1b[${colorCode}m${text}\x1b[0m`;
}

/**
 * Color codes for terminal output
 */
export const Colors = {
  RED: 31,
  GREEN: 32,
  YELLOW: 33,
  BLUE: 34,
  CYAN: 36,
  GRAY: 90,
} as const;
