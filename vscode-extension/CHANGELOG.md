# Changelog - Linuv VSCode Extension

All notable changes to the Linuv Markdown Viewer VSCode extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Improved markdown parser (consider using marked.js)
- Table support
- Footnote support
- Custom CSS injection
- Export to PDF functionality

## [1.0.0] - 2026-05-16

### Added
- Initial release of Linuv Markdown Viewer for VSCode
- Live markdown preview with real-time updates
- 8 beautiful themes:
  - github-dark (default)
  - github-light
  - solarized-dark
  - solarized-light
  - nord
  - dracula
  - monokai
  - high-contrast
- Mermaid diagram support (all diagram types)
- Syntax highlighting for 190+ languages
- Theme switching via Command Palette
- Configuration settings:
  - Default theme selection
  - Auto-preview option
  - Offline mode support
- Side-by-side editing and preview
- Commands:
  - Preview Markdown
  - Change Theme
  - Export PDF (placeholder)

### Technical
- Basic markdown parser for lightweight operation
- Webview-based preview rendering
- CDN-based resource loading (Mermaid.js, Highlight.js)
- Optional offline mode support
- Automatic theme-aware Mermaid diagrams

### Documentation
- Complete README with installation and usage
- Development guide for contributors
- Configuration documentation

---

## Version History

- **1.0.0** (2026-05-16) - Initial release

---

## How to Update

When making changes:

1. Update this CHANGELOG.md
2. Bump version in package.json
3. Test thoroughly
4. Commit and tag: `git tag v1.0.1`
5. Publish: `vsce publish`

---

**Note**: For the CLI tool changelog, see the main project [README.md](../README.md)