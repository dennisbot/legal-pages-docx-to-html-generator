# CLI Interface Specification

**Tool**: Privacy Notice HTML Generator
**Date**: 2026-01-27
**Version**: 1.0.0

## Command Synopsis

```bash
privacy-notice-gen <input-file> [options]
```

## Description

Converts Word documents (.docx) to styled, accessible HTML fragments ready for Umbraco Rich Text Editor.

## Usage

### Basic Usage

```bash
# Convert with default configuration
privacy-notice-gen privacy-notice.docx > output.html

# Pipe to clipboard (Windows)
privacy-notice-gen privacy-notice.docx | clip

# Pipe to clipboard (macOS)
privacy-notice-gen privacy-notice.docx | pbcopy

# Save to file with redirection
privacy-notice-gen privacy-notice.docx > output.html 2> errors.log
```

### With Custom Configuration

```bash
# Use custom config file
privacy-notice-gen privacy-notice.docx --config custom-config.yaml

# Use custom config with short flag
privacy-notice-gen privacy-notice.docx -c custom-config.yaml
```

### Preview Mode

```bash
# Generate full HTML page for browser preview
privacy-notice-gen privacy-notice.docx --preview > preview.html
```

## Arguments

### Positional Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `<input-file>` | Yes | Path to Word document (.docx file) |

**Constraints**:
- File must exist and be readable
- File size must not exceed 1MB
- File extension must be `.docx`

## Options

| Flag | Short | Type | Default | Description |
|------|-------|------|---------|-------------|
| `--config` | `-c` | path | Built-in defaults | Path to YAML/JSON configuration file |
| `--preview` | `-p` | boolean | `false` | Generate complete HTML page for browser preview |
| `--version` | `-v` | boolean | - | Display version number and exit |
| `--help` | `-h` | boolean | - | Display help message and exit |

### Option Details

#### `--config <path>` / `-c <path>`

Specify a custom configuration file for styling.

**Accepted formats**:
- YAML (`.yaml`, `.yml`)
- JSON (`.json`)

**Behavior**:
- If not specified: Uses built-in default configuration
- If specified but not found: Exit with code 6 and error message
- If specified but invalid: Exit with code 6 and validation errors

**Example**:
```bash
privacy-notice-gen notice.docx --config brand-a-config.yaml
```

#### `--preview` / `-p`

Generate a complete HTML page instead of just the fragment.

**Output includes**:
- `<!DOCTYPE html>`, `<html>`, `<head>`, `<body>` wrappers
- Viewport meta tag for responsive testing
- Inline styles (same as fragment mode)
- Content wrapped in `<main id="Main">` to match Umbraco structure

**Use case**: Test in browser before deploying to Umbraco RTE

**Example**:
```bash
privacy-notice-gen notice.docx --preview > preview.html
open preview.html  # macOS
start preview.html # Windows
```

#### `--version` / `-v`

Display version number and exit.

**Output format**:
```
privacy-notice-gen version 1.0.0
```

**Exit code**: 0

#### `--help` / `-h`

Display help message with usage examples.

**Example output**:
```
privacy-notice-gen - Convert Word documents to accessible HTML

USAGE:
  privacy-notice-gen <input-file> [options]

OPTIONS:
  -c, --config <path>   Custom configuration file (YAML/JSON)
  -p, --preview         Generate full HTML page for browser testing
  -v, --version         Display version number
  -h, --help            Display this help message

EXAMPLES:
  privacy-notice-gen notice.docx > output.html
  privacy-notice-gen notice.docx --config custom.yaml | clip
  privacy-notice-gen notice.docx --preview > preview.html

EXIT CODES:
  0 - Success
  1 - File size exceeded (>1MB)
  2 - File not found
  3 - Invalid file format (not .docx)
  4 - Corrupted .docx file
  5 - Unsupported document structure
  6 - Configuration error

For more information, visit: https://github.com/your-org/privacy-notice-gen
```

## Output Behavior

### Standard Output (stdout)

**Contains**: Generated HTML only (no diagnostics)

**Fragment Mode** (default):
```html
<style>
/* Inline CSS here */
</style>
<div class="text-block-content text-block-content--privacy-notice-content">
  <!-- Converted content here -->
</div>
```

**Preview Mode** (`--preview`):
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Privacy Notice Preview</title>
  <style>
  /* Inline CSS here */
  </style>
</head>
<body>
  <main id="Main">
    <div class="text-block-content text-block-content--privacy-notice-content">
      <!-- Converted content here -->
    </div>
  </main>
</body>
</html>
```

### Standard Error (stderr)

**Contains**: All diagnostics (errors, warnings)

**Error Format**:
```
Error: File not found at path 'nonexistent.docx'
```

**Warning Format**:
```
Warning: Skipped unsupported element (SmartArt) at paragraph 12
Warning: Table exceeds 1920px width, wrapped in scrollable container
```

## Exit Codes

| Code | Name | Description | Example Scenario |
|------|------|-------------|------------------|
| **0** | Success | HTML generated successfully | Happy path |
| **1** | File Size Exceeded | Input file exceeds 1MB limit | 1.5MB Word document |
| **2** | File Not Found | Specified file path does not exist | Typo in filename |
| **3** | Invalid File Format | File is not a valid .docx format | `.doc` (old format) or `.txt` file |
| **4** | Corrupted File | .docx file cannot be parsed | Truncated download, corrupted zip |
| **5** | Unsupported Structure | Document contains unconvertible structure | Complex macros, ActiveX controls |
| **6** | Configuration Error | Config file missing, malformed, or invalid | YAML syntax error, WCAG violation |

## Error Message Examples

### Exit Code 1: File Size Exceeded

```
Error: File size exceeded
  File: large-document.docx
  Size: 1.5 MB
  Limit: 1.0 MB

