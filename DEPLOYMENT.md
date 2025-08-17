# 🚀 Deployment Guide

This guide covers various deployment options for the BizGrow Dashboard.

## 📋 Prerequisites

- Node.js 16+ installed
- npm or yarn package manager
- Git repository set up

## 🌐 Deployment Options

### 1. Vercel (Recommended)

Vercel provides the easiest deployment experience for React applications.

#### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/biz-grow)

#### Manual Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

#### Configuration

The project includes a `vercel.json` file with optimal settings:
- Automatic SPA routing
- Build optimization
- Static file serving

### 2. Netlify

Netlify offers excellent static site hosting with continuous deployment.

#### Quick Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/biz-grow)

#### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `dist` folder to [Netlify Drop](https://app.netlify.com/drop)
   - Or use Netlify CLI:
     ```bash
     npm install -g netlify-cli
     netlify deploy --prod --dir=dist
     ```

#### Configuration

Create a `netlify.toml` file:
```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. GitHub Pages

Deploy directly from your GitHub repository.

#### Setup

1. **Enable GitHub Pages**
   - Go to repository Settings
   - Scroll to Pages section
   - Select "GitHub Actions" as source

2. **Automatic Deployment**
   The included `.github/workflows/ci.yml` will automatically deploy to GitHub Pages on push to main branch.

#### Manual Deployment

```bash
npm run build
npx gh-pages -d dist
```

### 4. Firebase Hosting

Google Firebase provides fast and secure hosting.

#### Setup

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login and Initialize**
   ```bash
   firebase login
   firebase init hosting
   ```

3. **Configure firebase.json**
   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

4. **Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

### 5. AWS S3 + CloudFront

For enterprise-grade hosting with AWS.

#### Setup

1. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://your-bucket-name
   ```

2. **Configure for Static Website**
   ```bash
   aws s3 website s3://your-bucket-name --index-document index.html --error-document index.html
   ```

3. **Build and Upload**
   ```bash
   npm run build
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

4. **Set up CloudFront** (optional but recommended)
   - Create CloudFront distribution
   - Point to S3 bucket
   - Configure custom error pages

### 6. Docker Deployment

For containerized deployment.

#### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf

```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
```

#### Build and Run

```bash
docker build -t biz-grow-dashboard .
docker run -p 80:80 biz-grow-dashboard
```

## 🔧 Environment Configuration

### Environment Variables

For different environments, create appropriate `.env` files:

#### `.env.production`
```env
VITE_APP_NAME=BizGrow Dashboard
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production
```

#### `.env.staging`
```env
VITE_APP_NAME=BizGrow Dashboard (Staging)
VITE_APP_VERSION=1.0.0-staging
VITE_APP_ENV=staging
```

### Build Optimization

#### Vite Configuration

Update `vite.config.js` for production:

```javascript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          ui: ['framer-motion', 'lucide-react']
        }
      }
    }
  }
})
```

## 📊 Performance Optimization

### Bundle Analysis

```bash
npm run build
npx vite-bundle-analyzer dist
```

### Lighthouse Optimization

- Enable service worker for caching
- Optimize images and assets
- Implement code splitting
- Use lazy loading for routes

## 🔒 Security Considerations

### Content Security Policy

Add to your hosting platform:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;
```

### HTTPS

Always deploy with HTTPS enabled. Most platforms provide this automatically.

## 📈 Monitoring

### Analytics

Add Google Analytics or similar:

```javascript
// In index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

### Error Tracking

Consider integrating:
- Sentry for error tracking
- LogRocket for session replay
- Hotjar for user behavior

## 🚀 Continuous Deployment

The project includes GitHub Actions for automatic deployment. Customize the workflow in `.github/workflows/ci.yml` for your needs.

### Branch Strategy

- `main` - Production deployments
- `develop` - Staging deployments
- `feature/*` - Feature branches

## 📞 Support

For deployment issues:
- Check the [Issues](../../issues) page
- Review platform-specific documentation
- Contact support through the repository
