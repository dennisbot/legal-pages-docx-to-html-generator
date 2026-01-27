import { readFile } from 'fs/promises';
import yaml from 'js-yaml';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { PrivacyNoticeConfig } from './types.js';
import { handleConfigurationError } from '../utils/error-handler.js';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Load configuration from a file path
 * Supports both YAML and JSON formats
 */
export async function loadConfig(configPath?: string): Promise<PrivacyNoticeConfig> {
  // If no config path provided, use default config
  if (!configPath) {
    return await loadDefaultConfig();
  }

  try {
    // Read the configuration file
    const fileContent = await readFile(configPath, 'utf-8');

    // Parse based on file extension
    const extension = configPath.toLowerCase().split('.').pop();
    let config: unknown;

    if (extension === 'yaml' || extension === 'yml') {
      config = yaml.load(fileContent);
    } else if (extension === 'json') {
      config = JSON.parse(fileContent);
    } else {
      handleConfigurationError(
        configPath,
        'Unsupported file format. Use .yaml, .yml, or .json',
        ['Save configuration as YAML or JSON file']
      );
    }

    // TODO: Validate configuration with Zod schema (Phase 4 - T032)
    return config as PrivacyNoticeConfig;
  } catch (error) {
    if (error instanceof Error) {
      // Check if it's a file not found error
      if ('code' in error && error.code === 'ENOENT') {
        handleConfigurationError(
          configPath,
          `Configuration file not found at path '${configPath}'`,
          ['Check that the file path is correct', 'Ensure the file exists']
        );
      }

      // Check if it's a YAML/JSON parsing error
      if (error instanceof yaml.YAMLException || error instanceof SyntaxError) {
        handleConfigurationError(
          configPath,
          `Configuration file is malformed: ${error.message}`,
          ['Check YAML/JSON syntax', 'Validate with a linter']
        );
      }

      // Generic error
      handleConfigurationError(configPath, error.message);
    }

    // Should never reach here due to handleConfigurationError calling process.exit
    throw error;
  }
}

/**
 * Load the default built-in configuration
 */
export async function loadDefaultConfig(): Promise<PrivacyNoticeConfig> {
  try {
    // The default config is located at ../../config/default-config.yaml relative to this file
    const defaultConfigPath = join(__dirname, '../../config/default-config.yaml');
    const fileContent = await readFile(defaultConfigPath, 'utf-8');
    const config = yaml.load(fileContent);

    return config as PrivacyNoticeConfig;
  } catch (error) {
    // If we can't load the default config, something is seriously wrong
    console.error('Fatal error: Could not load default configuration');
    console.error(error);
    process.exit(1);
  }
}

/**
 * Check if PRIVACY_NOTICE_CONFIG environment variable is set
 * Returns the path if set, undefined otherwise
 */
export function getConfigFromEnvironment(): string | undefined {
  return process.env['PRIVACY_NOTICE_CONFIG'];
}
