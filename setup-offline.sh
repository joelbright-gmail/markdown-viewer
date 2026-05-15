#!/bin/bash
# Setup script to download dependencies for offline use

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENDOR_DIR="${SCRIPT_DIR}/vendor"

echo "Setting up offline dependencies..."

# Create vendor directory
mkdir -p "$VENDOR_DIR"

# Download Mermaid.js (use the full minified version, not ESM)
echo "Downloading Mermaid.js..."
curl -L "https://cdn.jsdelivr.net/npm/mermaid@10.9.0/dist/mermaid.min.js" \
    -o "${VENDOR_DIR}/mermaid.min.js"

# Download Highlight.js core
echo "Downloading Highlight.js..."
curl -L "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js" \
    -o "${VENDOR_DIR}/highlight.min.js"

# Download Highlight.js themes
echo "Downloading Highlight.js themes..."
mkdir -p "${VENDOR_DIR}/hljs-styles"

THEMES=("github-dark" "github" "solarized-dark" "solarized-light" "nord" "dracula" "monokai" "a11y-dark")

for theme in "${THEMES[@]}"; do
    echo "  - $theme"
    curl -L "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/${theme}.min.css" \
        -o "${VENDOR_DIR}/hljs-styles/${theme}.min.css"
done

echo ""
echo "✓ Offline dependencies downloaded to: $VENDOR_DIR"
echo ""
echo "To use offline mode, set OFFLINE_MODE=true in md-viewer.sh"

# Made with Bob
