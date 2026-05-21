// Content script that runs on .md files
(function () {
    'use strict';

    // Check if this is a markdown file being viewed as plain text
    const isMarkdownFile = window.location.pathname.match(/\.(md|markdown)$/i);

    if (!isMarkdownFile) {
        return;
    }

    // Get the raw markdown content
    const preElement = document.querySelector('pre');
    if (!preElement) {
        return;
    }

    const markdownContent = preElement.textContent;

    // Get saved theme from storage
    chrome.storage.sync.get(['theme', 'offlineMode'], function (result) {
        const theme = result.theme || 'github-dark';
        const offlineMode = result.offlineMode || false;

        // Replace the page content with our viewer
        renderMarkdown(markdownContent, theme, offlineMode);
    });

    function renderMarkdown(markdown, theme, offlineMode) {
        // Create the HTML structure
        const html = convertMarkdownToHTML(markdown);

        // Determine Mermaid theme
        const mermaidTheme = theme.includes('light') ? 'default' : 'dark';

        // Resource URLs
        let mermaidUrl, hljsUrl, hljsCssUrl;

        if (offlineMode) {
            mermaidUrl = chrome.runtime.getURL('vendor/mermaid.min.js');
            hljsUrl = chrome.runtime.getURL('vendor/highlight.min.js');
            hljsCssUrl = chrome.runtime.getURL(`vendor/hljs-styles/${theme}.min.css`);
        } else {
            mermaidUrl = 'https://cdn.jsdelivr.net/npm/mermaid@10.9.0/dist/mermaid.esm.min.mjs';
            hljsUrl = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js';
            hljsCssUrl = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/${theme}.min.css`;
        }

        const cssUrl = chrome.runtime.getURL(`assets/${theme}.css`);

        // Replace document content
        document.documentElement.innerHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${document.title}</title>
    <link rel="stylesheet" href="${cssUrl}">
    <link rel="stylesheet" href="${hljsCssUrl}">
    <style>
        .linuv-toolbar {
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            padding: 10px;
            border-radius: 5px;
            z-index: 1000;
            display: flex;
            gap: 10px;
        }
        .linuv-toolbar button {
            background: #58a6ff;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
        }
        .linuv-toolbar button:hover {
            background: #79c0ff;
        }
    </style>
</head>
<body>
    <div class="linuv-toolbar">
        <button id="changeTheme">Change Theme</button>
        <button id="printPDF">Print/PDF</button>
    </div>
    
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
    
    <script>
        document.getElementById('changeTheme').addEventListener('click', function() {
            chrome.runtime.sendMessage({action: 'openPopup'});
        });
        
        document.getElementById('printPDF').addEventListener('click', function() {
            window.print();
        });
    </script>
</body>
</html>`;
    }

    function convertMarkdownToHTML(markdown) {
        // Basic markdown to HTML conversion
        let html = markdown;

        // Headers
        html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
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

        // Images
        html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1">');

        // Code blocks (including mermaid)
        html = html.replace(/```(\w+)?\n([\s\S]*?)```/gim, function (match, lang, code) {
            if (lang === 'mermaid') {
                return `<pre class="mermaid">${code}</pre>`;
            }
            return `<pre><code class="language-${lang || 'plaintext'}">${escapeHtml(code)}</code></pre>`;
        });

        // Inline code
        html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');

        // Blockquotes
        html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

        // Unordered lists
        html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
        html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

        // Horizontal rules
        html = html.replace(/^---$/gim, '<hr>');
        html = html.replace(/^\*\*\*$/gim, '<hr>');

        // Line breaks
        html = html.replace(/\n\n/g, '</p><p>');
        html = html.replace(/\n/g, '<br>');

        // Wrap in paragraphs
        html = '<p>' + html + '</p>';

        // Clean up empty paragraphs
        html = html.replace(/<p><\/p>/g, '');
        html = html.replace(/<p>(<h[1-6]>)/g, '$1');
        html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
        html = html.replace(/<p>(<pre>)/g, '$1');
        html = html.replace(/(<\/pre>)<\/p>/g, '$1');
        html = html.replace(/<p>(<ul>)/g, '$1');
        html = html.replace(/(<\/ul>)<\/p>/g, '$1');
        html = html.replace(/<p>(<blockquote>)/g, '$1');
        html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');
        html = html.replace(/<p>(<hr>)<\/p>/g, '$1');

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
})();

// Made with Bob
