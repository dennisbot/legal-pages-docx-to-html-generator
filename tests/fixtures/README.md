# Test Fixtures

This directory contains test files for integration testing.

## Required Fixtures

### sample-privacy-notice.docx

A Word document containing typical privacy notice content for testing the conversion pipeline.

**Required content:**
- Heading 1: "Privacy Notice"
- Heading 2: "Information We Collect"
- Paragraphs with normal text
- Bulleted list with 3-4 items
- Numbered list with 3-4 items
- Heading 2: "How We Use Your Data"
- Table with 2-3 columns and 3-4 rows (header + data rows)
- Text with bold, italic, and hyperlinks
- Heading 3: "Your Rights"
- More paragraphs

**To create:**
1. Open Microsoft Word
2. Create a new document
3. Add the content listed above using standard Word formatting
4. Save as: `sample-privacy-notice.docx` in this directory

### invalid-file.txt

A plain text file to test invalid format handling.

**To create:**
```bash
echo "This is not a .docx file" > invalid-file.txt
```

### large-file.docx (optional)

A Word document exceeding 1MB for testing file size limits.

**To create:**
1. Copy sample-privacy-notice.docx
2. Add many high-resolution images to exceed 1MB
3. Save as: `large-file.docx`

## Test Configuration Files

### test-configs/valid-config.yaml

A valid YAML configuration file for testing custom configurations.

### test-configs/invalid-config.yaml

A malformed YAML file for testing configuration error handling.
