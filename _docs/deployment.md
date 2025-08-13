# Deployment Guide

This guide covers running SleepyBlog in development and deploying it to production environments.

## Development Setup

### Prerequisites

Ensure you have the following installed:

- **Node.js**: Version 18.0 or higher
- **npm**: Version 9.0 or higher (comes with Node.js)
- **Git**: For version control

### Initial Setup

1. **Clone the repository**:

    ```bash
    git clone <repository-url>
    cd sleepyblog
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Generate configuration**:

    ```bash
    npm run config:generate
    ```

4. **Start development server**:
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:3000`.

### Development Commands

| Command                   | Description                              |
| ------------------------- | ---------------------------------------- |
| `npm run dev`             | Start development server with hot reload |
| `npm run build`           | Build production-ready application       |
| `npm run start`           | Start production server (requires build) |
| `npm run lint`            | Run ESLint for code quality              |
| `npm run config:generate` | Regenerate configuration from `data.yml` |

### Development Workflow

#### 1. Configuration Changes

When updating `app/_lib/data.yml`:

```bash
# After editing data.yml
npm run config:generate
# Restart dev server if running
```

#### 2. Adding New Posts

```bash
# Create a new post with current date
./_tools/new_post.py

# Or create with specific date
./_tools/new_post.py --date 2025-02-15
```

#### 3. Code Formatting

```bash
# Format all code files
./_tools/format.sh
```

#### 4. Building and Testing

```bash
# Check for issues
npm run lint

# Build for production testing
npm run build

# Test production build locally
npm run start
```

### Environment Configuration

#### Development Environment Variables

Create a `.env.local` file for local development:

```bash
# .env.local
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development
 # for uploading images ot imgur and getting urls
IMGUR_CLIENT_ID=abc123
IMGUR_ACCESS_TOKEN=abc123
```

#### Configuration Files

- **`data.yml`**: Site configuration and metadata
- **`next.config.ts`**: Next.js configuration
- **`tsconfig.json`**: TypeScript configuration
- **`package.json`**: Dependencies and scripts

## Production Deployment

### Build Process

SleepyBlog uses Next.js static generation for optimal performance:

```bash
# Install dependencies
npm ci --only=production

# Generate configuration
npm run config:generate

# Build static site
npm run build

# Optional: Start production server
npm run start
```

### Deployment Platforms

#### Vercel (Recommended)

Vercel provides seamless Next.js deployment with zero configuration:

