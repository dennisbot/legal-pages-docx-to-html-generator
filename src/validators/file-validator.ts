import { stat, access } from 'fs/promises';
import { constants } from 'fs';
import { handleFileNotFound, handleFileSizeExceeded, handleInvalidFileFormat } from '../utils/error-handler.js';

/** Maximum file size: 1MB in bytes */
const MAX_FILE_SIZE = 1024 * 1024;

/**
 * Validate that a file exists and is readable
 * T016: File existence validator
 */
export async function validateFileExists(filePath: string): Promise<void> {
  try {
    await access(filePath, constants.R_OK);
  } catch {
    handleFileNotFound(filePath);
  }
}

/**
 * Validate that a file does not exceed the maximum size limit
 * T017: File size validator (1MB limit)
 */
export async function validateFileSize(filePath: string): Promise<void> {
  try {
    const stats = await stat(filePath);
    const fileSize = stats.size;

    if (fileSize > MAX_FILE_SIZE) {
      handleFileSizeExceeded(filePath, fileSize, MAX_FILE_SIZE);
    }
  } catch (error) {
    // If we can't stat the file, it probably doesn't exist
    handleFileNotFound(filePath);
  }
}

/**
 * Validate that a file has a .docx extension
 * T018: File format validator (.docx check)
 */
export function validateFileFormat(filePath: string): void {
  const extension = filePath.toLowerCase().split('.').pop();

  if (extension !== 'docx') {
    const detectedFormat = extension ? `.${extension}` : 'unknown';
    handleInvalidFileFormat(filePath, detectedFormat);
  }
}

/**
 * Run all file validations in sequence
 * Ensures the file is valid before processing
 */
export async function validateFile(filePath: string): Promise<void> {
  // Check format first (fastest check, no I/O)
  validateFileFormat(filePath);

  // Check existence (requires file system access)
  await validateFileExists(filePath);

  // Check size (requires file stats)
  await validateFileSize(filePath);
}
