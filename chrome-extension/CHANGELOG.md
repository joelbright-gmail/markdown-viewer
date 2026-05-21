# Changelog - Linuv Chrome Extension

All notable changes to the Linuv Markdown Viewer Chrome extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Firefox extension port
- Edge extension port
- Improved markdown parser (consider using marked.js)
- Table support
- Footnote support
- Custom CSS injection
- Keyboard shortcuts

## [1.0.0] - 2026-05-16

### Added
- Initial release of Linuv Markdown Viewer for Chrome
- Automatic markdown file rendering in browser
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
- Theme switching via extension popup
- Settings popup with:
  - Theme selection dropdown
  - Offline mode toggle
- Toolbar overlay with:
  - Change Theme button
  - Print/PDF button
- Print to PDF functionality
- Configuration storage using chrome.storage.sync
- Automatic page reload on theme change

### Technical
- Manifest V3 compliance
- Content script for .md file detection and rendering
- Background service worker
- Basic markdown parser for lightweight operation
- CDN-based resource loading (Mermaid.js, Highlight.js)
- Optional offline mode support
- Automatic theme-aware Mermaid diagrams
- No data collection or tracking

### Security & Privacy
- Only runs on local .md and .markdown files
- No external network requests (except CDN for resources)
- No user data collection
- No analytics or tracking
- Requires "Allow access to file URLs" permission

### Documentation
- Complete README with installation and usage
- Icon conversion guide
- Configuration documentation

---

## Version History

- **1.0.0** (2026-05-16) - Initial release

---

## How to Update

When making changes:

1. Update this CHANGELOG.md
2. Bump version in manifest.json
3. Test thoroughly in Chrome
4. Create new zip file
5. Upload to Chrome Web Store
6. Submit for review

---

## Publishing Notes

- Chrome Web Store review typically takes 1-3 business days
- Users receive automatic updates within 24 hours of approval
- Ensure all changes comply with Chrome Web Store policies

---

**Note**: For the CLI tool changelog, see the main project [README.md](../README.md)