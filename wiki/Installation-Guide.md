# 📥 Installation Guide

Complete installation instructions for BizGrow v1.3.3 Beta across different environments and use cases.

---

## 🎯 Prerequisites

### **System Requirements**
- **Node.js**: Version 16.0.0 or higher
- **npm**: Version 7.0.0 or higher (or yarn/pnpm equivalent)
- **Git**: For cloning the repository
- **Modern Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### **Development Environment**
- **Code Editor**: VS Code recommended with extensions:
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - Prettier - Code formatter
  - ESLint

---

## 🚀 Quick Installation

### **Method 1: Clone from GitHub (Recommended)**

```bash
# 1. Clone the repository
git clone https://github.com/kenTHiC/biz-grow.git

# 2. Navigate to project directory
cd biz-grow

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev

# 5. Open in browser
# Navigate to http://localhost:5173
```

### **Method 2: Download ZIP**

1. **Download**: Go to [GitHub Repository](https://github.com/kenTHiC/biz-grow)
2. **Extract**: Click "Code" → "Download ZIP" and extract
3. **Install**: Open terminal in extracted folder and run:
   ```bash
   npm install
   npm run dev
   ```

---

## 🔧 Development Setup

### **1. Environment Configuration**

Create a `.env` file in the root directory (optional):

```env
# Development Configuration
VITE_APP_NAME=BizGrow
VITE_APP_VERSION=1.3.3
VITE_APP_ENVIRONMENT=development

# API Configuration (if using external APIs)
# VITE_API_BASE_URL=https://api.example.com
# VITE_API_KEY=your-api-key

# Analytics (optional)
# VITE_GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
```

### **2. Package Manager Options**

**Using npm (default):**
```bash
npm install
npm run dev
```

**Using Yarn:**
```bash
yarn install
yarn dev
```

**Using pnpm:**
```bash
pnpm install
pnpm dev
```

### **3. Available Scripts**

```bash
# Development
npm run dev          # Start development server
npm run dev:host     # Start with network access

# Building
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm run test         # Run test suite (if configured)
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues

# Utilities
npm run clean        # Clean build artifacts
```

---

## 🌐 Production Deployment

### **Build for Production**

```bash
# 1. Install dependencies
npm install

# 2. Build the application
npm run build

# 3. The built files will be in the 'dist' directory
```

### **Deployment Options**

#### **Netlify (Recommended)**
1. **Connect Repository**: Link your GitHub repository to Netlify
2. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Deploy**: Automatic deployment on every push to main branch

#### **Vercel**
1. **Install Vercel CLI**: `npm i -g vercel`
2. **Deploy**: Run `vercel` in project directory
3. **Configure**: Follow the prompts for deployment settings

#### **Static Hosting**
Upload the contents of the `dist` folder to any static hosting service:
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting
- Surge.sh

---

## 🐛 Troubleshooting Installation

### **Common Issues**

#### **Node.js Version Issues**
```bash
# Check Node.js version
node --version

# If version is too old, update Node.js
# Visit: https://nodejs.org/
```

#### **Permission Errors (macOS/Linux)**
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
```

#### **Port Already in Use**
```bash
# If port 5173 is busy, Vite will automatically use the next available port
# Or specify a different port:
npm run dev -- --port 3000
```

#### **Module Not Found Errors**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### **Build Failures**
```bash
# Check for TypeScript errors
npm run build 2>&1 | grep error

# Clear build cache
rm -rf dist
npm run build
```

### **Performance Issues**

#### **Slow Installation**
```bash
# Use faster package manager
npm install --prefer-offline
# or
yarn install --offline
```

#### **Large Bundle Size**
```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist
```

---

## 🔒 Security Considerations

### **Development Environment**
- Never commit `.env` files with sensitive data
- Use environment variables for API keys
- Keep dependencies updated: `npm audit fix`

### **Production Deployment**
- Enable HTTPS
- Configure proper CORS headers
- Set up Content Security Policy (CSP)
- Use environment-specific configurations

---

## 📱 Mobile Development

### **Testing on Mobile Devices**

```bash
# Start development server with network access
npm run dev -- --host

# Access from mobile device using your computer's IP
# Example: http://192.168.1.100:5173
```

### **PWA Features**
BizGrow includes Progressive Web App features:
- Offline functionality
- App-like experience
- Install prompts on mobile devices

---

## 🔄 Updating BizGrow

### **Update to Latest Version**

```bash
# 1. Backup your data (if you have local modifications)
git stash

# 2. Pull latest changes
git pull origin main

# 3. Update dependencies
npm install

# 4. Restart development server
npm run dev
```

### **Version Migration**
- Check [CHANGELOG.md](https://github.com/kenTHiC/biz-grow/blob/main/CHANGELOG.md) for breaking changes
- Review migration guides for major version updates
- Test thoroughly after updates

---

## 📞 Getting Help

If you encounter issues during installation:

1. **Check Documentation**: Review this guide and [Troubleshooting](Troubleshooting)
2. **Search Issues**: Look through [GitHub Issues](https://github.com/kenTHiC/biz-grow/issues)
3. **Create Issue**: If problem persists, create a new issue with:
   - Operating system and version
   - Node.js and npm versions
   - Complete error messages
   - Steps to reproduce

4. **Community Support**: Join our [Discord](https://discord.gg/s27WGufPgp) for real-time help

---

**Next Steps**: After installation, check out the [Quick Start Guide](Quick-Start) to begin using BizGrow!
