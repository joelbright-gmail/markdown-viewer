# Converting SVG to PNG Icons

The `icon.svg` file needs to be converted to PNG format in three sizes for the Chrome extension.

## Required Sizes

- `icon16.png` - 16x16 pixels
- `icon48.png` - 48x48 pixels  
- `icon128.png` - 128x128 pixels

## Conversion Methods

### Method 1: Using ImageMagick (Command Line)

```bash
# Install ImageMagick if not already installed
# macOS: brew install imagemagick
# Ubuntu: sudo apt-get install imagemagick

# Convert to required sizes (ImageMagick 7+)
magick icon.svg -resize 16x16 icon16.png
magick icon.svg -resize 48x48 icon48.png
magick icon.svg -resize 128x128 icon128.png

# Or for older ImageMagick versions:
convert icon.svg -resize 16x16 icon16.png
convert icon.svg -resize 48x48 icon48.png
convert icon.svg -resize 128x128 icon128.png
```

### Method 2: Using Inkscape (Command Line)

```bash
# Install Inkscape if not already installed
# macOS: brew install inkscape
# Ubuntu: sudo apt-get install inkscape

# Convert to required sizes
inkscape icon.svg -w 16 -h 16 -o icon16.png
inkscape icon.svg -w 48 -h 48 -o icon48.png
inkscape icon.svg -w 128 -h 128 -o icon128.png
```

### Method 3: Online Converter

1. Visit https://cloudconvert.com/svg-to-png
2. Upload `icon.svg`
3. Set width/height to desired size
4. Download and rename to appropriate filename
5. Repeat for all three sizes

### Method 4: Using GIMP (GUI)

1. Open `icon.svg` in GIMP
2. Set import resolution to 128x128 (or desired size)
3. Export as PNG
4. Repeat for each size

## Quick Script

Save this as `convert-icons.sh` and run it:

```bash
#!/bin/bash
# Requires ImageMagick

# Use 'magick' for ImageMagick 7+, or 'convert' for older versions
if command -v magick &> /dev/null; then
    magick icon.svg -resize 16x16 icon16.png
    magick icon.svg -resize 48x48 icon48.png
    magick icon.svg -resize 128x128 icon128.png
else
    convert icon.svg -resize 16x16 icon16.png
    convert icon.svg -resize 48x48 icon48.png
    convert icon.svg -resize 128x128 icon128.png
fi

echo "Icons converted successfully!"
```

Make it executable and run:
```bash
chmod +x convert-icons.sh
./convert-icons.sh