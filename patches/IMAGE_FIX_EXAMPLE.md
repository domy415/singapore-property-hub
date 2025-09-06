# Image Fix Examples

## Component Usage Examples

### BEFORE (Problematic)
```jsx
import Image from 'next/image'

// Problematic: Using '&' instead of '?' for query parameters
<Image 
  src={`/images/singapore-cbd-skyline-01.jpg&t=${timestamp}`} 
  width={3840} 
  height={2160} 
  alt="Singapore skyline" 
/>

// Also problematic: URL encoding issues
<Image 
  src="/images/singapore-cbd-skyline-01.jpg%26t%3D1757126399501"
  width={1920}
  height={1080}
  alt="Singapore property"
/>
```

### AFTER (Quick Fix)
```jsx
import Image from 'next/image'

// Fixed: Using '?' for query parameters
<Image 
  src={`/images/singapore-cbd-skyline-01.jpg?t=${timestamp}`} 
  width={3840} 
  height={2160} 
  alt="Singapore skyline" 
/>

// Fixed: Proper URL encoding
<Image 
  src="/images/singapore-cbd-skyline-01.jpg?t=1757126399501"
  width={1920}
  height={1080}
  alt="Singapore property"
/>
```

### BETTER (Recommended)
```jsx
import Image from 'next/image'

// Best practice: Use versioned filenames instead of query parameters
// Rename file: singapore-cbd-skyline-01.jpg → singapore-cbd-skyline-01.v2.jpg
<Image 
  src="/images/singapore-cbd-skyline-01.v2.jpg" 
  width={3840} 
  height={2160} 
  alt="Singapore skyline" 
/>

// Or use a proper image management system
const imageUrl = getOptimizedImageUrl('singapore-cbd-skyline-01', { 
  width: 3840, 
  height: 2160, 
  quality: 95 
});

<Image 
  src={imageUrl}
  width={3840} 
  height={2160} 
  alt="Singapore skyline" 
/>
```

## Database/JSON Fix Examples

### BEFORE
```json
{
  "featuredImage": "/images/singapore-cbd-skyline-01.jpg&t=1757056665735"
}
```

### AFTER  
```json
{
  "featuredImage": "/images/singapore-cbd-skyline-01.jpg?t=1757056665735"
}
```

### BETTER
```json
{
  "featuredImage": "https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=1200&h=630&fit=crop&q=80"
}
```

## Common Patterns Fixed

1. **Query parameter separator**: `&t=` → `?t=`
2. **URL encoding issues**: `%26t%3D` → `?t=`
3. **Multiple parameters**: Ensure proper `?` and `&` usage
4. **Cache busting**: Use versioned filenames instead of timestamps when possible

## Testing Commands

```bash
# Check for remaining issues
git grep -n "&t=" || echo "No &t= patterns found"

# Test image URLs locally
curl -I "http://localhost:3000/images/singapore-cbd-skyline-01.jpg?t=123456"

# Test Next.js image optimization
curl -I "http://localhost:3000/_next/image?url=%2Fimages%2Fsingapore-cbd-skyline-01.jpg&w=1200&q=80"
```