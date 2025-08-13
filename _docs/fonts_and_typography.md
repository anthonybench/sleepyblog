# Fonts and Typography Guide

This guide explains how to add custom fonts and manage typography in SleepyBlog.

## Overview

SleepyBlog uses a flexible font system built on CSS custom properties and Next.js font optimization. The system supports multiple font families with automatic font loading, fallbacks, and theme integration.

## Font Architecture

### Core Components

1. **Font Configuration**: `app/_lib/fonts.ts` - Font definitions and Next.js font loading
2. **CSS Variables**: Font families exported as CSS custom properties
3. **Typography Styles**: `app/_lib/styles/main.css` - Typography rules using font variables
4. **Theme Integration**: Fonts can be theme-specific or global

### Current Font Setup

The default setup includes:

- **JetBrains Mono**: Monospace font for code, labels, and technical elements
- **System Fonts**: Fallback fonts for optimal performance

## Adding New Fonts

### Step 1: Install Font in `fonts.ts`

Edit `app/_lib/fonts.ts` to add your new font:

```typescript
import { JetBrains_Mono, Inter, Playfair_Display } from "next/font/google";

// Existing font
const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-jetbrains-mono",
});

// Add new fonts
const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
});

const playfairDisplay = Playfair_Display({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-playfair-display",
});

// Export font variables
export const fontVariables = [
    jetbrainsMono.variable,
    inter.variable, // Add new font variables
    playfairDisplay.variable,
].join(" ");
```

### Step 2: Add CSS Custom Properties

The font variables are automatically available as CSS custom properties:

- `--font-jetbrains-mono`
- `--font-inter`
- `--font-playfair-display`

### Step 3: Use in CSS

Update `app/_lib/styles/main.css` to use your new fonts:

```css
/* Define font families */
:root {
    --font-body: var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    --font-heading: var(--font-playfair-display), Georgia, serif;
    --font-mono: var(--font-jetbrains-mono), "Courier New", monospace;
}

/* Apply to elements */
body {
    font-family: var(--font-body);
}

h1,
h2,
h3,
h4,
h5,
h6 {
    font-family: var(--font-heading);
}

code,
pre,
.monospace {
    font-family: var(--font-mono);
}
```

### Step 4: Use in Components

You can also use fonts directly in components:

```typescript
import { fontVariables } from '../_lib/fonts';

export default function MyComponent() {
  return (
    <div className={`${fontVariables} my-component`}>
      <h1 style={{ fontFamily: 'var(--font-playfair-display)' }}>
        Elegant Heading
      </h1>
      <p style={{ fontFamily: 'var(--font-inter)' }}>
        Body text with Inter
      </p>
    </div>
  );
}
```

## Font Sources

### Google Fonts (Recommended)

Google Fonts are optimized by Next.js and provide excellent performance:

```typescript
import { Roboto, Open_Sans, Source_Code_Pro } from "next/font/google";

const roboto = Roboto({
    weight: ["300", "400", "500", "700"],
    subsets: ["latin"],
    display: "swap",
    variable: "--font-roboto",
});
```

### Local Fonts

For custom or premium fonts, use local font files:

```typescript
import localFont from "next/font/local";

const customFont = localFont({
    src: [
        {
            path: "../public/fonts/CustomFont-Regular.woff2",
            weight: "400",
            style: "normal",
        },
        {
            path: "../public/fonts/CustomFont-Bold.woff2",
            weight: "700",
            style: "normal",
        },
    ],
    variable: "--font-custom",
    display: "swap",
});
```

### Font Weights and Styles

Specify multiple weights and styles:

```typescript
const inter = Inter({
    weight: ["300", "400", "500", "600", "700"],
    style: ["normal", "italic"],
    subsets: ["latin", "latin-ext"],
    display: "swap",
    variable: "--font-inter",
});
```

## Typography System

### Font Scale

Define a consistent font scale using CSS custom properties:

