# VSCode Extension Development Guide

## Setup

### Install Dependencies

```bash
cd vscode-extension
npm install
```

**Note**: You may see deprecation warnings. These are from transitive dependencies and don't affect functionality. The extension uses `@vscode/vsce` (the latest version) for packaging.

### Update Dependencies (Optional)

To update to the latest versions:

```bash
npm update
npm audit fix
```

## Building

### Package the Extension

```bash
npm run package
# or
npx vsce package
```

This creates a `.vsix` file that can be installed in VSCode.

### Install Locally

1. Open VSCode
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Click "..." menu → "Install from VSIX..."
4. Select the generated `.vsix` file

## Testing

### Run in Development Mode

1. Open the `vscode-extension` folder in VSCode
2. Press F5 to launch Extension Development Host
3. Open a markdown file in the new window
4. Test the preview functionality

### Debug

- Set breakpoints in `extension.js`
- Use F5 to start debugging
- Check Debug Console for logs

## Project Structure

```
vscode-extension/
├── package.json          # Extension manifest
├── extension.js          # Main extension code
├── README.md            # User documentation
├── DEVELOPMENT.md       # This file
├── .vscodeignore        # Files to exclude from package
└── assets/              # Theme CSS files
    └── *.css
```

## Key Files

### package.json

Defines:
- Extension metadata (name, version, description)
- Commands (preview, change theme, export PDF)
- Configuration settings (theme, autoPreview, offlineMode)
- Activation events (when extension loads)
- Menu contributions (where commands appear)

### extension.js

Contains:
- `activate()` - Called when extension activates
- `showPreview()` - Creates webview panel with rendered markdown
- `getWebviewContent()` - Generates HTML for preview
- `convertMarkdownToHTML()` - Basic markdown parser
- Command handlers for preview, theme change, PDF export

## Adding Features

### Add a New Command

1. Add to `package.json` commands:
```json
{
  "command": "linuv.myCommand",
  "title": "Linuv: My Command"
}
```

2. Register in `extension.js`:
```javascript
let myCommand = vscode.commands.registerCommand('linuv.myCommand', function() {
    // Your code here
});
context.subscriptions.push(myCommand);
```

### Add a New Setting

1. Add to `package.json` configuration:
```json
"linuv.mySetting": {
  "type": "boolean",
  "default": false,
  "description": "My setting description"
}
```

2. Read in `extension.js`:
```javascript
const config = vscode.workspace.getConfiguration('linuv');
const mySetting = config.get('mySetting', false);
```

## Publishing

### Prerequisites

1. Create a publisher account at https://marketplace.visualstudio.com/
2. Get a Personal Access Token from Azure DevOps
3. Login with vsce:
```bash
npx vsce login <publisher-name>
```

### Publish

```bash
# Bump version
npm version patch  # or minor, or major

# Publish
npx vsce publish
```

### Update

```bash
# Make changes
# Bump version
npm version patch

# Publish update
npx vsce publish
```

## Known Issues

### Deprecation Warnings

The npm install shows deprecation warnings for transitive dependencies. These don't affect functionality:

- `vsce` → Using `@vscode/vsce` (latest)
- `glob@7.2.3` → Used by dependencies, not directly
- `inflight` → Used by dependencies, not directly

These will be resolved as dependencies update their own dependencies.

### Basic Markdown Parser

The extension uses a basic markdown parser for simplicity. For full Pandoc features, users should use the CLI tool.

To improve:
- Consider using `marked` or `markdown-it` library
- Add support for tables, footnotes, etc.

## Best Practices

1. **Keep it simple** - Extension should be lightweight
2. **Use webviews carefully** - They consume resources
3. **Handle errors gracefully** - Show user-friendly messages
4. **Test thoroughly** - Test on different file sizes and content
5. **Document changes** - Update README and CHANGELOG

## Resources

- [VSCode Extension API](https://code.visualstudio.com/api)
- [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)
- [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [Webview API](https://code.visualstudio.com/api/extension-guides/webview)

## Support

For issues or questions:
- Check [README.md](README.md) for user documentation
- See main project [EXTENSIONS.md](../EXTENSIONS.md)
- Open an issue on GitHub