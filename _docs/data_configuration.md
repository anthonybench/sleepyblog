# Data Configuration Guide

This guide explains how to add and use configuration data in SleepyBlog through the `app/_lib/data.yml` file.

## Overview

SleepyBlog uses a centralized configuration system that allows you to modify key application values without touching code. The configuration is stored in `app/_lib/data.yml` and automatically converted to TypeScript at build time.

## How It Works

1. **Configuration File**: `app/_lib/data.yml` contains all configurable values
2. **Build Script**: `app/_lib/utils/loadConfig.js` reads the YAML and generates TypeScript
3. **Generated File**: `app/_lib/utils/dataConfig.ts` provides type-safe access to values
4. **Usage**: Components import from `dataConfig.ts` to access configuration

## Adding New Configuration

### Step 1: Add to `data.yml`

Edit `app/_lib/data.yml` and add your new configuration:

```yaml
# Existing configuration
resume_url: "https://example.com/resume.pdf"
github_source_url: "https://github.com/user/repo"
default_theme: "dracula"

# Add your new configuration
new_feature_enabled: true
api_base_url: "https://api.example.com"
max_posts_per_page: 10
contact_email: "hello@example.com"
```

### Step 2: Update TypeScript Interface

Edit `app/_lib/utils/loadConfig.js` and update the `DataConfig` interface:

```javascript
export interface DataConfig {
  // Existing properties
  resume_url: string;
  github_source_url: string;
  default_theme: string;

  // Add your new properties
  new_feature_enabled: boolean;
  api_base_url: string;
  max_posts_per_page: number;
  contact_email: string;
}
```

### Step 3: Update Configuration Object

In the same file, update the `dataConfig` object generation:

```javascript
export const dataConfig: DataConfig = {
  // Existing properties
  resume_url: "${config.resume_url || 'https://example.com/resume.pdf'}",
  github_source_url: "${config.github_source_url || 'https://github.com/user/repo'}",
  default_theme: "${config.default_theme || 'dracula'}",

  // Add your new properties with defaults
  new_feature_enabled: ${config.new_feature_enabled || false},
  api_base_url: "${config.api_base_url || 'https://api.example.com'}",
  max_posts_per_page: ${config.max_posts_per_page || 10},
  contact_email: "${config.contact_email || 'hello@example.com'}"
};
```

### Step 4: Regenerate Configuration

Run the configuration generator:

```bash
npm run config:generate
```

This will update `app/_lib/utils/dataConfig.ts` with your new configuration.

## Using Configuration in Components

### Import the Configuration

```typescript
import { dataConfig } from "../_lib/utils/dataConfig";
```

### Use in Components

```typescript
export default function MyComponent() {
  return (
    <div>
      <h1>Contact Us</h1>
      <p>Email: {dataConfig.contact_email}</p>

      {dataConfig.new_feature_enabled && (
        <div>This new feature is enabled!</div>
      )}

      <p>Showing {dataConfig.max_posts_per_page} posts per page</p>
    </div>
  );
}
```

## Dynamic Data

The configuration system also supports dynamic data that's fetched at build time:

### GitHub Integration

The system automatically fetches the last commit date from your GitHub repository:

```yaml
github_source_url: "https://github.com/user/repo"
```

This generates:

- `dataConfig.last_updated`: The last commit date formatted as "MMM DD, YYYY"

### Adding Custom Dynamic Data

To add your own dynamic data, modify `app/_lib/utils/loadConfig.js`:

```javascript
// Add your async function
async function fetchCustomData() {
    try {
        const response = await fetch("https://api.example.com/data");
        const data = await response.json();
        return data.value;
    } catch (error) {
        console.error("Error fetching custom data:", error);
        return "fallback-value";
    }
}

// Update the main function
async function loadAndGenerateConfig() {
    const config = yaml.load(yamlContent);

    // Fetch dynamic data
    const lastUpdated = await fetchLastCommitDate(config.github_source_url);
    const customData = await fetchCustomData(); // Add this line

    // Update the template
    const tsContent = `/* eslint-disable @typescript-eslint/no-require-imports */
export interface DataConfig {
  // ... existing properties
  custom_data: string; // Add this
}

export const dataConfig: DataConfig = {
  // ... existing properties
  custom_data: "${customData}" // Add this
};`;
}
```

## Configuration Types

The system supports various data types:

### Strings

```yaml
site_name: "SleepyBlog"
api_key: "your-api-key"
```

### Numbers

```yaml
max_posts: 50
timeout_ms: 5000
```

### Booleans

```yaml
debug_mode: true
analytics_enabled: false
```

### Arrays

```yaml
social_links:
    - "https://twitter.com/user"
    - "https://github.com/user"
    - "https://linkedin.com/in/user"
```

### Objects

```yaml
database:
    host: "localhost"
    port: 5432
    name: "blog_db"
```

## Best Practices

### 1. Use Descriptive Names

```yaml
# Good
max_posts_per_page: 10
github_repository_url: "https://github.com/user/repo"

# Avoid
max: 10
url: "https://github.com/user/repo"
```

### 2. Provide Sensible Defaults

Always provide fallback values in the TypeScript generation:

```javascript
max_posts_per_page: ${config.max_posts_per_page || 10}
```

### 3. Group Related Configuration

```yaml
# Social Media Configuration
twitter_url: "https://twitter.com/user"
github_url: "https://github.com/user"
linkedin_url: "https://linkedin.com/in/user"

# API Configuration
api_base_url: "https://api.example.com"
api_timeout: 5000
api_retries: 3
```

### 4. Use Environment-Specific Values

You can create different configurations for different environments by checking environment variables in the load script.

## Troubleshooting

### Configuration Not Updating

1. Make sure you ran `npm run config:generate`
2. Check that your YAML syntax is valid
3. Restart your development server after regenerating

### TypeScript Errors

1. Ensure the interface matches your YAML structure
2. Check that all properties have default values
3. Verify data types match between YAML and TypeScript

### Build Failures

1. Check the console output from `loadConfig.js`
2. Ensure all required dependencies are installed (`js-yaml`, `https`)
3. Verify GitHub URL is accessible if using dynamic data

## Example: Adding a Feature Flag System

Here's a complete example of adding a feature flag system:

### 1. Update `data.yml`

```yaml
# Feature Flags
features:
    comments_enabled: true
    dark_mode_toggle: true
    analytics: false
    beta_features: false
```

### 2. Update `loadConfig.js`

```javascript
export interface DataConfig {
  // ... existing
  features: {
    comments_enabled: boolean;
    dark_mode_toggle: boolean;
    analytics: boolean;
    beta_features: boolean;
  };
}

export const dataConfig: DataConfig = {
  // ... existing
  features: {
    comments_enabled: ${config.features?.comments_enabled || false},
    dark_mode_toggle: ${config.features?.dark_mode_toggle || true},
    analytics: ${config.features?.analytics || false},
    beta_features: ${config.features?.beta_features || false}
  }
};
```

### 3. Use in Components

```typescript
import { dataConfig } from '../_lib/utils/dataConfig';

export default function PostPage() {
  return (
    <article>
      {/* Post content */}

      {dataConfig.features.comments_enabled && (
        <CommentsSection />
      )}

      {dataConfig.features.beta_features && (
        <BetaFeatureComponent />
      )}
    </article>
  );
}
```

This system provides a clean, type-safe way to manage application configuration while keeping it separate from your code.
