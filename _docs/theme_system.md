# Theme System Guide

This guide explains how to add and customize themes in SleepyBlog.

## Overview

SleepyBlog uses a CSS custom properties (variables) based theme system that allows for easy theme switching and customization. The system supports both light and dark themes with full customization capabilities.

## Theme Architecture

### Core Components

1. **Theme Definitions**: `app/_lib/types/theme.ts` - TypeScript interfaces and theme registry
2. **CSS Variables**: `app/_lib/styles/themes/*.css` - Theme-specific CSS custom properties
3. **Main Stylesheet**: `app/_lib/styles/main.css` - Uses CSS variables for theming
4. **Theme Context**: `app/_lib/utils/themeContext.tsx` - React context for theme management
5. **Theme Selector**: `app/_components/ThemeSelector.tsx` - UI component for theme switching

### How Themes Work

1. Each theme defines a set of CSS custom properties (--variable-name)
2. The main stylesheet uses these variables for colors, fonts, and other properties
3. Theme switching updates the `data-theme` attribute on the `<html>` element
4. CSS automatically applies the new theme's variables

## Adding a New Theme

### Step 1: Create Theme CSS File

Create a new CSS file in `app/_lib/styles/themes/`:

```css
/* app/_lib/styles/themes/sunset.css */

[data-theme="sunset"] {
    /* Background Colors */
    --bg-primary: #1a1625;
    --bg-secondary: #2d1b3d;
    --bg-tertiary: #3d2a4a;

    /* Text Colors */
    --text-primary: #f4e6d7;
    --text-secondary: #d4af9a;
    --text-muted: #b8956a;
    --text-tertiary: #b8956a;

    /* Accent Colors */
    --accent-primary: #ff6b35;
    --accent-secondary: #f7931e;
    --accent-tertiary: #c73e1d;

    /* Layout */
    --content-border: #ff6b35;
    --border: #3d2a4a;
    --shadow: rgba(255, 107, 53, 0.3);

    /* Post Type Chip Colors */
    --chip-land-development: #74c0fc;
    --chip-software-development: #ff6b35;
    --chip-build-things: #f7931e;
    --chip-rant: #c73e1d;
}
```

### Step 2: Import Theme CSS

Add the import to `app/_lib/styles/main.css`:

```css
/* Import all theme files */
@import "./themes/dracula.css";
@import "./themes/overcast.css";
@import "./themes/mist.css";
@import "./themes/sunset.css"; /* Add your new theme */
```

### Step 3: Register Theme in TypeScript

Update `app/_lib/types/theme.ts`:

```typescript
export const themes: Theme[] = [
    {
        display_name: "Dracula",
        alias: "dracula",
        type: "dark",
    },
    {
        display_name: "Overcast",
        alias: "overcast",
        type: "light",
    },
    {
        display_name: "Sunset",
        alias: "sunset",
        type: "dark",
    },
    {
        display_name: "Mist",
        alias: "mist",
        type: "light",
    },
];
```

### Step 4: Test Your Theme

1. Start the development server: `npm run dev`
2. Use the theme selector in the top-right corner
3. Select your new "Sunset" theme
4. Verify all UI elements look correct

## CSS Variable Reference

### Current Theme Structure (v2024)

The theme system has been simplified to include only actively used CSS custom properties. Previous versions included additional variables that were not used in the codebase.

### Required Variables

Every theme must define these CSS custom properties:

#### Background Colors

```css
--bg-primary: #color; /* Main background */
--bg-secondary: #color; /* Secondary background (cards, inputs) */
--bg-tertiary: #color; /* Tertiary background (hover states) */
```

#### Text Colors

```css
--text-primary: #color; /* Main text color */
--text-secondary: #color; /* Secondary text (captions, meta) */
--text-muted: #color; /* Muted text (subtle elements) */
--text-tertiary: #color; /* Tertiary text (disabled, placeholders) */
```

#### Accent Colors

```css
--accent-primary: #color; /* Primary accent (links, buttons) */
--accent-secondary: #color; /* Secondary accent (highlights) */
--accent-tertiary: #color; /* Tertiary accent (special elements) */
```

