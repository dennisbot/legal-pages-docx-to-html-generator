import { describe, it, expect } from 'vitest';
import { exec } from 'child_process';
import { promisify } from 'util';
import { join } from 'path';

const execAsync = promisify(exec);

/**
 * Integration tests for the CLI tool
 * T030: End-to-end integration test verifying .docx → HTML conversion
 */

describe('CLI Integration Tests', () => {
  const CLI_PATH = join(__dirname, '../../dist/cli/index.js');
  const FIXTURES_PATH = join(__dirname, '../fixtures');

  describe('Version and Help', () => {
    it('should display version number with --version flag', async () => {
      const { stdout } = await execAsync(`node ${CLI_PATH} --version`);
      expect(stdout).toContain('1.0.0');
    });

    it('should display help message with --help flag', async () => {
      const { stdout } = await execAsync(`node ${CLI_PATH} --help`);
      expect(stdout).toContain('Usage:');
      expect(stdout).toContain('privacy-notice-gen');
    });
  });

  describe('File Validation', () => {
    it('should exit with code 2 when file does not exist', async () => {
      try {
        await execAsync(`node ${CLI_PATH} nonexistent-file.docx`);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe(2);
        expect(error.stderr).toContain('File not found');
      }
    });

    it('should exit with code 3 when file format is invalid', async () => {
      const invalidFile = join(FIXTURES_PATH, 'invalid-file.txt');
      try {
        await execAsync(`node ${CLI_PATH} ${invalidFile}`);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe(3);
        expect(error.stderr).toContain('Invalid file format');
      }
    });
  });

  describe('HTML Generation (requires sample-privacy-notice.docx)', () => {
    const sampleFile = join(FIXTURES_PATH, 'sample-privacy-notice.docx');

    it.skip('should convert .docx to HTML fragment with BEM classes', async () => {
      // Skip if fixture doesn't exist (needs manual creation)
      const { stdout } = await execAsync(`node ${CLI_PATH} ${sampleFile}`);

      // Verify HTML structure
      expect(stdout).toContain('<style>');
      expect(stdout).toContain('text-block-content');
      expect(stdout).toContain('text-block-content--privacy-notice-content');

      // Verify no wrapper elements
      expect(stdout).not.toContain('<!DOCTYPE');
      expect(stdout).not.toContain('<html');
      expect(stdout).not.toContain('<body');
      expect(stdout).not.toContain('<head');
    });

    it.skip('should generate preview HTML when --preview flag is used', async () => {
      const { stdout } = await execAsync(`node ${CLI_PATH} ${sampleFile} --preview`);

      // Verify full HTML page structure
      expect(stdout).toContain('<!DOCTYPE html>');
      expect(stdout).toContain('<html');
      expect(stdout).toContain('<body>');
      expect(stdout).toContain('<main id="Main">');
    });
  });

  describe('Configuration Loading', () => {
    it.skip('should use custom configuration when --config flag is provided', async () => {
      const sampleFile = join(FIXTURES_PATH, 'sample-privacy-notice.docx');
      const configFile = join(FIXTURES_PATH, 'test-configs/valid-config.yaml');

      const { stdout } = await execAsync(`node ${CLI_PATH} ${sampleFile} --config ${configFile}`);

      // Verify custom configuration was applied (check for Georgia font)
      expect(stdout).toContain('Georgia, serif');
      expect(stdout).toContain('custom-content');
    });

    it('should exit with code 6 when configuration file is invalid', async () => {
      const sampleFile = join(FIXTURES_PATH, 'sample-privacy-notice.docx');
      const configFile = join(FIXTURES_PATH, 'test-configs/invalid-config.yaml');

      try {
        await execAsync(`node ${CLI_PATH} ${sampleFile} --config ${configFile}`);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe(6);
        expect(error.stderr).toContain('Configuration');
      }
    });
  });

  describe('Output Streams', () => {
    it.skip('should write HTML to stdout and diagnostics to stderr', async () => {
      const sampleFile = join(FIXTURES_PATH, 'sample-privacy-notice.docx');

      const { stdout, stderr } = await execAsync(`node ${CLI_PATH} ${sampleFile}`);

      // HTML should go to stdout
      expect(stdout).toContain('<style>');
      expect(stdout).toContain('<div');

      // Diagnostics/warnings should go to stderr (if any)
      // stderr may be empty or contain warnings
      if (stderr) {
        expect(stderr).not.toContain('<style>');
        expect(stderr).not.toContain('<div');
      }
    });
  });
});
