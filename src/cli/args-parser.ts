import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * CLI arguments interface
 */
export interface CLIArguments {
  /** Path to the .docx file to convert */
  inputFile: string;
  /** Optional path to custom configuration file */
  config?: string;
  /** Enable preview mode (full HTML page instead of fragment) */
  preview: boolean;
}

/**
 * Get version number from package.json
 */
export function getVersion(): string {
  try {
    // Read package.json from project root (2 levels up from dist/cli or src/cli)
    const packageJsonPath = join(__dirname, '../../package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    return packageJson.version || '1.0.0';
  } catch {
    return '1.0.0';
  }
}

/**
 * Parse command-line arguments
 */
export function parseArguments(args: string[]): CLIArguments {
  const parsed = yargs(hideBin(args))
    .scriptName('privacy-notice-gen')
    .usage('Usage: $0 <file.docx> [options]')
    .command('$0 <inputFile>', 'Convert a Word document to HTML', (yargs) => {
      return yargs.positional('inputFile', {
        describe: 'Path to the .docx file to convert',
        type: 'string',
        demandOption: true,
      });
    })
    .option('config', {
      alias: 'c',
      type: 'string',
      description: 'Path to custom configuration file (YAML or JSON)',
    })
    .option('preview', {
      alias: 'p',
      type: 'boolean',
      default: false,
      description: 'Generate preview HTML (full page) instead of fragment',
    })
    .version(getVersion())
    .alias('version', 'v')
    .help('help')
    .alias('help', 'h')
    .example([
      ['$0 privacy-notice.docx', 'Convert document to HTML fragment (stdout)'],
      ['$0 privacy-notice.docx > output.html', 'Save HTML to file'],
      ['$0 privacy-notice.docx | clip', 'Copy HTML to clipboard (Windows)'],
      [
        '$0 privacy-notice.docx --config brand.yaml',
        'Use custom configuration',
      ],
      [
        '$0 privacy-notice.docx --preview > preview.html',
        'Generate preview page',
      ],
    ])
    .epilog(
      'For more information, visit: https://github.com/your-org/privacy-notice-gen'
    )
    .strict()
    .parseSync();

  return {
    inputFile: parsed.inputFile as string,
    config: parsed.config,
    preview: parsed.preview,
  };
}
