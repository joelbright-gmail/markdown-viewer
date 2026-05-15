# Theme Gallery

Visual guide to all available themes in md-viewer.

## Light Themes

### github-light
**Best for:** Professional documentation, formal documents  
**Colors:** Clean white background with GitHub's signature blue links  
**Feel:** Professional, familiar, clean

### solarized-light
**Best for:** Extended reading, technical writing  
**Colors:** Warm cream background (#fdf6e3) with carefully balanced accent colors  
**Feel:** Warm, comfortable, easy on eyes

---

## Dark Themes

### github-dark (Default)
**Best for:** General use, coding documentation  
**Colors:** Dark gray background (#0d1117) matching GitHub's dark mode  
**Feel:** Modern, professional, familiar

### solarized-dark
**Best for:** Night reading, extended sessions  
**Colors:** Deep blue-green background (#002b36) with warm accents  
**Feel:** Warm, balanced, reduces eye strain

### nord
**Best for:** Technical docs, minimalist aesthetic  
**Colors:** Cool arctic palette with frost blue accents  
**Feel:** Cool, clean, modern, Scandinavian-inspired

### dracula
**Best for:** Creative projects, presentations  
**Colors:** Purple (#bd93f9), pink (#ff79c6), cyan (#8be9fd)  
**Feel:** Vibrant, fun, energetic, playful

### monokai
**Best for:** Code-heavy documents, tutorials  
**Colors:** Warm dark background with rainbow accents  
**Feel:** Colorful, energetic, Sublime Text-inspired

---

## High Contrast

### high-contrast
**Best for:** Accessibility, presentations, vision impairment  
**Colors:** Pure black (#000000) background, pure white (#ffffff) text  
**Feel:** Maximum readability, bold, clear

---

## Quick Comparison

| Theme | Background | Best Use Case | Vibe |
|-------|-----------|---------------|------|
| **github-light** | White | Professional docs | Clean & Familiar |
| **github-dark** | Dark Gray | General use | Modern & Pro |
| **solarized-light** | Cream | Long reading | Warm & Comfortable |
| **solarized-dark** | Deep Blue | Night sessions | Balanced & Calm |
| **nord** | Cool Gray | Technical docs | Arctic & Minimal |
| **dracula** | Purple-Gray | Creative work | Vibrant & Fun |
| **monokai** | Warm Dark | Code tutorials | Colorful & Bold |
| **high-contrast** | Pure Black | Accessibility | Maximum Clarity |

---

## Usage Examples

```bash
# Professional document
./md-viewer.sh -theme github-light business-proposal.md

# Late night coding docs
./md-viewer.sh -theme solarized-dark api-reference.md

# Fun presentation
./md-viewer.sh -theme dracula project-showcase.md

# Accessibility-focused
./md-viewer.sh -theme high-contrast important-notice.md

# Technical documentation
./md-viewer.sh -theme nord architecture-guide.md

# Tutorial with lots of code
./md-viewer.sh -theme monokai python-tutorial.md
```

---

## Customization Tips

Each theme uses CSS variables for easy customization. For example, in `dracula.css`:

```css
:root {
  --bg-primary: #282a36;
  --text-primary: #f8f8f2;
  --accent-purple: #bd93f9;
  --accent-pink: #ff79c6;
  /* ... more variables */
}
```

To customize:
1. Copy a theme: `cp assets/dracula.css assets/my-theme.css`
2. Edit the CSS variables
3. Add to `AVAILABLE_THEMES` in `md-viewer.sh`
4. Use it: `./md-viewer.sh -theme my-theme document.md`

---

## Theme Recommendations by Document Type

**README files:** `github-light` or `github-dark`  
**API Documentation:** `nord` or `github-dark`  
**Tutorials:** `monokai` or `dracula`  
**Meeting Notes:** `solarized-light` or `solarized-dark`  
**Presentations:** `high-contrast` or `dracula`  
**Long Articles:** `solarized-light` or `solarized-dark`  
**Code Reviews:** `monokai` or `github-dark`  
**Accessibility:** `high-contrast`