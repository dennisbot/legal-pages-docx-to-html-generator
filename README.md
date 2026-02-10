# Legal Pages HTML Generator

Convert legal document Word files (.docx) to styled, accessible HTML fragments for Umbraco RTE with BEM conventions and WCAG 2.1 AA compliance.

**Package**: `legal-pages-gen`
**Repository**: https://github.com/dennisbot/legal-pages-docx-to-html-generator

## Status

✅ **Version 2.0.0** - Production ready with BEM table styling and advanced features.

## Quick Start

### Prerequisites

- Node.js 20.x LTS or higher
- npm or yarn

### Installation

```bash
# Install globally via npm
npm install -g legal-pages-gen

# Or clone and build locally
git clone https://github.com/dennisbot/legal-pages-docx-to-html-generator.git
cd legal-pages-docx-to-html-generator

# Install dependencies
npm install

# Build the project
npm run build

# Run the CLI tool
legal-pages-gen legal-document.docx > output.html
```

### Development

```bash
# Run in development mode
npm run dev -- <file.docx>

# Run tests
npm test

# Run linter
npm run lint

# Format code
npm run format

# Type checking
npm run type-check
```

## Features

- ✅ Convert .docx → semantic HTML with inline CSS
- ✅ WCAG 2.1 AA compliant (color contrast, heading hierarchy, screen reader support)
- ✅ Responsive design at 5 breakpoints (375px - 1200px)
- ✅ BEM-scoped CSS (no style conflicts with existing sites)
- ✅ Configurable styling via YAML/JSON files
- ✅ Unix-friendly CLI (pipes, redirection, specific exit codes)

## Documentation

### For Content Authors (Legal Team)

- **[Document Formatting Guide](./DOCUMENT-FORMATTING-GUIDE.md)** ← **START HERE** if you're preparing Word documents for conversion

### For Developers

Full technical documentation available in `/specs/001-privacy-notice-generator/`:

- [Feature Specification](./specs/001-privacy-notice-generator/spec.md)
- [Implementation Plan](./specs/001-privacy-notice-generator/plan.md)
- [Quick Start Guide](./specs/001-privacy-notice-generator/quickstart.md)
- [Data Model](./specs/001-privacy-notice-generator/data-model.md)
- [CLI Interface](./specs/001-privacy-notice-generator/contracts/cli-interface.md)

## Development

### Windows Users

If you're developing on Windows with Claude Code, npm commands may not show output correctly. Use this workaround:

```bash
# Instead of: npm run build
cmd //c "npm.cmd run build"
```

This bypasses Git Bash subprocess output capture issues on Windows.

## Project Structure

```
src/
├── cli/            # CLI entry point and argument parsing
├── converters/     # .docx parsing and HTML generation
├── config/         # Configuration loading and validation
├── validators/     # File, accessibility, and heading validators
└── utils/          # Error handling, exit codes, BEM scoping

tests/
├── fixtures/       # Test .docx files and configurations
├── unit/           # Unit tests
├── integration/    # Integration tests
└── visual/         # Visual regression tests

config/
└── default-config.yaml    # Default styling configuration
```

## License

MIT

## Contributing

This project follows the Specify workflow for structured feature development.
