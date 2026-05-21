const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

let currentPanel = undefined;
let currentTheme = 'github-dark';

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('Linuv Markdown Viewer is now active');

    // Get theme from configuration
    const config = vscode.workspace.getConfiguration('linuv');
    currentTheme = config.get('theme', 'github-dark');

    // Register preview command
    let previewCommand = vscode.commands.registerCommand('linuv.previewMarkdown', function () {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active markdown file');
            return;
        }

        const document = editor.document;
        if (document.languageId !== 'markdown') {
            vscode.window.showErrorMessage('Active file is not a markdown file');
            return;
        }

        showPreview(context, document);
    });

    // Register theme change command
    let themeCommand = vscode.commands.registerCommand('linuv.changeTheme', async function () {
        const themes = [
            'github-dark',
            'github-light',
            'solarized-dark',
            'solarized-light',
            'nord',
            'dracula',
            'monokai',
            'high-contrast'
        ];

        const selected = await vscode.window.showQuickPick(themes, {
            placeHolder: 'Select a theme'
        });

        if (selected) {
            currentTheme = selected;
            const config = vscode.workspace.getConfiguration('linuv');
            await config.update('theme', selected, vscode.ConfigurationTarget.Global);

            // Refresh preview if open
            if (currentPanel) {
                const editor = vscode.window.activeTextEditor;
                if (editor && editor.document.languageId === 'markdown') {
                    showPreview(context, editor.document);
                }
            }

            vscode.window.showInformationMessage(`Theme changed to ${selected}`);
        }
    });

    // Register PDF export command
    let pdfCommand = vscode.commands.registerCommand('linuv.exportPDF', async function () {
        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.document.languageId !== 'markdown') {
            vscode.window.showErrorMessage('No active markdown file');
            return;
        }

        vscode.window.showInformationMessage('PDF export requires the md-viewer.sh script. Please use the command line tool for PDF export.');
    });

    // Auto-preview if enabled
    if (config.get('autoPreview', false)) {
        vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor && editor.document.languageId === 'markdown') {
                showPreview(context, editor.document);
            }
        });
    }

    context.subscriptions.push(previewCommand, themeCommand, pdfCommand);
}

function showPreview(context, document) {
    const columnToShowIn = vscode.ViewColumn.Beside;

    if (currentPanel) {
        currentPanel.reveal(columnToShowIn);
    } else {
        currentPanel = vscode.window.createWebviewPanel(
            'linuvPreview',
            `Preview: ${path.basename(document.fileName)}`,
            columnToShowIn,
            {
                enableScripts: true,
                localResourceRoots: [
                    vscode.Uri.file(path.join(context.extensionPath, 'assets')),
                    vscode.Uri.file(path.dirname(document.fileName))
                ]
            }
        );

        currentPanel.onDidDispose(
            () => {
                currentPanel = undefined;
            },
            null,
            context.subscriptions
        );
    }

    currentPanel.webview.html = getWebviewContent(context, document, currentPanel.webview);

    // Update preview on document change
    const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
        if (e.document === document && currentPanel) {
            currentPanel.webview.html = getWebviewContent(context, document, currentPanel.webview);
        }
    });

    currentPanel.onDidDispose(() => {
        changeDocumentSubscription.dispose();
    });
}

function getWebviewContent(context, document, webview) {
    const config = vscode.workspace.getConfiguration('linuv');
    const offlineMode = config.get('offlineMode', false);

    // Get markdown content
    const markdown = document.getText();

    // Convert markdown to HTML (basic conversion)
    const html = convertMarkdownToHTML(markdown);

    // Get CSS file URI
    const cssPath = path.join(context.extensionPath, 'assets', `${currentTheme}.css`);
    const cssUri = webview.asWebviewUri(vscode.Uri.file(cssPath));

    // Determine Mermaid theme
    const mermaidTheme = currentTheme.includes('light') ? 'default' : 'dark';

    // Resource URLs
    let mermaidUrl, hljsUrl, hljsCssUrl;

    if (offlineMode) {
        const vendorPath = path.join(context.extensionPath, 'vendor');
        mermaidUrl = webview.asWebviewUri(vscode.Uri.file(path.join(vendorPath, 'mermaid.min.js')));
        hljsUrl = webview.asWebviewUri(vscode.Uri.file(path.join(vendorPath, 'highlight.min.js')));
        hljsCssUrl = webview.asWebviewUri(vscode.Uri.file(path.join(vendorPath, 'hljs-styles', `${currentTheme}.min.css`)));
    } else {
        mermaidUrl = 'https://cdn.jsdelivr.net/npm/mermaid@10.9.0/dist/mermaid.esm.min.mjs';
        hljsUrl = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js';
        hljsCssUrl = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/${currentTheme}.min.css`;
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline' https:; script-src ${webview.cspSource} 'unsafe-inline' https:; img-src ${webview.cspSource} https: data:;">
    <title>Markdown Preview</title>
    <link rel="stylesheet" href="${cssUri}">
    <link rel="stylesheet" href="${hljsCssUrl}">
</head>
<body>
    ${html}
    
    <script src="${hljsUrl}"></script>
    <script>hljs.highlightAll();</script>
    
    ${offlineMode ? `
    <script src="${mermaidUrl}"></script>
    <script>
        mermaid.initialize({
            startOnLoad: true,
            theme: '${mermaidTheme}',
            securityLevel: 'loose',
            flowchart: { useMaxWidth: true, htmlLabels: true }
        });
    </script>
    ` : `
    <script type="module">
        import mermaid from '${mermaidUrl}';
        mermaid.initialize({
            startOnLoad: true,
            theme: '${mermaidTheme}',
            securityLevel: 'loose',
            flowchart: { useMaxWidth: true, htmlLabels: true }
        });
    </script>
    `}
</body>
</html>`;
}

function convertMarkdownToHTML(markdown) {
    // Basic markdown to HTML conversion
    // This is a simplified version - in production, use a proper markdown parser like marked.js

    let html = markdown;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/gim, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
    html = html.replace(/_(.*?)_/gim, '<em>$1</em>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>');

    // Code blocks (including mermaid)
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/gim, function (match, lang, code) {
        if (lang === 'mermaid') {
            return `<pre class="mermaid">${code}</pre>`;
        }
        return `<pre><code class="language-${lang || 'plaintext'}">${escapeHtml(code)}</code></pre>`;
    });

    // Inline code
    html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');

    // Line breaks
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');

    // Wrap in paragraphs
    html = '<p>' + html + '</p>';

    return html;
}

function escapeHtml(text) {
    const map = {
        '&': '&',
        '<': '<',
        '>': '>',
        '"': '"',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function deactivate() { }

module.exports = {
    activate,
    deactivate
};

// Made with Bob