1. **Connect Repository**:
    - Sign up at [vercel.com](https://vercel.com)
    - Connect your Git repository
    - Import the project

2. **Configuration**:

    ```bash
    # vercel.json (optional)
    {
      "buildCommand": "npm run config:generate && npm run build",
      "outputDirectory": ".next",
      "framework": "nextjs"
    }
    ```

3. **Environment Variables**:
   Set in Vercel dashboard:
    - `NEXT_PUBLIC_SITE_URL`: Your production URL
    - Any custom environment variables

4. **Domain Setup**:
    - Add custom domain in Vercel dashboard
    - Configure DNS records as instructed
    - SSL certificates are automatic

#### Netlify

Deploy to Netlify with static site generation:

1. **Build Settings**:
    - Build command: `npm run config:generate && npm run build && npm run export`
    - Publish directory: `out`

2. **netlify.toml**:

    ```toml
    [build]
      command = "npm run config:generate && npm run build"
      publish = ".next"

    [build.environment]
      NODE_VERSION = "18"

    [[redirects]]
      from = "/*"
      to = "/index.html"
      status = 200
    ```

#### GitHub Pages

Deploy as a static site to GitHub Pages:

1. **Add export script to `package.json`**:

    ```json
    {
        "scripts": {
            "export": "next export"
        }
    }
    ```

2. **GitHub Actions Workflow** (`.github/workflows/deploy.yml`):

    ```yaml
    name: Deploy to GitHub Pages

    on:
        push:
            branches: [main]

    jobs:
        build-and-deploy:
            runs-on: ubuntu-latest
            steps:
                - uses: actions/checkout@v3

                - name: Setup Node.js
                  uses: actions/setup-node@v3
                  with:
                      node-version: "18"
                      cache: "npm"

                - name: Install dependencies
                  run: npm ci

                - name: Generate configuration
                  run: npm run config:generate

                - name: Build and export
                  run: |
                      npm run build
                      npm run export

                - name: Deploy to GitHub Pages
                  uses: peaceiris/actions-gh-pages@v3
                  with:
                      github_token: ${{ secrets.GITHUB_TOKEN }}
                      publish_dir: ./out
    ```

#### Docker Deployment

Create a containerized deployment:

1. **Dockerfile**:

    ```dockerfile
    # Build stage
    FROM node:18-alpine AS builder

    WORKDIR /app
    COPY package*.json ./
    RUN npm ci --only=production

    COPY . .
    RUN npm run config:generate
    RUN npm run build

    # Production stage
    FROM node:18-alpine AS runner

    WORKDIR /app
    ENV NODE_ENV production

    RUN addgroup --system --gid 1001 nodejs
    RUN adduser --system --uid 1001 nextjs

    COPY --from=builder /app/public ./public
    COPY --from=builder /app/.next/standalone ./
    COPY --from=builder /app/.next/static ./.next/static

    USER nextjs
    EXPOSE 3000
    ENV PORT 3000

    CMD ["node", "server.js"]
    ```

2. **Docker Compose** (`docker-compose.yml`):
    ```yaml
    version: "3.8"
    services:
        sleepyblog:
            build: .
            ports:
                - "3000:3000"
            environment:
                - NODE_ENV=production
                - NEXT_PUBLIC_SITE_URL=https://yourdomain.com
            restart: unless-stopped
    ```

#### Self-Hosted (VPS/Server)

Deploy to your own server:

1. **Server Setup**:

    ```bash
    # Install Node.js (Ubuntu/Debian)
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs

    # Install PM2 for process management
    npm install -g pm2
    ```

2. **Application Deployment**:

    ```bash
    # Clone and setup
    git clone <repository-url> /var/www/sleepyblog
    cd /var/www/sleepyblog
    npm ci --only=production
    npm run config:generate
    npm run build

    # Start with PM2
    pm2 start npm --name "sleepyblog" -- start
    pm2 save
    pm2 startup
    ```

3. **Nginx Configuration**:

    ```nginx
    server {
        listen 80;
        server_name yourdomain.com;

        location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```

### Performance Optimization

#### Build Optimization

1. **Next.js Configuration** (`next.config.ts`):

    ```typescript
    /** @type {import('next').NextConfig} */
    const nextConfig = {
        output: "standalone", // For Docker deployments
        images: {
            unoptimized: true, // For static exports
        },
        trailingSlash: true, // For static hosting

        // Performance optimizations
        experimental: {
            optimizeCss: true,
        },

        // Compression
        compress: true,

        // Headers for caching
        async headers() {
            return [
                {
                    source: "/(.*)",
                    headers: [
                        {
                            key: "Cache-Control",
                            value: "public, max-age=31536000, immutable",
                        },
                    ],
                },
            ];
        },
    };

    module.exports = nextConfig;
    ```

#### CDN Configuration

For optimal performance, configure a CDN:

1. **Cloudflare**:
    - Add your domain to Cloudflare
    - Enable caching for static assets
    - Configure page rules for optimal caching

2. **AWS CloudFront**:
    - Create distribution pointing to your origin
    - Configure caching behaviors
    - Set up SSL certificates

### Monitoring and Analytics

#### Performance Monitoring

1. **Vercel Analytics**:

    ```bash
    npm install @vercel/analytics
    ```

    Add to `app/layout.tsx`:

    ```typescript
    import { Analytics } from '@vercel/analytics/react';

    export default function RootLayout({ children }) {
      return (
        <html>
          <body>
            {children}
            <Analytics />
          </body>
        </html>
      );
    }
    ```

2. **Google Analytics**:
   Add tracking ID to your environment variables and implement in the layout.

#### Error Monitoring

1. **Sentry**:

    ```bash
    npm install @sentry/nextjs
    ```

2. **LogRocket** or similar for user session recording

### Security Considerations

#### Environment Variables

Never commit sensitive data to version control:

```bash
# .env.local (not committed)
DATABASE_URL=your-database-url
API_SECRET=your-api-secret
```

#### Content Security Policy

Add CSP headers in `next.config.ts`:

```typescript
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline';"
        }
      ]
    }
  ];
}
```

#### HTTPS

Always use HTTPS in production:

- Vercel/Netlify: Automatic SSL
- Self-hosted: Use Let's Encrypt with Certbot
- Cloudflare: Free SSL certificates

### Troubleshooting

#### Common Issues

1. **Build Failures**:

    ```bash
    # Clear Next.js cache
    rm -rf .next

    # Clear node modules and reinstall
    rm -rf node_modules package-lock.json
    npm install

    # Regenerate configuration
    npm run config:generate
    ```

2. **Configuration Issues**:

    ```bash
    # Check configuration generation
    npm run config:generate

    # Verify generated file
    cat app/_lib/utils/dataConfig.ts
    ```

3. **Memory Issues**:

    ```bash
    # Increase Node.js memory limit
    NODE_OPTIONS="--max-old-space-size=4096" npm run build
    ```

4. **Port Conflicts**:
    ```bash
    # Use different port
    PORT=3001 npm run dev
    ```

#### Debug Mode

Enable debug logging:

```bash
DEBUG=* npm run dev
```

#### Health Checks

Create a health check endpoint in `app/api/health/route.ts`:

```typescript
export async function GET() {
    return Response.json({ status: "healthy", timestamp: new Date().toISOString() });
}
```

### Backup and Maintenance

#### Regular Maintenance

1. **Dependencies**:

    ```bash
    # Check for updates
    npm outdated

    # Update dependencies
    npm update

    # Security audit
    npm audit
    npm audit fix
    ```

2. **Content Backup**:
    - Back up `_posts/` directory
    - Back up `app/_lib/data.yml`
    - Back up custom themes and assets

3. **Monitoring**:
    - Set up uptime monitoring
    - Monitor build times
    - Track performance metrics

#### Disaster Recovery

1. **Repository Backup**: Ensure code is backed up in Git
2. **Content Backup**: Regular backups of posts and configuration
3. **Deployment Rollback**: Keep previous builds for quick rollback

### Custom Domain Setup

#### DNS Configuration

1. **A Records**:

    ```
    @ -> 192.0.2.1 (your server IP)
    www -> 192.0.2.1
    ```

2. **CNAME Records** (for Vercel/Netlify):
    ```
    @ -> your-app.vercel.app
    www -> your-app.vercel.app
    ```

#### SSL Certificate

Most platforms provide automatic SSL:

- **Vercel**: Automatic Let's Encrypt
- **Netlify**: Automatic Let's Encrypt
- **Cloudflare**: Free SSL certificates
- **Self-hosted**: Use Certbot for Let's Encrypt

### Scaling Considerations

#### Traffic Growth

1. **CDN**: Implement CDN for global distribution
2. **Caching**: Aggressive caching for static content
3. **Image Optimization**: Use Next.js Image optimization
4. **Database**: If adding dynamic features, consider database scaling

#### Content Growth

1. **Build Times**: Monitor build performance as posts increase
2. **Search**: Consider search indexing for large post collections
3. **Pagination**: Implement pagination for post lists
4. **Archive**: Consider archiving old posts

This deployment guide provides comprehensive coverage for running SleepyBlog in both development and production environments, with multiple deployment options to suit different needs and technical requirements.
