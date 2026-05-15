#!/bin/bash
# Markdown to HTML converter with multiple theme support
# Usage: ./md-viewer.sh [-theme THEME_NAME] <markdown-file>

# Default theme
THEME="github-dark"

# Default output format
OUTPUT_FORMAT="html"

# Offline mode (set to true to use local vendor files)
OFFLINE_MODE="${OFFLINE_MODE:-false}"

# Available themes
AVAILABLE_THEMES=(
    "github-dark"
    "github-light"
    "solarized-dark"
    "solarized-light"
    "high-contrast"
    "dracula"
    "nord"
    "monokai"
)

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -theme)
            THEME="$2"
            shift 2
            ;;
        -pdf)
            OUTPUT_FORMAT="pdf"
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [-theme THEME_NAME] [-pdf] <markdown-file>"
            echo ""
            echo "Options:"
            echo "  -theme THEME_NAME    Choose a theme (default: github-dark)"
            echo "  -pdf                 Export as PDF instead of HTML"
            echo "  -h, --help          Show this help message"
            echo ""
            echo "Available themes:"
            echo "  Light themes:"
            echo "    github-light      - GitHub's light theme"
            echo "    solarized-light   - Solarized light (warm, easy on eyes)"
            echo ""
            echo "  Dark themes:"
            echo "    github-dark       - GitHub's dark theme (default)"
            echo "    solarized-dark    - Solarized dark (warm, easy on eyes)"
            echo "    nord              - Nord (cool, arctic-inspired)"
            echo "    dracula           - Dracula (vibrant purple accents)"
            echo "    monokai           - Monokai (colorful, Sublime-inspired)"
            echo ""
            echo "  High contrast:"
            echo "    high-contrast     - Maximum readability"
            echo ""
            echo "Examples:"
            echo "  $0 README.md"
            echo "  $0 -theme dracula document.md"
            echo "  $0 -theme high-contrast notes.md"
            echo "  $0 -pdf report.md"
            echo "  $0 -theme nord -pdf presentation.md"
            exit 0
            ;;
        *)
            MARKDOWN_FILE="$1"
            shift
            ;;
    esac
done

# Check if pandoc is installed
if ! command -v pandoc &> /dev/null; then
    echo "Error: pandoc is not installed. Please install it first."
    echo "  Ubuntu/Debian: sudo apt-get install pandoc"
    echo "  macOS: brew install pandoc"
    exit 1
fi

# Check if file argument is provided
if [ -z "$MARKDOWN_FILE" ]; then
    echo "Error: No markdown file specified"
    echo "Usage: $0 [-theme THEME_NAME] <markdown-file>"
    echo "Run '$0 --help' to see available themes"
    exit 1
fi

# Check if file exists
if [ ! -f "$MARKDOWN_FILE" ]; then
    echo "Error: File '$MARKDOWN_FILE' not found"
    exit 1
fi

# Validate theme
THEME_VALID=false
for valid_theme in "${AVAILABLE_THEMES[@]}"; do
    if [[ "$THEME" == "$valid_theme" ]]; then
        THEME_VALID=true
        break
    fi
done

if [[ "$THEME_VALID" == false ]]; then
    echo "Error: Invalid theme '$THEME'"
    echo ""
    echo "Available themes:"
    for theme in "${AVAILABLE_THEMES[@]}"; do
        echo "  - $theme"
    done
    echo ""
    echo "Run '$0 --help' for more information"
    exit 1
fi

# Get the base filename without extension
BASENAME=$(basename "$MARKDOWN_FILE" .md)

