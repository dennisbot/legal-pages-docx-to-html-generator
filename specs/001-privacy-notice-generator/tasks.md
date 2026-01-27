# Tasks: Privacy Notice HTML Generator

**Input**: Design documents from `/specs/001-privacy-notice-generator/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Not explicitly requested in specification - omitting test tasks per guidance

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Single project structure: `src/`, `tests/`, `config/` at repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure per plan.md including src/, tests/, config/ directories
- [ ] T002 Initialize Node.js project with TypeScript 5.3+ and configure tsconfig.json
- [ ] T003 [P] Install primary dependencies: mammoth@0.6.x, js-yaml@4.1.x, yargs@17.7.x, chalk@5.3.x, zod@3.22.x
- [ ] T004 [P] Install dev dependencies: vitest@1.1.x, @types/node, typescript, tsx
- [ ] T005 [P] Configure ESLint and Prettier for code quality
- [ ] T006 [P] Setup vitest.config.ts for unit and integration testing
- [ ] T007 [P] Configure package.json scripts: build, dev, test, lint
- [ ] T008 [P] Setup esbuild or tsup for bundling CLI executable
- [ ] T009 [P] Create .gitignore for node_modules, dist, coverage

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T010 Create exit code constants in src/utils/exit-codes.ts (codes 0-6 per CLI spec)
- [ ] T011 [P] Implement error handler with stderr formatting in src/utils/error-handler.ts
- [ ] T012 [P] Create configuration types interface in src/config/types.ts based on data-model.md
- [ ] T013 [P] Setup CLI argument parser structure with yargs in src/cli/args-parser.ts
- [ ] T014 [P] Implement stdout/stderr output manager in src/cli/output.ts
- [ ] T015 Create main CLI entry point in src/cli/index.ts with argument handling and error routing

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Generate HTML from Word Document (Priority: P1) 🎯 MVP

**Goal**: Convert .docx files to semantic HTML fragments with BEM class wrappers, preserving document structure (headings, lists, tables, formatting)

**Independent Test**: Provide a .docx file with headings, paragraphs, lists, tables, and verify clean semantic HTML is generated with proper BEM classes and no wrapper elements (html/head/body)

### Implementation for User Story 1

- [ ] T016 [P] [US1] Implement file existence validator in src/validators/file-validator.ts
- [ ] T017 [P] [US1] Implement file size validator (1MB limit) in src/validators/file-validator.ts
- [ ] T018 [P] [US1] Implement file format validator (.docx check) in src/validators/file-validator.ts
- [ ] T019 [US1] Create .docx parser wrapper with mammoth.js in src/converters/docx-parser.ts
- [ ] T020 [US1] Configure mammoth style mappings for semantic HTML conversion (p → p, Heading 1 → h1, etc.)
- [ ] T021 [US1] Implement HTML fragment generator in src/converters/html-generator.ts
- [ ] T022 [US1] Add BEM wrapper generation (text-block-content, text-block-content--privacy-notice-content) in html-generator.ts
- [ ] T023 [US1] Ensure no wrapper elements (html/head/body/header/footer/nav) in generated HTML
- [ ] T024 [US1] Integrate file validation → .docx parsing → HTML generation pipeline in src/cli/index.ts
- [ ] T025 [US1] Add error handling for file not found (exit code 2) in src/cli/index.ts
- [ ] T026 [US1] Add error handling for file size exceeded (exit code 1) in src/cli/index.ts
- [ ] T027 [US1] Add error handling for invalid format (exit code 3) in src/cli/index.ts
- [ ] T028 [US1] Add error handling for corrupted .docx (exit code 4) in src/cli/index.ts
- [ ] T029 [P] [US1] Create sample privacy notice fixture in tests/fixtures/sample-privacy-notice.docx
- [ ] T030 [US1] Create end-to-end integration test verifying .docx → HTML conversion in tests/integration/cli.test.ts

**Checkpoint**: At this point, User Story 1 should be fully functional - users can convert .docx to HTML fragments

---

## Phase 4: User Story 2 - Apply Responsive, Accessible Styling (Priority: P2)

**Goal**: Generate inline CSS with BEM scoping, responsive breakpoints, and WCAG 2.1 AA compliance; validate color contrast and heading hierarchy

**Independent Test**: Generate HTML and verify: (1) all CSS selectors scoped to .text-block-content, (2) passes axe-core WCAG 2.1 AA validation, (3) responsive at all breakpoints (375px-1200px), (4) proper heading hierarchy

### Implementation for User Story 2

- [ ] T031 [P] [US2] Create default configuration YAML in config/default-config.yaml per data-model.md
- [ ] T032 [P] [US2] Implement Zod schema for configuration validation in src/config/validator.ts
- [ ] T033 [US2] Implement configuration loader for YAML/JSON in src/config/loader.ts with js-yaml
- [ ] T034 [US2] Add configuration file existence check and error handling (exit code 6) in src/config/loader.ts
- [ ] T035 [US2] Add YAML/JSON syntax validation with clear error messages (exit code 6) in src/config/validator.ts
- [ ] T036 [US2] Implement color contrast validation (4.5:1 for normal text) in src/config/validator.ts
- [ ] T037 [US2] Add --config CLI flag to args-parser.ts for custom configuration files
- [ ] T038 [P] [US2] Implement CSS generator from configuration in src/converters/css-generator.ts
- [ ] T039 [US2] Generate base styles (typography, colors, spacing) in css-generator.ts
- [ ] T040 [US2] Generate responsive media queries for all breakpoints (tiny: 375px, small: 768px, medium: 992px, landscape: 1024px, large: 1200px) in css-generator.ts
- [ ] T041 [US2] Generate table styles with mobile scroll behavior in css-generator.ts
- [ ] T042 [P] [US2] Implement BEM CSS scoping utility in src/utils/bem-scoper.ts
- [ ] T043 [US2] Validate all CSS selectors are scoped to .text-block-content in bem-scoper.ts
- [ ] T044 [US2] Inject generated CSS into HTML fragment as inline <style> tag in src/converters/html-generator.ts
- [ ] T045 [P] [US2] Implement heading hierarchy validator in src/validators/heading-validator.ts
- [ ] T046 [US2] Validate no skipped heading levels (e.g., h1 → h3) in heading-validator.ts
- [ ] T047 [US2] Integrate heading validation into HTML generation pipeline in src/cli/index.ts
- [ ] T048 [P] [US2] Create valid-config.yaml test fixture in tests/fixtures/test-configs/
- [ ] T049 [P] [US2] Create invalid-config.yaml test fixture in tests/fixtures/test-configs/
- [ ] T050 [US2] Add integration test for custom configuration loading in tests/integration/cli.test.ts
- [ ] T051 [US2] Add integration test for configuration validation errors in tests/integration/error-handling.test.ts

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - HTML has proper styling and passes accessibility checks

---

## Phase 5: User Story 3 - Preview HTML Before Use (Priority: P3)

**Goal**: Provide --preview flag that wraps HTML fragment in complete HTML page for browser testing before Umbraco deployment

**Independent Test**: Generate HTML with --preview flag, open in browser, verify content displays correctly within <main id="Main"> wrapper and responsive behaviors work at mobile dimensions

### Implementation for User Story 3

- [ ] T052 [P] [US3] Add --preview CLI flag to args-parser.ts
- [ ] T053 [P] [US3] Create preview HTML wrapper generator in src/converters/html-generator.ts
- [ ] T054 [US3] Generate complete HTML structure (DOCTYPE, html, head, body) for preview mode
- [ ] T055 [US3] Add viewport meta tag for responsive testing in preview mode
- [ ] T056 [US3] Wrap content in <main id="Main"> to match Umbraco structure in preview mode
- [ ] T057 [US3] Add preview mode routing logic to CLI entry point in src/cli/index.ts
- [ ] T058 [US3] Ensure fragment mode (default) vs preview mode outputs correct format
- [ ] T059 [US3] Add integration test for --preview flag output in tests/integration/cli.test.ts

**Checkpoint**: All user stories should now be independently functional - users can convert, style, and preview HTML

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and production readiness

- [ ] T060 [P] Add --version flag implementation showing version number in src/cli/args-parser.ts
- [ ] T061 [P] Add --help flag with usage examples per CLI interface spec in src/cli/args-parser.ts
- [ ] T062 [P] Enhance error messages with suggestions for common failures (file size, format, config)
- [ ] T063 [P] Add warning messages for unsupported Word elements (SmartArt, embedded objects) in src/converters/docx-parser.ts
- [ ] T064 [P] Add warning for documents without heading structure (accessibility impact) in src/validators/heading-validator.ts
- [ ] T065 [P] Add special character and Unicode handling in src/converters/html-generator.ts
- [ ] T066 [P] Implement color-based terminal output with chalk for errors/warnings in src/cli/output.ts
- [ ] T067 [P] Add NO_COLOR environment variable support in src/cli/output.ts
- [ ] T068 [P] Add PRIVACY_NOTICE_CONFIG environment variable support in src/config/loader.ts
- [ ] T069 [P] Create invalid-file.txt test fixture in tests/fixtures/
- [ ] T070 [P] Add edge case test for oversized file (>1MB) in tests/integration/error-handling.test.ts
- [ ] T071 [P] Add edge case test for deeply nested lists (4+ levels) in tests/integration/cli.test.ts
- [ ] T072 [P] Add edge case test for very wide tables in tests/integration/cli.test.ts
- [ ] T073 [P] Add edge case test for document with no headings in tests/integration/cli.test.ts
- [ ] T074 [P] Setup executable bin configuration in package.json for global install
- [ ] T075 [P] Create README.md with installation and basic usage
- [ ] T076 [P] Add GitHub repository link to --help output and error messages
- [ ] T077 Code cleanup and refactoring for maintainability
- [ ] T078 Run quickstart.md validation to ensure all documented commands work

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Extends US1 but adds CSS independently
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Minimal wrapper around US1 output

**Key Insight**: All three user stories are highly independent. US2 adds CSS generation to US1's HTML output. US3 adds a simple wrapper. No complex cross-story dependencies.

### Within Each User Story

- File validation before parsing
- Parsing before generation
- Generation before output
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- **Setup (Phase 1)**: T003-T009 can all run in parallel (independent installations/configurations)
- **Foundational (Phase 2)**: T011, T012, T013, T014 can run in parallel (different files)
- **User Story 1**: T016-T018 (validators), T029 (fixture) can run in parallel
- **User Story 2**: T031-T032 (config files), T038 (CSS gen), T042 (BEM scoper), T045 (heading validator), T048-T049 (fixtures) can run in parallel
- **User Story 3**: T052-T053 (preview flag and generator) can run in parallel
- **Polish**: Most tasks (T060-T076) can run in parallel as they touch different files

---

## Parallel Example: User Story 1

```bash
# Launch validators in parallel (different files, no dependencies):
Task T016: "Implement file existence validator in src/validators/file-validator.ts"
Task T017: "Implement file size validator (1MB limit) in src/validators/file-validator.ts"
Task T018: "Implement file format validator (.docx check) in src/validators/file-validator.ts"