Suggestion: Split document into smaller sections or remove embedded images
```

### Exit Code 2: File Not Found

```
Error: File not found at path 'privacy-notice.docx'

Check that:
  - File path is correct
  - File exists in current directory
  - You have read permissions
```

### Exit Code 3: Invalid File Format

```
Error: Invalid file format. Expected .docx file.
  File: privacy-notice.doc
  Format: Microsoft Word 97-2003 (.doc)

Suggestion: Save file as .docx (Word 2007+ format)
```

### Exit Code 4: Corrupted File

```
Error: Corrupted or unreadable .docx file.
  File: privacy-notice.docx

This may indicate:
  - Incomplete file download
  - File corruption during transfer
  - Invalid .docx structure

Suggestion: Re-download or re-save the file
```

### Exit Code 5: Unsupported Structure

```
Error: Document contains unsupported structure that cannot be converted
  Unsupported elements:
    - ActiveX controls (paragraph 5)
    - Embedded macros (VBA code)

Suggestion: Remove unsupported elements and try again
```

### Exit Code 6: Configuration Error

```
Error: Configuration file is malformed. Invalid YAML syntax.
  File: custom-config.yaml
  Line: 12
  Column: 15

YAML Error: Expected a value but found unexpected character ':'

---

Error: Configuration validation failed
  colors.text: "#fff" does not match format #RRGGBB (6 digits required)
  colors.text and colors.background: Contrast ratio 2.8:1, required 4.5:1 (WCAG 2.1 AA)

Suggestion: Use 6-digit hex colors and ensure sufficient contrast
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PRIVACY_NOTICE_CONFIG` | Default config file path | None (uses built-in defaults) |
| `NO_COLOR` | Disable colored error output | Disabled (colors enabled) |

**Example**:
```bash
export PRIVACY_NOTICE_CONFIG=./brand-config.yaml
privacy-notice-gen notice.docx > output.html
```

## Piping and Redirection

### Supported Patterns

```bash
# Basic redirection
privacy-notice-gen input.docx > output.html

# Separate stdout and stderr
privacy-notice-gen input.docx > output.html 2> errors.log

# Pipe to clipboard
privacy-notice-gen input.docx | clip        # Windows
privacy-notice-gen input.docx | pbcopy      # macOS
privacy-notice-gen input.docx | xclip -sel clip  # Linux

# Pipe to other tools
privacy-notice-gen input.docx | prettier --parser html

# Check for errors
privacy-notice-gen input.docx > output.html
if [ $? -eq 0 ]; then echo "Success"; fi
```

### Anti-Patterns (DO NOT USE)

```bash
# BAD: Mixing stdout and stderr
privacy-notice-gen input.docx 2>&1 | clip  # Errors mixed with HTML!

# BAD: Using cat (redundant)
cat input.docx | privacy-notice-gen -  # Tool expects file path, not stdin
```

## Scripting Integration

### Bash Script Example

```bash
#!/bin/bash
set -e

INPUT_FILE="$1"
OUTPUT_FILE="$2"
CONFIG="./brand-config.yaml"

# Validate input
if [ ! -f "$INPUT_FILE" ]; then
  echo "Error: Input file not found: $INPUT_FILE" >&2
  exit 2
fi

# Convert
privacy-notice-gen "$INPUT_FILE" --config "$CONFIG" > "$OUTPUT_FILE" 2> conversion-errors.log

# Check exit code
if [ $? -eq 0 ]; then
  echo "✓ Conversion successful: $OUTPUT_FILE"
  rm conversion-errors.log
else
  echo "✗ Conversion failed (exit code: $?)" >&2
  cat conversion-errors.log >&2
  exit 1
fi
```

### PowerShell Script Example

```powershell
param(
  [Parameter(Mandatory=$true)]
  [string]$InputFile,

  [Parameter(Mandatory=$true)]
  [string]$OutputFile,

  [string]$Config = ".\brand-config.yaml"
)

# Convert
privacy-notice-gen $InputFile --config $Config > $OutputFile 2> errors.log

if ($LASTEXITCODE -eq 0) {
  Write-Host "✓ Conversion successful: $OutputFile" -ForegroundColor Green
  Remove-Item errors.log
} else {
  Write-Error "✗ Conversion failed (exit code: $LASTEXITCODE)"
  Get-Content errors.log
  exit $LASTEXITCODE
}
```

## Performance Characteristics

| Metric | Target | Notes |
|--------|--------|-------|
| **Startup time** | <500ms | Time to parse args and load config |
| **Processing time** | <2s for 1MB file | Word parsing + HTML generation + validation |
| **Memory usage** | <100MB peak | In-memory processing (no temp files) |
| **Exit time** | <100ms | Clean shutdown, no hanging processes |

## Compatibility

| Platform | Node.js Version | Status |
|----------|----------------|--------|
| Windows 10/11 | 20.x LTS | ✅ Fully supported |
| macOS 12+ | 20.x LTS | ✅ Fully supported |
| Linux (Ubuntu 20.04+) | 20.x LTS | ✅ Fully supported |
| Node.js 18.x | LTS | ⚠️ May work but not officially supported |
| Node.js 22.x | Current | ✅ Supported (forward compatible) |

## Security Considerations

- **No network access**: Tool operates entirely offline
- **No file system modification**: Only reads input file, writes to stdout
- **No arbitrary code execution**: Does not eval configuration or execute macros
- **Safe parsing**: Uses trusted libraries (mammoth.js, js-yaml) with no known vulnerabilities

---

**CLI Interface Status**: ✅ COMPLETE | Contract defined