#### Layout

```css
--content-border: #color; /* Main content borders */
--border: #color; /* General borders */
--shadow: rgba(r, g, b, a); /* Box shadows */
```

#### Post Type Chip Colors

```css
--chip-land-development: #color; /* Land Development post chips */
--chip-software-development: #color; /* Software Development post chips */
--chip-build-things: #color; /* Build Things post chips */
--chip-rant: #color; /* Rant post chips */
```

## Theme Types

### Light Themes

Light themes should have:

- Light backgrounds (#f0f0f0 and lighter)
- Dark text (#333333 and darker)
- Good contrast ratios for accessibility
- `type: 'light'` in the theme definition

### Dark Themes

Dark themes should have:

- Dark backgrounds (#333333 and darker)
- Light text (#cccccc and lighter)
- Good contrast ratios for accessibility
- `type: 'dark'` in the theme definition

## Advanced Theme Features

### Theme-Aware Images

You can create theme-aware images using the image path structure:

```
public/
  light/
    logo.png
    icon.svg
  dark/
    logo.png
    icon.svg
```

Then use in components:

```typescript
import Image from 'next/image';
import { useTheme } from '../_lib/utils/themeContext';

export default function Logo() {
  const { currentTheme } = useTheme();
  const imagePath = `/public/${currentTheme.type}/logo.png`;

  return <Image src={imagePath} alt="Logo" width={100} height={50} />;
}
```

### Conditional Styling

You can apply theme-specific styles in components:

```typescript
import { useTheme } from '../_lib/utils/themeContext';

export default function MyComponent() {
  const { currentTheme } = useTheme();

  return (
    <div className={`my-component ${currentTheme.type === 'dark' ? 'dark-specific' : 'light-specific'}`}>
      Content
    </div>
  );
}
```

### CSS-in-JS Theme Values

Access theme variables in CSS-in-JS:

```typescript
const styles = {
    container: {
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
        border: "1px solid var(--border)",
        boxShadow: "0 4px 12px var(--shadow)",
    },
};
```

## Theme Best Practices

### 1. Maintain Contrast Ratios

Ensure your themes meet WCAG accessibility guidelines:

- Normal text: 4.5:1 contrast ratio minimum
- Large text: 3:1 contrast ratio minimum
- Interactive elements: 3:1 contrast ratio minimum

### 2. Test in Different Conditions

- Test on different screen types (LCD, OLED, etc.)
- Test in different lighting conditions
- Test with different browser zoom levels

### 3. Use Semantic Naming

```css
/* Good - semantic names */
--accent-primary: #ff6b35;
--text-secondary: #888888;

/* Avoid - color-based names */
--orange: #ff6b35;
--gray: #888888;
```

### 4. Provide Fallbacks

```css
/* Provide fallbacks for older browsers */
background-color: #282a36; /* Fallback */
background-color: var(--bg-primary);
```

### 5. Consider Color Psychology

- **Blue**: Trust, professionalism, calm
- **Green**: Growth, success, nature
- **Red**: Energy, urgency, passion
- **Purple**: Creativity, luxury, mystery
- **Orange**: Enthusiasm, creativity, warmth

## Customizing Existing Themes

### Method 1: Override Variables

Create a custom CSS file that overrides specific variables:

```css
/* custom-dracula.css */
[data-theme="dracula"] {
    --accent-primary: #50fa7b; /* Change accent color */
    --bg-primary: #1e1f29; /* Slightly different background */
    --chip-software-development: #50fa7b; /* Match new accent */
}
```

### Method 2: Create Theme Variants

```typescript
export const themes: Theme[] = [
    {
        display_name: "Dracula",
        alias: "dracula",
        type: "dark",
    },
    {
        display_name: "Dracula Pro",
        alias: "dracula-pro",
        type: "dark",
    },
];
```

## Default Theme Configuration

Set the default theme in `app/_lib/data.yml`:

```yaml
default_theme: "sunset" # Use your theme's alias
```

The system will automatically use this theme on first visit and fall back to it if the user's saved theme is no longer available.

## Troubleshooting

### Theme Not Appearing

1. Check that the CSS file is imported in `main.css`
2. Verify the theme is registered in `theme.ts`
3. Ensure the `data-theme` attribute matches the CSS selector
4. Clear browser cache and restart development server

### Colors Not Updating

1. Verify CSS variable names match exactly
2. Check that the CSS selector `[data-theme="your-theme"]` is correct
3. Ensure no CSS specificity issues are overriding your variables

### Theme Selector Not Working

1. Check that the theme is in the `themes` array
2. Verify the `alias` matches the CSS `data-theme` value
3. Check browser console for JavaScript errors

## Example: Creating a High Contrast Theme

Here's a complete example of creating an accessibility-focused high contrast theme:

### 1. Create CSS File

```css
/* app/_lib/styles/themes/high-contrast.css */
[data-theme="high-contrast"] {
    /* Background Colors */
    --bg-primary: #000000;
    --bg-secondary: #1a1a1a;
    --bg-tertiary: #2a2a2a;

    /* Text Colors */
    --text-primary: #ffffff;
    --text-secondary: #e0e0e0;
    --text-muted: #c0c0c0;
    --text-tertiary: #c0c0c0;

    /* Accent Colors */
    --accent-primary: #ffff00;
    --accent-secondary: #00ffff;
    --accent-tertiary: #ff00ff;

    /* Layout */
    --content-border: #ffff00;
    --border: #ffffff;
    --shadow: rgba(255, 255, 255, 0.3);

    /* Post Type Chip Colors */
    --chip-land-development: #00ffff;
    --chip-software-development: #ffff00;
    --chip-build-things: #ff00ff;
    --chip-rant: #ff0000;
}
```

### 2. Register Theme

```typescript
{
  display_name: 'High Contrast',
  alias: 'high-contrast',
  type: 'dark'
}
```

### 3. Import CSS

```css
@import "./themes/high-contrast.css";
```

This creates a theme optimized for users with visual impairments, featuring maximum contrast and bright accent colors for better visibility.

## Post Type Chip System

SleepyBlog includes a theme-aware post type chip system that automatically adapts colors based on the selected theme.

### How It Works

1. **CSS Variables**: Each theme defines four chip color variables
2. **CSS Classes**: Main stylesheet uses `color-mix()` to create consistent transparency levels
3. **Component Integration**: PostTypeChip component uses CSS classes instead of inline styles

### Chip Color Variables

Every theme must define these chip color variables:

```css
--chip-land-development: #color; /* Land Development posts */
--chip-software-development: #color; /* Software Development posts */
--chip-build-things: #color; /* Build Things posts */
--chip-rant: #color; /* Rant posts */
```

### CSS Implementation

The chip styles use CSS `color-mix()` for consistent transparency:

```css
.post-type-chip--land-development {
    background-color: color-mix(in srgb, var(--chip-land-development) 20%, transparent);
    color: var(--chip-land-development);
    border-color: color-mix(in srgb, var(--chip-land-development) 40%, transparent);
}
```

### Theme Considerations

When choosing chip colors for your theme:

1. **Contrast**: Ensure good contrast against theme backgrounds
2. **Harmony**: Colors should complement your theme's overall palette
3. **Distinction**: Each post type should be easily distinguishable
4. **Accessibility**: Consider colorblind users - use distinct hues

### Example Chip Color Sets

**Dark Theme (Dracula)**:

```css
--chip-land-development: #8be9fd; /* Cyan */
--chip-software-development: #bd93f9; /* Purple */
--chip-build-things: #ffb86c; /* Orange */
--chip-rant: #ff79c6; /* Pink */
```

**Light Theme (Mist)**:

```css
--chip-land-development: #4dabf7; /* Soft Blue */
--chip-software-development: #845ec2; /* Purple */
--chip-build-things: #ff9f43; /* Orange */
--chip-rant: #ff6b6b; /* Red */
```