# Note: T016-T018 are in same file, but different functions - can be developed in parallel by splitting file

# Launch fixture creation in parallel with implementation:
Task T029: "Create sample privacy notice fixture in tests/fixtures/sample-privacy-notice.docx"
```

## Parallel Example: User Story 2

```bash
# Launch configuration and generators in parallel:
Task T031: "Create default configuration YAML in config/default-config.yaml"
Task T032: "Implement Zod schema for configuration validation in src/config/validator.ts"
Task T038: "Implement CSS generator from configuration in src/converters/css-generator.ts"
Task T042: "Implement BEM CSS scoping utility in src/utils/bem-scoper.ts"
Task T045: "Implement heading hierarchy validator in src/validators/heading-validator.ts"

# Launch test fixtures in parallel:
Task T048: "Create valid-config.yaml test fixture in tests/fixtures/test-configs/"
Task T049: "Create invalid-config.yaml test fixture in tests/fixtures/test-configs/"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T009)
2. Complete Phase 2: Foundational (T010-T015) - CRITICAL: blocks all stories
3. Complete Phase 3: User Story 1 (T016-T030)
4. **STOP and VALIDATE**: Test .docx → HTML conversion independently
5. Deploy CLI tool (basic functionality working)

**Outcome**: Legal team can convert Word documents to HTML fragments - core value delivered!

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → **Deploy MVP** (basic conversion)
3. Add User Story 2 → Test independently → **Deploy v1.1** (styled + accessible HTML)
4. Add User Story 3 → Test independently → **Deploy v1.2** (preview mode)
5. Add Polish → **Deploy v1.3** (production-ready)

