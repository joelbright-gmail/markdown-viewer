# GitHub Setup Guide

Your local Git repository is ready! Follow these steps to push it to GitHub.

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Fill in the details:
   - **Repository name**: `markdown-viewer` (or your preferred name)
   - **Description**: "Beautiful Markdown to HTML/PDF converter with 8 themes, Mermaid diagrams, and syntax highlighting"
   - **Visibility**: Public (recommended) or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
3. Click "Create repository"

## Step 2: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
cd ~/Repos/linuv

# Add the remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/markdown-viewer.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Verify

Visit your repository at:
```
https://github.com/YOUR_USERNAME/markdown-viewer
```

You should see all your files, and the README.md will be displayed on the main page!

## Alternative: Using GitHub CLI

If you have GitHub CLI installed:

```bash
cd ~/Repos/linuv

# Create repo and push in one command
gh repo create markdown-viewer --public --source=. --remote=origin --push

# Or for private repo
gh repo create markdown-viewer --private --source=. --remote=origin --push
```

## What's Included

Your repository contains:
- ✅ Main script (`md-viewer.sh`)
- ✅ Setup script (`setup-offline.sh`)
- ✅ 8 theme CSS files
- ✅ Comprehensive README
- ✅ Feature guide (FEATURES.md)
- ✅ Theme documentation (THEMES.md)
- ✅ .gitignore (excludes output and vendor files)

## Recommended: Add Topics

After pushing, add topics to your GitHub repository for better discoverability:

1. Go to your repository on GitHub
2. Click the gear icon next to "About"
3. Add topics:
   - `markdown`
   - `pdf-export`
   - `mermaid`
   - `syntax-highlighting`
   - `html-converter`
   - `pandoc`
   - `themes`
   - `documentation`

## Optional: Add License

Consider adding a license file. Popular choices:
- MIT License (most permissive)
- Apache 2.0
- GPL v3

You can add it through GitHub's web interface:
1. Click "Add file" → "Create new file"
2. Name it `LICENSE`
3. Click "Choose a license template"
4. Select your preferred license

## Optional: Enable GitHub Pages

To showcase your project:
1. Go to Settings → Pages
2. Source: Deploy from a branch
3. Branch: main, folder: / (root)
4. Save

Your README will be visible at:
```
https://YOUR_USERNAME.github.io/markdown-viewer/
```

## Share Your Project

Once published, share it:
- Tweet about it with #markdown #opensource
- Post on Reddit (r/programming, r/opensource)
- Share on LinkedIn
- Add to awesome-markdown lists

---

**Your repository is ready to push!** 🚀