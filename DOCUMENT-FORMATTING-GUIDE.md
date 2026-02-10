# Document Formatting Guide for Legal Team

**For HTML Generator Tool Users**

This guide explains how to properly format Word documents (.docx) to ensure accurate and semantic HTML conversion. Following these guidelines will prevent formatting issues and ensure your content displays correctly on the web.

---

## Table of Contents

1. [Critical: Use Proper Heading Styles](#1-critical-use-proper-heading-styles)
2. [Lists: Avoid Nested Structure Confusion](#2-lists-avoid-nested-structure-confusion)
3. [Tables: Best Practices](#3-tables-best-practices)
4. [Text Formatting](#4-text-formatting)
5. [Links](#5-links)
6. [What NOT to Include](#6-what-not-to-include)
7. [Quick Checklist](#7-quick-checklist)

---

## 1. Critical: Use Proper Heading Styles

### ❌ WRONG: Manual Formatting
**DON'T** manually format text to look like a heading:
- Don't just make text bold and large
- Don't change font size manually
- Don't use underline or color to indicate headings

**Example of WRONG approach:**
```
[Bold, 18pt] Introduction
[Bold, 16pt] Data Collection
[Bold, 14pt] Personal Information
```

### ✅ CORRECT: Use Built-in Heading Styles
**DO** use Word's built-in Heading styles:
- Use **Heading 1** for main sections
- Use **Heading 2** for subsections
- Use **Heading 3** for sub-subsections
- Continue the hierarchy as needed

**How to apply:**
1. Select your heading text
2. Go to the **Home** tab
3. Click on **Styles** pane
4. Choose **Heading 1**, **Heading 2**, **Heading 3**, etc.

**Example of CORRECT approach:**
```
[Heading 1 style] Introduction
[Heading 2 style] Data Collection
[Heading 3 style] Personal Information
```

### Why This Matters:
- ✅ Creates proper semantic HTML structure (`<h1>`, `<h2>`, `<h3>`)
- ✅ Enables accessibility for screen readers
- ✅ Ensures correct document outline
- ✅ Improves SEO and navigation
- ❌ Manual formatting generates generic `<p>` tags with bold text (incorrect semantics)

---

## 2. Lists: Avoid Nested Structure Confusion

### ❌ WRONG: Using Tab for Visual Spacing

**DON'T** press Tab in lists to create extra indentation for visual spacing:

```
• Item 1
	• Item 2   ← This creates a nested list!
	• Item 3   ← This also creates a nested list!
• Item 4
```

**What happens:** This creates nested HTML structure `<ul><li>Item 1<ul><li>Item 2</li></ul></li></ul>` when you only wanted a flat list with indentation.

### ✅ CORRECT: Use Single-Level Lists

**DO** keep all items at the same list level:

```
• Item 1
• Item 2
• Item 3
• Item 4
```

**How to fix over-indented items:**
1. Place cursor on the indented item
2. Press **Shift + Tab** to decrease indent
3. All items should align at the same level

### When Nested Lists ARE Appropriate:

Use nested lists **only** when you have true sub-items:

```
• Main Topic 1
	• Sub-point of Topic 1
	• Another sub-point of Topic 1
• Main Topic 2
	• Sub-point of Topic 2
```

This creates proper semantic nested structure: `<ul><li>Main Topic 1<ul><li>Sub-point</li></ul></li></ul>`

### Why This Matters:
- HTML doesn't care about visual spacing — only semantic structure
- Extra tabs create unnecessary nesting in HTML
- CSS controls visual indentation in the final output
- Incorrect nesting affects accessibility and document structure

---

## 3. Tables: Best Practices

### ✅ DO:
- Use Word's built-in **Table** feature (Insert → Table)
- Designate the first row as header row (Table Design → Header Row)
- Keep tables simple and data-oriented
- Use clear, concise column headers
- Ensure table has proper header row for accessibility

### ❌ DON'T:
- Merge cells unnecessarily (complicates responsive behavior)
- Use tables for layout purposes (use them only for tabular data)
- Leave header row unmarked
- Create overly complex nested tables

### Why This Matters:
- Proper table structure enables responsive mobile layouts
- Header rows become accessible labels on mobile devices
- Complex tables may not stack well on small screens

---

## 4. Text Formatting

### ✅ Supported Formatting:
- **Bold** (use `Ctrl+B` or Bold button)
- *Italic* (use `Ctrl+I` or Italic button)
- Underline (use `Ctrl+U` or Underline button)
- Regular paragraphs (Normal style)

### ❌ Avoid:
- Colored text (may not meet accessibility contrast requirements)
- Highlighting (won't translate to HTML)
- Custom fonts (generator uses configured web-safe fonts)
- Font size changes (use Heading styles instead)
- Strikethrough, superscript, subscript (not reliably converted)

---

## 5. Links

### ✅ DO:
- Use Word's **Insert Hyperlink** feature (`Ctrl+K`)
- Use descriptive link text (e.g., "Read our Privacy Policy")
- Ensure URLs are complete and valid

### ❌ DON'T:
- Just paste raw URLs without making them links
- Use generic link text like "Click here" or "Read more"

---

## 6. What NOT to Include

The following elements are **not supported** and will be omitted or cause warnings:

### ❌ NOT Supported:
- **Images and graphics** (privacy notices are text-only)
- **SmartArt graphics** (convert to simple lists or tables)
- **Charts and diagrams** (convert to tables or text descriptions)
- **Embedded objects** (Excel spreadsheets, PowerPoint slides, etc.)
- **Text boxes** (convert to regular paragraphs)
- **Shapes and drawing objects** (use text formatting instead)
- **Comments** (review and remove before conversion)
- **Track changes** (accept or reject all changes first)
- **Equations** (use plain text or convert to description)

### Why This Matters:
- The tool focuses on text-based legal content
- Unsupported elements will generate warnings or be skipped
- Clean documents produce clean, predictable HTML

---

## 7. Quick Checklist

Before converting your document, verify:

- [ ] All headings use proper Heading styles (not manual formatting)
- [ ] Lists are properly structured (no unnecessary nesting from Tab)
- [ ] Tables have designated header rows
- [ ] All links are properly formatted with descriptive text
- [ ] No unsupported elements (images, SmartArt, text boxes, etc.)
- [ ] Track changes have been accepted/rejected
- [ ] Comments have been removed
- [ ] Document uses only supported text formatting (bold, italic, underline)

---

## Common Questions

### Q: Can I use custom fonts?
**A:** No, the HTML generator uses pre-configured web-safe fonts for consistency and performance. Your font choices in Word will not transfer.

### Q: Why can't I just make text bigger and bold instead of using Heading styles?
**A:** Manual formatting only changes appearance, not semantic meaning. Screen readers and web browsers need proper heading tags (`<h1>`, `<h2>`, etc.) to understand document structure. This is critical for accessibility compliance.

### Q: I need extra spacing in my list items. How do I do this?
**A:** Don't use Tab for spacing in lists. Instead:
- Add spacing between paragraphs (Format → Paragraph → Spacing)
- Or, discuss with the web team to adjust CSS styling
- Visual spacing is controlled by CSS in the final HTML, not by Word formatting

### Q: What happens if I include unsupported elements?
**A:** The tool will generate warnings during conversion. Unsupported elements will be skipped or may cause unexpected output. Always review the conversion warnings.

### Q: Can I see how my document will look before publishing?
**A:** Yes! Use the `--preview` flag when running the converter to generate a complete HTML preview page that you can open in a browser.

---

## Need Help?

If you encounter issues or have questions about formatting your documents:

1. Review this guide thoroughly
2. Check the conversion warnings for specific issues
3. Contact the technical team with specific examples
4. Refer to the main project documentation: [README.md](./README.md)

---

**Last Updated:** 2026-02-10
**Tool Version:** 2.0.0
