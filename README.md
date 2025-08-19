# 📊 BizGrow - Business Analytics Dashboard

<div align="center">

![BizGrow Logo](https://img.shields.io/badge/BizGrow-Analytics%20Dashboard-3498DB?style=for-the-badge&logo=trending-up&logoColor=white)

[![Version](https://img.shields.io/badge/Version-1.3.3%20Beta-2E86AB?style=for-the-badge)](https://github.com/kenthic/biz-grow/releases/tag/v1.3.3)
[![Tests](https://img.shields.io/badge/Tests-Passing-22c55e?style=for-the-badge&logo=check-circle)](src/utils/testSuite.js)
[![License](https://img.shields.io/badge/License-MIT-1B4F72?style=for-the-badge)](LICENSE)

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.4.5-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3.3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

**A world-class business analytics dashboard with advanced data management, multi-format import/export, and enterprise-grade visualizations.**

[🚀 Live Demo](https://bizgow-app.netlify.app) • [📚 Documentation](https://github.com/kenTHiC/biz-grow/wiki) • [📖 Marketing Site](docs/) • [🎬 Video Demo](https://www.youtube.com/embed/1FjwAr5wmGg) • [💬 Discord](https://discord.gg/s27WGufPgp)

![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2FkenTHiC%2Fbiz-grow%2Frefs%2Fheads%2Fmain%2Fpackage.json&query=%24.version&prefix=v&logo=refinedgithub&logoColor=%23ffffff&label=release&labelColor=%23545A61&color=%23BEF9C6)
![GitHub top language](https://img.shields.io/github/languages/top/kenthic/biz-grow?logo=javascript&color=%23BEF9C6)
[![Netlify Status](https://api.netlify.com/api/v1/badges/274957a5-5004-4d0e-bde5-ec47ba9a6777/deploy-status)](https://app.netlify.com/projects/bizgow-app/deploys)
![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2FkenTHiC%2Fbiz-grow%2Frefs%2Fheads%2Fmain%2Fpackage.json&query=%24.state&logoColor=%23ffffff&label=state&labelColor=%23545A61&color=%23BEF9C6)

</div>

---

## Table of Contents

- [🌟 What's New in v1.3.3](#-whats-new-in-v133)
- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [📚 Documentation](#-documentation)
- [🧪 Testing](#-testing)
- [🤝 Contributing](#-contributing)
- [📞 Support & Community](#-support--community)

---

## 🌟 What's New in v1.3.3

> **Major Update**: Multi-selection functionality, professional UI modals, and critical bug fixes!

**Key Highlights:**
- ✅ **Multi-Selection System** - Bulk operations with checkboxes and "Select All" functionality
- 🎨 **Professional UI Modals** - Custom confirmation dialogs replacing browser alerts
- 🧪 **Enhanced Testing Suite** - 25+ comprehensive tests with visual test runner
- 🪲 **Critical Bug Fixes** - Resolved duplicate ID issues and selection state problems

**📋 [View Complete Release Notes](RELEASE.md)** | **📜 [Version History](CHANGELOG.md)**

---

## ✨ Features

### 📊 **Advanced Analytics & Insights**
- **8 Data Summary Cards** - Total revenue, expenses, profit, customers with growth indicators
- **Trend Sparklines** - 6-month trend visualization for all key metrics
- **Interactive Pie Charts** - Expense categories and revenue source breakdowns
- **Performance Scoring** - Business health score with industry benchmarks
- **Advanced Calculations** - Profit margins, CLV, CAC, churn rates, burn rate
- **Date Range Analytics** - Flexible filtering with preset options
- **Forecasting** - Revenue, expense, and customer growth projections

### 🗃️ **Enterprise Data Management**
- **Multi-Format Import** - JSON, CSV, Excel with intelligent field mapping
- **Multi-Format Export** - JSON, CSV, Excel with metadata and summaries
- **Data Validation** - Comprehensive validation with error reporting
- **Import Preview** - Review data before importing with merge options
- **Auto-Backup System** - Automatic backups on every data change
- **Manual Backups** - Create restore points before major operations
- **Template Downloads** - Pre-formatted templates for easy data entry

### 👥 **Customer Intelligence**
- **Complete CRM** - Full customer lifecycle management
- **Customer Analytics** - Value distribution, acquisition tracking, status management
- **Lifetime Value (CLV)** - Automatic CLV calculation and tracking
- **Customer Segmentation** - Active, potential, inactive customer analysis
- **Acquisition Tracking** - Customer acquisition cost (CAC) monitoring
- **Contact Management** - Email, phone, company details with search

### 💰 **Financial Intelligence**
- **Revenue Analytics** - Multi-source revenue tracking with categorization
- **Expense Management** - Vendor tracking, receipt management, category analysis
- **Cash Flow Analysis** - Monthly cash flow tracking and projections
- **Profit Analysis** - Real-time profit calculations with margin tracking
- **Burn Rate Monitoring** - Business runway calculations
- **Transaction History** - Detailed financial records with full audit trail

### 🎨 **World-Class UI/UX**
- **Professional Design** - Modern, clean interface with brand consistency
- **Responsive Excellence** - Perfect experience on all devices
- **Smart Empty States** - Helpful guidance when no data exists
- **Interactive Elements** - Hover effects, tooltips, and smooth transitions
- **Loading States** - Professional loading indicators throughout
- **Error Recovery** - Comprehensive error handling with user guidance



## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18.0.0 or higher recommended)
- **npm** or **yarn** package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kenthic/biz-grow.git
   cd biz-grow
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser and start using BizGrow**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist/` directory, ready for deployment.

## 📚 Documentation

For comprehensive documentation, guides, and tutorials, visit our [📚 GitHub Wiki](https://github.com/kenTHiC/biz-grow/wiki).

### 📖 **Detailed Guides Available**

- **[📥 Installation Guide](https://github.com/kenTHiC/biz-grow/wiki/Installation-Guide)** - Complete setup instructions
- **[⚡ Quick Start](https://github.com/kenTHiC/biz-grow/wiki/Quick-Start)** - Get running in 5 minutes
- **[✅ Multi-Selection System](https://github.com/kenTHiC/biz-grow/wiki/Multi-Selection-System)** - New v1.3.3 feature guide
- **[🧪 Testing Guide](https://github.com/kenTHiC/biz-grow/wiki/Testing-Guide)** - Comprehensive testing documentation
- **[🔧 API Reference](https://github.com/kenTHiC/biz-grow/wiki/API-Reference)** - Technical documentation
- **[🐛 Troubleshooting](https://github.com/kenTHiC/biz-grow/wiki/Troubleshooting)** - Common issues and solutions

## 🧪 Testing

### **Enhanced Testing Suite v1.3.3**

BizGrow includes a comprehensive testing framework with 25+ automated tests:

#### **Visual Testing Interface**
1. **Dashboard Access** - Click "Test Suite" button on Dashboard
2. **Test Selection** - Choose from All Tests, Quick Test, Multi-Selection, etc.
3. **Run Tests** - Execute tests with real-time results
4. **Keyboard Shortcut** - Use `Ctrl+Shift+T` to toggle test runner

#### **Console Testing**
```javascript
// Run in browser console (F12)
window.BizGrowTestSuite.runAllTests()     // Full test suite
window.BizGrowTestSuite.quickTest()       // Essential tests
window.BizGrowTestSuite.testMultiSelection() // v1.3.3 features
window.BizGrowTestSuite.debugState()      // Debug info
```

#### **Test Categories**
- **Multi-Selection System** - Bulk operations and checkbox functionality
- **Professional UI Modals** - Custom confirmation dialogs
- **ID Management** - Data integrity and uniqueness
- **Performance Testing** - Memory usage and large dataset handling
- **Version Synchronization** - Automatic version management

**📚 For detailed testing documentation, see [Testing Guide](https://github.com/kenTHiC/biz-grow/wiki/Testing-Guide)**

## 🔧 Configuration & Customization

### Environment Variables

Create a `.env` file in the root directory:

```env
# Application Configuration
VITE_APP_NAME=BizGrow Dashboard
VITE_APP_VERSION=1.3.3

# Development Configuration
NODE_ENV=development

# Future API Configuration
# VITE_API_BASE_URL=http://localhost:3001/api
```

### Brand Customization

#### **BizGrow Brand Colors (v1.3.3):**
```css
:root {
  --primary-color: #3498DB;      /* Medium Blue */
  --primary-dark: #1B4F72;      /* Navy Blue */
  --primary-light: #5DADE2;     /* Light Blue */
  --secondary-color: #2E86AB;   /* Dark Blue */
}
```

#### **Tailwind CSS Theme:**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'bizgrow-blue': '#3498DB',
        'bizgrow-navy': '#1B4F72',
        'bizgrow-light': '#5DADE2',
        'bizgrow-dark': '#2E86AB',
      },
    },
  },
}
```

## 🚀 Deployment

### **Production Build**
```bash
npm run build
npm run preview  # Test production build locally
```

### **Deployment Options**
- **Netlify** - Drag and drop the `dist/` folder
- **Vercel** - Connect your GitHub repository
- **GitHub Pages** - Use the `docs/` folder for marketing site
- **Traditional Hosting** - Upload `dist/` contents to web server

### **Official Website**
The `docs/` folder contains a complete marketing website (separate from documentation):
- Professional landing page hosted on GitHub Pages
- Feature showcase and screenshots
- Live demo links and promotional content
- Contact information and getting started guide

**Note**: For comprehensive documentation, use the [GitHub Wiki](https://github.com/kenTHiC/biz-grow/wiki).

## 🤝 Contributing

We welcome contributions! Here's how to get involved:

### **Ways to Contribute**
- 🐛 **Report Bugs** - Open issues for any problems you find
- ✨ **Request Features** - Suggest new functionality
- 📝 **Improve Documentation** - Help make docs clearer
- 🧪 **Add Tests** - Expand test coverage
- 💻 **Submit Code** - Fix bugs or add features

### **Development Setup**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Run the test suite to ensure everything works
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to your branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### **Code Standards**
- Follow existing code style and patterns
- Add comprehensive tests for new features
- Update documentation for any changes
- Ensure responsive design for all UI changes

### **Pull Request Guidelines**
- Provide clear description of changes
- Include screenshots for UI changes
- Reference related issues
- Ensure all tests pass

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

### **Core Technologies**
- **React Team** - For the incredible framework that powers BizGrow
- **Tailwind CSS** - For the utility-first CSS framework
- **Recharts** - For beautiful and responsive chart components
- **Framer Motion** - For smooth animations and transitions
- **Lucide** - For the comprehensive icon library
- **SheetJS** - For Excel file processing capabilities

### **Community**
- **Early Testers** - Thank you for your valuable feedback
- **Contributors** - Every contribution makes BizGrow better
- **Open Source Community** - For the amazing tools and libraries

## 📞 Support & Community

### **Get Help**
- 📧 **Email Support**: bizgrowapp@gmail.com
- 💬 **Discord Community**: [Join our server](https://discord.gg/s27WGufPgp)
- 🐛 **Bug Reports**: [GitHub Issues](../../issues)
- ✨ **Feature Requests**: [GitHub Discussions](../../discussions)

### **Documentation**
- 📚 **Complete Documentation**: [GitHub Wiki](https://github.com/kenTHiC/biz-grow/wiki)
- 🎬 **Video Tutorials**: [YouTube Channel](https://www.youtube.com/embed/1FjwAr5wmGg)
- 🔧 **API Reference**: [Developer Documentation](https://github.com/kenTHiC/biz-grow/wiki/API-Reference)
- 📖 **Official Website**: [Project Website](docs/)

### **Stay Updated**
- ⭐ **Star this repo** to stay updated with new releases
- 👀 **Watch releases** to get notified of new versions
- 🐦 **Follow updates** on our social channels

---

<div align="center">

### **🎉 BizGrow v1.3.3 - World-Class Business Analytics**

**Built with ❤️ by**

[![GitHub](https://img.shields.io/badge/GitHub-kenTHiC-181717?style=flat&logo=github)](https://github.com/kenTHiC)

[![GitHub stars](https://img.shields.io/github/stars/kenthic/biz-grow?style=social)](../../stargazers)
[![GitHub forks](https://img.shields.io/github/forks/kenthic/biz-grow?style=social)](../../network/members)
[![GitHub watchers](https://img.shields.io/github/watchers/kenthic/biz-grow?style=social)](../../watchers)

**[🚀 Try Live Demo](https://bizgow-app.netlify.app) • [📚 Read Documentation](https://github.com/kenTHiC/biz-grow/wiki)**

[![Discord](https://img.shields.io/badge/Discord-Community-5865F2?style=for-the-badge&logo=discord)](https://discord.gg/s27WGufPgp)

</div>