# Get the directory where this script is located (follow symlinks)
SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do
    SCRIPT_DIR="$(cd -P "$(dirname "$SOURCE")" && pwd)"
    SOURCE="$(readlink "$SOURCE")"
    [[ $SOURCE != /* ]] && SOURCE="$SCRIPT_DIR/$SOURCE"
done
SCRIPT_DIR="$(cd -P "$(dirname "$SOURCE")" && pwd)"

# Output file in html or pdf directory based on format
if [ "$OUTPUT_FORMAT" = "pdf" ]; then
    OUTPUT_DIR="${SCRIPT_DIR}/pdf"
    mkdir -p "$OUTPUT_DIR"
    OUTPUT_FILE="${OUTPUT_DIR}/${BASENAME}_rendered.pdf"
    TEMP_HTML="${OUTPUT_DIR}/${BASENAME}_temp.html"
else
    OUTPUT_DIR="${SCRIPT_DIR}/html"
    mkdir -p "$OUTPUT_DIR"
    OUTPUT_FILE="${OUTPUT_DIR}/${BASENAME}_rendered.html"
fi

# CSS file path based on theme
CSS_PATH="${SCRIPT_DIR}/assets/${THEME}.css"

# Determine Mermaid theme based on selected CSS theme
case "$THEME" in
    *light*)
        MERMAID_THEME="default"
        ;;
    high-contrast)
        MERMAID_THEME="dark"
        ;;
    nord)
        MERMAID_THEME="dark"
        ;;
    dracula)
        MERMAID_THEME="dark"
        ;;
    monokai)
        MERMAID_THEME="dark"
        ;;
    *)
        MERMAID_THEME="dark"
        ;;
esac

# For PDF output, convert to HTML first
if [ "$OUTPUT_FORMAT" = "pdf" ]; then
    CONVERT_TARGET="$TEMP_HTML"
else
    CONVERT_TARGET="$OUTPUT_FILE"
fi

# Check if CSS file exists and convert
if [ -f "$CSS_PATH" ]; then
    echo "Converting $MARKDOWN_FILE to HTML with $THEME theme..."
    pandoc "$MARKDOWN_FILE" -s -c "$CSS_PATH" --metadata title="$BASENAME" -o "$CONVERT_TARGET"
else
    echo "Warning: CSS file not found at $CSS_PATH"
    echo "Converting $MARKDOWN_FILE to HTML with default styling..."
    pandoc "$MARKDOWN_FILE" -s --metadata title="$BASENAME" -o "$CONVERT_TARGET"
fi

# Add Mermaid.js, syntax highlighting, and fix internal links in the generated HTML
if [ -f "$CONVERT_TARGET" ]; then
    # Create a temporary file for processing
    TEMP_FILE="${CONVERT_TARGET}.tmp"
    
    # Use perl to properly handle Mermaid blocks and fix anchor links:
    # 1. Remove <code> tags inside <pre class="mermaid">
    # 2. Decode HTML entities (--> to -->, etc.)
    # 3. Fix internal links by removing leading numbers from hrefs
    perl -pe '
        if (/<pre class="mermaid">/) {
            $in_mermaid = 1;
        }
        if ($in_mermaid) {
            s/<code>//g;
            s/<\/code>//g;
            s/>/>/g;
            s/</</g;
            s/&/&/g;
            s/"/"/g;
        }
        if (/<\/pre>/) {
            $in_mermaid = 0;
        }
        # Fix internal anchor links: remove leading numbers and dots
        # e.g., href="#1-how-to-use" becomes href="#how-to-use"
        # e.g., href="#6.1-ui-unavailable" becomes href="#ui-unavailable"
        s/href="#\d+\.?\d*-/href="#/g;
    ' "$CONVERT_TARGET" > "$TEMP_FILE"
    
    # Determine resource URLs based on offline mode
    if [ "$OFFLINE_MODE" = "true" ]; then
        HLJS_CSS_URL="file://${SCRIPT_DIR}/vendor/hljs-styles/${THEME}.min.css"
        HLJS_JS_URL="file://${SCRIPT_DIR}/vendor/highlight.min.js"
        MERMAID_URL="file://${SCRIPT_DIR}/vendor/mermaid.min.js"
        USE_MERMAID_MODULE="false"
        
        # Check if offline files exist
        if [ ! -f "${SCRIPT_DIR}/vendor/mermaid.min.js" ]; then
            echo "Warning: Offline mode enabled but vendor files not found."
            echo "Run './setup-offline.sh' to download dependencies."
            echo "Falling back to CDN..."
            OFFLINE_MODE="false"
        fi
    fi
    
    if [ "$OFFLINE_MODE" = "false" ]; then
        HLJS_CSS_URL="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/${THEME}.min.css"
        HLJS_JS_URL="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"
        MERMAID_URL="https://cdn.jsdelivr.net/npm/mermaid@10.9.0/dist/mermaid.esm.min.mjs"
        USE_MERMAID_MODULE="true"
    fi
    
    # Insert Mermaid.js and Highlight.js before </head> with proper configuration
    if [ "$USE_MERMAID_MODULE" = "true" ]; then
        # Use ESM module import for CDN
        MERMAID_SCRIPT='<script type="module">\
  import mermaid from "'"$MERMAID_URL"'";\
  mermaid.initialize({\
    startOnLoad: true,\
    theme: "'"$MERMAID_THEME"'",\
    securityLevel: "loose",\
    flowchart: { useMaxWidth: true, htmlLabels: true }\
  });\
</script>'
    else
        # Use regular script tag for offline bundle
        MERMAID_SCRIPT='<script src="'"$MERMAID_URL"'"></script>\
<script>\
  mermaid.initialize({\
    startOnLoad: true,\
    theme: "'"$MERMAID_THEME"'",\
    securityLevel: "loose",\
    flowchart: { useMaxWidth: true, htmlLabels: true }\
  });\
</script>'
    fi
    
    sed '/<\/head>/i\
<!-- Syntax Highlighting with Highlight.js -->\
<link rel="stylesheet" href="'"$HLJS_CSS_URL"'">\
<script src="'"$HLJS_JS_URL"'"></script>\
<script>hljs.highlightAll();</script>\
\
<!-- Mermaid Diagrams -->\
'"$MERMAID_SCRIPT"'' "$TEMP_FILE" > "${TEMP_FILE}.2"
    
    mv "${TEMP_FILE}.2" "$CONVERT_TARGET"
    rm -f "$TEMP_FILE"
fi

# Convert to PDF if requested
if [ "$OUTPUT_FORMAT" = "pdf" ]; then
    echo "Converting HTML to PDF..."
    
    # Try different PDF conversion methods in order of preference
    if command -v wkhtmltopdf &> /dev/null; then
        # Method 1: wkhtmltopdf (best quality, supports JavaScript)
        wkhtmltopdf --enable-local-file-access "$TEMP_HTML" "$OUTPUT_FILE"
        if [ $? -eq 0 ]; then
            rm -f "$TEMP_HTML"
            echo "✓ PDF file created: $OUTPUT_FILE"
        else
            echo "Error: PDF conversion failed"
            exit 1
        fi
    elif [[ "$OSTYPE" == "darwin"* ]] && [ -x "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" ]; then
        # Method 2: Chrome headless on macOS (automatic, supports JavaScript)
        echo "Using Chrome headless for PDF generation..."
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
            --headless \
            --disable-gpu \
            --print-to-pdf="$OUTPUT_FILE" \
            --no-pdf-header-footer \
            "file://$TEMP_HTML" 2>/dev/null
        if [ $? -eq 0 ] && [ -f "$OUTPUT_FILE" ]; then
            rm -f "$TEMP_HTML"
            echo "✓ PDF file created: $OUTPUT_FILE"
        else
            echo "Error: Chrome PDF conversion failed"
            exit 1
        fi
    elif command -v chromium &> /dev/null || command -v chromium-browser &> /dev/null; then
        # Method 3: Chromium headless on Linux (automatic, supports JavaScript)
        echo "Using Chromium headless for PDF generation..."
        CHROME_BIN=$(command -v chromium || command -v chromium-browser)
        "$CHROME_BIN" \
            --headless \
            --disable-gpu \
            --print-to-pdf="$OUTPUT_FILE" \
            --no-pdf-header-footer \
            "file://$TEMP_HTML" 2>/dev/null
        if [ $? -eq 0 ] && [ -f "$OUTPUT_FILE" ]; then
            rm -f "$TEMP_HTML"
            echo "✓ PDF file created: $OUTPUT_FILE"
        else
            echo "Error: Chromium PDF conversion failed"
            exit 1
        fi
    elif command -v pandoc &> /dev/null && command -v pdflatex &> /dev/null; then
        # Method 4: Pandoc with LaTeX (good quality, no JavaScript)
        echo "Using Pandoc for PDF generation..."
        pandoc "$MARKDOWN_FILE" -o "$OUTPUT_FILE" --pdf-engine=pdflatex
        if [ $? -eq 0 ]; then
            echo "✓ PDF file created: $OUTPUT_FILE"
            echo "Note: Mermaid diagrams are not included in Pandoc PDF output"
        else
            echo "Error: Pandoc PDF conversion failed"
            exit 1
        fi
    else
        # Method 5: No automatic method available
        echo "Error: No PDF conversion tool found."
        echo ""
        echo "Install one of these options:"
        echo "  macOS: Chrome is installed but not found at standard location"
        echo "  Linux: sudo apt-get install chromium-browser"
        echo "  Any OS: Install wkhtmltopdf from https://wkhtmltopdf.org/"
        echo ""
        echo "HTML file available at: $TEMP_HTML"
        echo "You can manually convert it using your browser's Print > Save as PDF"
        exit 1
    fi
fi

# Check if conversion was successful
if [ $? -eq 0 ]; then
    echo "✓ HTML file created: $OUTPUT_FILE"
    echo "✓ Theme: $THEME"
    
    # Open in browser based on OS
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        xdg-open "$OUTPUT_FILE" 2>/dev/null &
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        open "$OUTPUT_FILE"
    else
        echo "Please open $OUTPUT_FILE in your browser"
    fi
else
    echo "Error: Pandoc conversion failed"
    exit 1
fi

# Made with Bob
