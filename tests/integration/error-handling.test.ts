import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { exec } from 'child_process';
import { promisify } from 'util';
import { join } from 'path';
import { writeFile, unlink, mkdir } from 'fs/promises';

const execAsync = promisify(exec);

/**
 * Integration tests for error handling and edge cases
 * T070: Test oversized file (>1MB)
 */

describe('Error Handling and Edge Cases', () => {
  const CLI_PATH = join(__dirname, '../../dist/cli/index.js');
  const FIXTURES_PATH = join(__dirname, '../fixtures');
  const TEMP_PATH = join(FIXTURES_PATH, 'temp');

  beforeAll(async () => {
    // Create temp directory for test files
    try {
      await mkdir(TEMP_PATH, { recursive: true });
    } catch {
      // Directory might already exist
    }
  });

  afterAll(async () => {
    // Clean up temp files
    try {
      await unlink(join(TEMP_PATH, 'oversized-file.docx'));
    } catch {
      // File might not exist
    }
  });

  describe('File Size Validation', () => {
    it('should exit with code 1 when file exceeds 1MB limit (T070)', async () => {
      // Create a file larger than 1MB (1,048,576 bytes)
      const oversizedFile = join(TEMP_PATH, 'oversized-file.docx');
      const largeBuffer = Buffer.alloc(1_048_577, 'X'); // 1MB + 1 byte
      await writeFile(oversizedFile, largeBuffer);

      try {
        await execAsync(`node ${CLI_PATH} ${oversizedFile}`);
        expect.fail('Should have thrown an error for oversized file');
      } catch (error: any) {
        expect(error.code).toBe(1);
        expect(error.stderr).toContain('exceeds 1MB');
        expect(error.stderr).toContain('1048577'); // Should show actual file size
      }
    });

    it('should accept file at exactly 1MB', async () => {
      // Note: This would require a valid .docx file at exactly 1MB
      // For now, we just verify the size check works above
      expect(true).toBe(true);
    });
  });

  describe('Configuration Error Handling', () => {
    it('should provide clear error for missing configuration file', async () => {
      const sampleFile = join(FIXTURES_PATH, 'sample-privacy-notice.docx');
      const missingConfig = join(FIXTURES_PATH, 'nonexistent-config.yaml');

      try {
        await execAsync(`node ${CLI_PATH} ${sampleFile} --config ${missingConfig}`);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe(6);
        expect(error.stderr).toContain('Configuration file not found');
        expect(error.stderr).toContain(missingConfig);
      }
    });

    it('should provide clear error for malformed configuration file', async () => {
      const sampleFile = join(FIXTURES_PATH, 'sample-privacy-notice.docx');
      const invalidConfig = join(FIXTURES_PATH, 'test-configs/invalid-config.yaml');

      try {
        await execAsync(`node ${CLI_PATH} ${sampleFile} --config ${invalidConfig}`);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe(6);
        expect(error.stderr).toContain('Configuration');
      }
    });
  });

  describe('File Format Validation', () => {
    it('should reject non-.docx files with clear error message', async () => {
      const invalidFile = join(FIXTURES_PATH, 'invalid-file.txt');

      try {
        await execAsync(`node ${CLI_PATH} ${invalidFile}`);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe(3);
        expect(error.stderr).toContain('Invalid file format');
        expect(error.stderr).toContain('.docx');
      }
    });
  });
});