Each increment adds value without breaking previous functionality.

### Parallel Team Strategy

With multiple developers (after Foundational phase complete):

1. **Team completes Setup + Foundational together** (T001-T015)
2. **Once Foundational is done, split work**:
   - Developer A: User Story 1 (T016-T030) - Core conversion
   - Developer B: User Story 2 (T031-T051) - CSS generation (can work in parallel with A)
   - Developer C: User Story 3 (T052-T059) - Preview mode (can work in parallel with A/B)
3. **Stories integrate cleanly**: US2 injects CSS into US1's HTML, US3 wraps US1's output

---

## Task Summary

**Total Tasks**: 78 tasks

### Breakdown by Phase
- **Phase 1 (Setup)**: 9 tasks
- **Phase 2 (Foundational)**: 6 tasks (blocking)
- **Phase 3 (US1 - Core Conversion)**: 15 tasks 🎯 MVP
- **Phase 4 (US2 - Styling & A11y)**: 21 tasks
- **Phase 5 (US3 - Preview)**: 8 tasks
- **Phase 6 (Polish)**: 19 tasks

### Parallel Opportunities Identified
- **Setup**: 7 parallel tasks (T003-T009)
- **Foundational**: 4 parallel tasks (T011-T014)
- **US1**: 4 parallel tasks (T016-T018, T029)
- **US2**: 7 parallel tasks (T031-T032, T038, T042, T045, T048-T049)
- **US3**: 2 parallel tasks (T052-T053)
- **Polish**: 17 parallel tasks (T060-T076)

**Total Parallelizable**: 41 tasks (52.6% of all tasks)

### Independent Test Criteria

- **US1**: Provide test .docx with headings/lists/tables → verify semantic HTML with BEM classes, no wrappers
- **US2**: Generate HTML → verify CSS scoped, passes axe-core WCAG AA, responsive at all breakpoints
- **US3**: Use --preview flag → open in browser → verify displays in <main id="Main"> with responsive behavior

### MVP Scope (Recommended)

**Phase 1 + Phase 2 + Phase 3 (User Story 1 only)** = 30 tasks

This delivers core value: legal team can convert .docx → HTML fragments ready for Umbraco.

---

## Notes

- [P] tasks = different files, no dependencies - can run in parallel
- [Story] label (US1, US2, US3) maps task to specific user story for traceability
- Each user story is independently completable and testable
- Tests not included per spec guidance (not explicitly requested)
- Commit after each task or logical group of related tasks
- Stop at any checkpoint to validate story independently
- Exit codes 0-6 per CLI interface specification
- WCAG 2.1 AA compliance is non-negotiable (Constitution Principle II)
- BEM scoping prevents style conflicts across 15+ websites