```css
:root {
    /* Font Sizes */
    --font-size-xs: 0.75rem; /* 12px */
    --font-size-sm: 0.875rem; /* 14px */
    --font-size-base: 1rem; /* 16px */
    --font-size-lg: 1.125rem; /* 18px */
    --font-size-xl: 1.25rem; /* 20px */
    --font-size-2xl: 1.5rem; /* 24px */
    --font-size-3xl: 1.875rem; /* 30px */
    --font-size-4xl: 2.25rem; /* 36px */
    --font-size-5xl: 3rem; /* 48px */

    /* Line Heights */
    --line-height-tight: 1.25;
    --line-height-normal: 1.5;
    --line-height-relaxed: 1.75;

    /* Font Weights */
    --font-weight-light: 300;
    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;
}
```

### Typography Classes

Create utility classes for consistent typography:

```css
/* Typography Utilities */
.text-xs {
    font-size: var(--font-size-xs);
}
.text-sm {
    font-size: var(--font-size-sm);
}
.text-base {
    font-size: var(--font-size-base);
}
.text-lg {
    font-size: var(--font-size-lg);
}
.text-xl {
    font-size: var(--font-size-xl);
}
.text-2xl {
    font-size: var(--font-size-2xl);
}
.text-3xl {
    font-size: var(--font-size-3xl);
}
.text-4xl {
    font-size: var(--font-size-4xl);
}
.text-5xl {
    font-size: var(--font-size-5xl);
}

.font-light {
    font-weight: var(--font-weight-light);
}
.font-normal {
    font-weight: var(--font-weight-normal);
}
.font-medium {
    font-weight: var(--font-weight-medium);
}
.font-semibold {
    font-weight: var(--font-weight-semibold);
}
.font-bold {
    font-weight: var(--font-weight-bold);
}

.leading-tight {
    line-height: var(--line-height-tight);
}
.leading-normal {
    line-height: var(--line-height-normal);
}
.leading-relaxed {
    line-height: var(--line-height-relaxed);
}

.font-body {
    font-family: var(--font-body);
}
.font-heading {
    font-family: var(--font-heading);
}
.font-mono {
    font-family: var(--font-mono);
}
```

## Theme-Specific Fonts

You can define different fonts for different themes:

```css
/* Default fonts */
:root {
    --font-body: var(--font-inter), sans-serif;
    --font-heading: var(--font-playfair-display), serif;
}

/* Theme-specific fonts */
[data-theme="dracula"] {
    --font-body: var(--font-jetbrains-mono), monospace;
    --font-heading: var(--font-jetbrains-mono), monospace;
}

[data-theme="elegant"] {
    --font-body: var(--font-crimson-text), serif;
    --font-heading: var(--font-playfair-display), serif;
}
```

## Responsive Typography

Create responsive font sizes using CSS clamp():

```css
:root {
    --font-size-responsive-sm: clamp(0.875rem, 2vw, 1rem);
    --font-size-responsive-base: clamp(1rem, 2.5vw, 1.125rem);
    --font-size-responsive-lg: clamp(1.125rem, 3vw, 1.25rem);
    --font-size-responsive-xl: clamp(1.25rem, 4vw, 1.5rem);
    --font-size-responsive-2xl: clamp(1.5rem, 5vw, 2rem);
    --font-size-responsive-3xl: clamp(1.875rem, 6vw, 3rem);
}

h1 {
    font-size: var(--font-size-responsive-3xl);
}
h2 {
    font-size: var(--font-size-responsive-2xl);
}
h3 {
    font-size: var(--font-size-responsive-xl);
}
p {
    font-size: var(--font-size-responsive-base);
}
```

## Font Loading Optimization

### Preload Critical Fonts

Add font preloading to `app/layout.tsx`:

```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SleepyBlog',
  description: 'A personal blog',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/_next/static/media/inter-latin-400.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className={fontVariables}>
        {children}
      </body>
    </html>
  );
}
```

### Font Display Strategy

Use appropriate `display` values:

```typescript
const font = Inter({
    display: "swap", // Recommended: shows fallback then swaps
    // display: 'block', // Shows invisible text then swaps
    // display: 'auto',  // Browser decides
    variable: "--font-inter",
});
```

