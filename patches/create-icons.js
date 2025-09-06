// Simple script to create placeholder icons for PWA manifest
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '..', 'public', 'images', 'icons');

// Ensure directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Create a simple SVG that we can convert to PNG
const createSVGIcon = (size) => {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#1e40af" rx="16"/>
  <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" 
        fill="white" font-family="Arial, sans-serif" font-size="${size * 0.3}" font-weight="bold">SPH</text>
</svg>`;
};

// For each size, create a simple icon file (we'll use SVG converted to base64 data URL)
sizes.forEach(size => {
  const svg = createSVGIcon(size);
  const base64 = Buffer.from(svg).toString('base64');
  const dataUrl = `data:image/svg+xml;base64,${base64}`;
  
  // Create a simple HTML file that can generate the PNG
  const htmlContent = `<!DOCTYPE html>
<html>
<head><title>Icon Generator</title></head>
<body>
  <canvas id="canvas" width="${size}" height="${size}"></canvas>
  <script>
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = function() {
      ctx.drawImage(img, 0, 0);
      // Download as PNG
      const link = document.createElement('a');
      link.download = 'icon-${size}x${size}.png';
      link.href = canvas.toDataURL();
      link.click();
    };
    img.src = '${dataUrl}';
  </script>
</body>
</html>`;
  
  // For now, let's just create placeholder text files that indicate the needed icons
  const placeholder = `# Placeholder for icon-${size}x${size}.png
# To generate: Use online SVG to PNG converter with this SVG:
${svg}
# Or use imagemagick: convert icon.svg -resize ${size}x${size} icon-${size}x${size}.png
`;
  
  fs.writeFileSync(path.join(iconsDir, `icon-${size}x${size}.placeholder.txt`), placeholder);
  console.log(`Created placeholder for ${size}x${size} icon`);
});

console.log('Icon placeholders created. Please generate actual PNG files using the provided SVG content.');