# Quick Start Guide: Privacy Notice HTML Generator

**Tool**: `privacy-notice-gen`
**Version**: 1.0.0
**Last Updated**: 2026-01-27

## What is This Tool?

`privacy-notice-gen` converts Word documents (.docx) to styled, accessible HTML fragments ready for Umbraco Rich Text Editor (RTE). It applies modern responsive design, WCAG 2.1 AA accessibility standards, and BEM CSS conventions automatically.

**Key Features**:
- ✅ Converts .docx → semantic HTML with inline CSS
- ✅ WCAG 2.1 AA compliant (color contrast, heading hierarchy, screen reader support)
- ✅ Responsive design at 5 breakpoints (375px - 1200px)
- ✅ BEM-scoped CSS (no style conflicts with existing sites)
- ✅ Configurable styling via YAML/JSON files
- ✅ Unix-friendly CLI (pipes, redirection, specific exit codes)

---

## Installation

### Prerequisites

- **Node.js**: Version 20.x LTS or higher ([Download](https://nodejs.org/))
- **Operating System**: Windows 10+, macOS 12+, or Linux (Ubuntu 20.04+)

### Install via npm

```bash
npm install -g privacy-notice-gen
```

### Verify Installation

```bash
privacy-notice-gen --version
# Expected output: privacy-notice-gen version 1.0.0
```

---

## Basic Usage

### Convert a Word Document to HTML

```bash
privacy-notice-gen privacy-notice.docx > output.html
```

**What happens**:
1. Reads `privacy-notice.docx` from current directory
2. Extracts semantic structure (headings, paragraphs, lists, tables)
3. Applies default responsive styling with WCAG 2.1 AA compliance
4. Outputs HTML fragment to `output.html`

**Output format** (fragment mode):
```html
<style>
/* Inline CSS here */
</style>
<div class="text-block-content text-block-content--privacy-notice-content">
  <h1>Privacy Notice</h1>
  <p>Your content here...</p>
</div>
```

### Copy Output to Clipboard

**Windows**:
```bash
privacy-notice-gen privacy-notice.docx | clip
```

**macOS**:
```bash
privacy-notice-gen privacy-notice.docx | pbcopy
```

**Linux**:
```bash
privacy-notice-gen privacy-notice.docx | xclip -sel clip
```

**Then**: Paste directly into Umbraco Rich Text Editor.

### Preview in Browser

```bash
privacy-notice-gen privacy-notice.docx --preview > preview.html
```

Open `preview.html` in your browser to test responsive behavior before deploying to Umbraco.

**Preview mode differences**:
- Includes `<!DOCTYPE html>`, `<html>`, `<head>`, `<body>` wrappers
- Wraps content in `<main id="Main">` (matches Umbraco structure)
- Same styling as fragment mode

---

## Using Custom Configuration

### Create a Configuration File

Create `brand-config.yaml` in your project directory:

```yaml
version: "1.0.0"

colors:
  text: "#2c3e50"           # Dark blue-gray
  textMuted: "#7f8c8d"      # Muted gray
  headings: "#1a252f"       # Near-black
  links: "#2980b9"          # Blue
  linksHover: "#1f618d"     # Darker blue
  background: "#ffffff"     # White
  tableHeader: "#ecf0f1"    # Light gray
  tableRowAlt: "#f8f9fa"    # Very light gray
  focus: "#2980b9"          # Blue (keyboard focus)

typography:
  fontFamily: "Georgia, serif"
  baseFontSize: 16
  baseLineHeight: 1.6
  scaleH1: 2.5    # 40px
  scaleH2: 2.0    # 32px
  scaleH3: 1.5    # 24px
  scaleH4: 1.25   # 20px
  fontWeightNormal: 400
  fontWeightBold: 700
  fontWeightHeadings: 600

spacing:
  xs: 4
  sm: 8
  md: 16
  lg: 24
  xl: 32
  xxl: 48

breakpoints:
  tiny: 375
  small: 768
  medium: 992
  landscape: 1024
  large: 1200

tables:
  borderColor: "#bdc3c7"
  borderWidth: 1
  cellPadding: 12
  headerBackground: "#ecf0f1"
  headerTextColor: "#2c3e50"
  stripedRows: true
  mobileScrollable: true

bem:
  baseClass: "text-block-content"
  variantClass: "privacy-notice-content"
```

### Use Custom Configuration

```bash
privacy-notice-gen privacy-notice.docx --config brand-config.yaml > output.html
```

### Configuration Tips

1. **Color Contrast**: Tool automatically validates WCAG 2.1 AA compliance. If colors fail contrast requirements, you'll get an error with suggestions.

2. **Font Sizes**: Use the scale multipliers to maintain proportional sizing:
   - `baseFontSize: 16` → h1 = 40px (16 × 2.5)
   - Adjust base size to scale all text proportionally

3. **Spacing System**: All spacing values must be multiples of 4 (8px grid system):
   - Valid: 4, 8, 12, 16, 20, 24...
   - Invalid: 5, 10, 15...

4. **Breakpoints**: Must be in ascending order and ≥320px

---

## Workflow Integration

### Bash Script Example

Save as `convert-notices.sh`:

```bash
#!/bin/bash
set -e

INPUT_DIR="./source-docs"
OUTPUT_DIR="./html-output"
CONFIG="./brand-config.yaml"

mkdir -p "$OUTPUT_DIR"

for docx in "$INPUT_DIR"/*.docx; do
  filename=$(basename "$docx" .docx)
  echo "Converting: $filename"

  privacy-notice-gen "$docx" --config "$CONFIG" > "$OUTPUT_DIR/$filename.html" 2> "$OUTPUT_DIR/$filename.log"

  if [ $? -eq 0 ]; then
    echo "✓ Success: $filename.html"
    rm "$OUTPUT_DIR/$filename.log"
  else
    echo "✗ Failed: Check $filename.log"
  fi
done
```

Run:
```bash
chmod +x convert-notices.sh
./convert-notices.sh
```

### PowerShell Script Example

Save as `Convert-Notices.ps1`:

```powershell
param(
  [string]$InputDir = ".\source-docs",
  [string]$OutputDir = ".\html-output",
  [string]$Config = ".\brand-config.yaml"
)

New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null

Get-ChildItem -Path $InputDir -Filter "*.docx" | ForEach-Object {
  $inputFile = $_.FullName
  $outputFile = Join-Path $OutputDir "$($_.BaseName).html"
  $logFile = Join-Path $OutputDir "$($_.BaseName).log"

  Write-Host "Converting: $($_.Name)"

  privacy-notice-gen $inputFile --config $Config > $outputFile 2> $logFile

  if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Success: $($_.BaseName).html" -ForegroundColor Green
    Remove-Item $logFile
  } else {
    Write-Host "✗ Failed: Check $($_.BaseName).log" -ForegroundColor Red
  }
}
```

Run:
```powershell
.\Convert-Notices.ps1
```

---

## Troubleshooting

### Error: File not found

```
Error: File not found at path 'privacy-notice.docx'
```

**Solutions**:
1. Verify file exists: `ls privacy-notice.docx` (Linux/macOS) or `dir privacy-notice.docx` (Windows)
2. Use absolute path: `privacy-notice-gen /full/path/to/file.docx`
3. Check file permissions (must be readable)

---

### Error: File size exceeded

```
Error: File size exceeded
  File: large-document.docx
  Size: 1.5 MB
  Limit: 1.0 MB
```

**Solutions**:
1. Split document into smaller sections
2. Remove embedded images or compress them
3. Save as new .docx file (may reduce file size)

---

### Error: Invalid file format

```
Error: Invalid file format. Expected .docx file.
  File: privacy-notice.doc
  Format: Microsoft Word 97-2003 (.doc)
```

**Solution**: Open file in Microsoft Word and save as `.docx` (Word 2007+ format):
1. File → Save As
2. Choose "Word Document (*.docx)"
3. Save and try again

---

### Error: Configuration validation failed

```
Error: Configuration validation failed
  colors.text and colors.background: Contrast ratio 2.8:1, required 4.5:1 (WCAG 2.1 AA)
```

**Solution**: Use the [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) to find compliant colors:
1. Enter your text color and background color
2. Ensure ratio is at least 4.5:1 for normal text
3. Update configuration file with compliant colors

---

### Warning: Skipped unsupported element

```
Warning: Skipped unsupported element (SmartArt) at paragraph 12
```

**What this means**: The tool skipped an element it cannot convert (SmartArt, embedded objects, macros, etc.)

**Solutions**:
1. Replace SmartArt with simple lists or tables in Word document
2. Remove ActiveX controls or embedded objects
3. Convert complex graphics to static images

**Note**: This is a warning, not an error. The conversion still succeeds (exit code 0).

---

### Generated HTML doesn't render correctly in Umbraco

**Checklist**:
1. ✅ Did you paste the **entire output** including `<style>` tags?
2. ✅ Is the RTE set to "Source" mode when pasting?
3. ✅ Did you use `--preview` flag? (Don't paste preview mode HTML into RTE)
4. ✅ Are there conflicting CSS rules in your site's global styles?

**Test in isolation**:
1. Generate with `--preview` flag
2. Open preview.html in browser
3. If it looks correct, the issue is with Umbraco/site CSS conflicts

---

### Tables don't scroll on mobile

**Verify configuration**:

```yaml
tables:
  mobileScrollable: true  # Must be true for horizontal scroll
```

If already true, check your site's CSS for conflicting `table { display: table; }` rules that override the tool's output.

---

## Advanced Usage

### Environment Variables

Set default configuration file:

```bash
# Linux/macOS
export PRIVACY_NOTICE_CONFIG=./brand-config.yaml
privacy-notice-gen notice.docx > output.html

# Windows (PowerShell)
$env:PRIVACY_NOTICE_CONFIG = ".\brand-config.yaml"
privacy-notice-gen notice.docx > output.html
```

Disable colored error output (for CI/CD logs):

```bash
NO_COLOR=1 privacy-notice-gen notice.docx > output.html
```

---

### Exit Codes for CI/CD

Use exit codes to handle errors in automated workflows:

```bash
privacy-notice-gen notice.docx > output.html 2> errors.log

case $? in
  0) echo "Success" ;;
  1) echo "File too large" ;;
  2) echo "File not found" ;;
  3) echo "Invalid format" ;;
  4) echo "Corrupted file" ;;
  5) echo "Unsupported structure" ;;
  6) echo "Configuration error" ;;
esac
```

**Exit Code Reference**:
- **0**: Success
- **1**: File size exceeded (>1MB)
- **2**: File not found
- **3**: Invalid file format (not .docx)
- **4**: Corrupted .docx file
- **5**: Unsupported document structure
- **6**: Configuration error (malformed or WCAG violation)

---

## Next Steps

1. **Customize Configuration**: Copy the example configuration and adjust colors/fonts for your brand
2. **Test Accessibility**: Use `--preview` mode and test with screen readers or browser accessibility tools
3. **Automate Workflow**: Create scripts to batch-convert multiple documents
4. **Share Configuration**: Commit configuration files to your repository for team consistency

---

## Getting Help

- **Documentation**: [Full CLI Reference](./contracts/cli-interface.md)
- **Configuration Schema**: [Data Model](./data-model.md)
- **JSON Schema**: [contracts/config-schema.json](./contracts/config-schema.json)
- **Issues**: [GitHub Issues](https://github.com/your-org/privacy-notice-gen/issues)

---

**Quick Start Status**: ✅ COMPLETE | Ready for users