## Font Fallbacks

Always provide fallback fonts:

```css
:root {
    /* Good: Comprehensive fallbacks */
    --font-body:
        var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    --font-heading: var(--font-playfair-display), Georgia, "Times New Roman", serif;
    --font-mono: var(--font-jetbrains-mono), "SF Mono", Monaco, "Cascadia Code", monospace;

    /* Avoid: No fallbacks */
    --font-body: var(--font-inter);
}
```

## Typography Best Practices

### 1. Limit Font Families

Use 2-3 font families maximum:

- One for body text
- One for headings
- One for code/monospace

### 2. Consistent Vertical Rhythm

Use a consistent line-height scale:

```css
:root {
    --line-height-xs: 1.2; /* Tight headings */
    --line-height-sm: 1.4; /* Small text */
    --line-height-base: 1.6; /* Body text */
    --line-height-lg: 1.8; /* Relaxed reading */
}
```

### 3. Readable Font Sizes

Ensure minimum font sizes for readability:

- Body text: 16px minimum
- Small text: 14px minimum
- Labels: 12px minimum

### 4. Proper Font Weights

Use semantic font weights:

```css
.font-light {
    font-weight: 300;
} /* Subtle text */
.font-normal {
    font-weight: 400;
} /* Body text */
.font-medium {
    font-weight: 500;
} /* Emphasis */
.font-semibold {
    font-weight: 600;
} /* Subheadings */
.font-bold {
    font-weight: 700;
} /* Headings */
```

## Accessibility Considerations

### 1. Font Size

- Minimum 16px for body text
- Allow users to zoom up to 200% without horizontal scrolling

### 2. Contrast

- Ensure sufficient contrast between text and background
- Test with different font weights

### 3. Dyslexia-Friendly Fonts

Consider fonts that are easier to read for users with dyslexia:

- OpenDyslexic
- Arial
- Verdana
- Comic Sans MS

### 4. Line Length

Optimal line length is 45-75 characters:

```css
.readable-text {
    max-width: 65ch; /* Characters */
    line-height: 1.6;
}
```

## Debugging Font Issues

### 1. Check Font Loading

Use browser dev tools to verify fonts are loading:

1. Open Network tab
2. Filter by "Font"
3. Reload page
4. Verify fonts load successfully

### 2. Inspect CSS Variables

Check that CSS variables are defined:

```css
/* In browser console */
getComputedStyle(document.documentElement).getPropertyValue('--font-body')
```

### 3. Font Display Issues

If fonts appear briefly then change (FOIT/FOUT):

- Check `display: swap` is set
- Verify fallback fonts are similar in size
- Consider using `font-display: optional` for non-critical fonts

## Example: Adding a Custom Font Family

Here's a complete example of adding the Poppins font family:

### 1. Update `fonts.ts`

```typescript
import { JetBrains_Mono, Poppins } from "next/font/google";

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-jetbrains-mono",
});

const poppins = Poppins({
    weight: ["300", "400", "500", "600", "700"],
    subsets: ["latin"],
    display: "swap",
    variable: "--font-poppins",
});

export const fontVariables = [jetbrainsMono.variable, poppins.variable].join(" ");
```

### 2. Update CSS

```css
:root {
    --font-body: var(--font-poppins), -apple-system, sans-serif;
    --font-heading: var(--font-poppins), -apple-system, sans-serif;
    --font-mono: var(--font-jetbrains-mono), monospace;
}

body {
    font-family: var(--font-body);
    font-weight: 400;
}

h1,
h2,
h3,
h4,
h5,
h6 {
    font-family: var(--font-heading);
    font-weight: 600;
}
```

### 3. Test Implementation

1. Start development server: `npm run dev`
2. Inspect elements to verify font-family is applied
3. Check Network tab to confirm font files load
4. Test on different devices and browsers

This creates a clean, modern typography system using Poppins for both body text and headings, with JetBrains Mono for code elements.
