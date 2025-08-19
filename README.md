# 📊 BizGrow - Business Analytics Dashboard

<div align="center">

![BizGrow Logo](https://img.shields.io/badge/BizGrow-Analytics%20Dashboard-3498DB?style=for-the-badge&logo=trending-up&logoColor=white)

[![Version](https://img.shields.io/badge/Version-1.3.3-2E86AB?style=for-the-badge)](https://github.com/kenthic/biz-grow/releases/tag/v1.3.3)
[![Tests](https://img.shields.io/badge/Tests-Passing-22c55e?style=for-the-badge&logo=check-circle)](src/utils/testSuite.js)
[![License](https://img.shields.io/badge/License-MIT-1B4F72?style=for-the-badge)](LICENSE)

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.4.5-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3.3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

**A world-class business analytics dashboard with advanced data management, multi-format import/export, and enterprise-grade visualizations.**

[🚀 Live Demo](https://bizgow-app.netlify.app) • [📖 Documentation](docs/) • [🎬 Video Demo](https://www.youtube.com/embed/1FjwAr5wmGg) • [💬 Discord](https://discord.gg/s27WGufPgp)

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
- [🎯 First Time Setup](#-first-time-setup)
- [📊 Sample Data Templates](#-sample-data-templates)
- [🔧 Configuration & Customization](#-configuration--customization)
- [🧪 Testing & Quality Assurance](#-testing--quality-assurance)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)
- [🙏 Acknowledgments](#-acknowledgments)

---

## 🌟 What's New in v1.3.3

> **Major Update**: Multi-selection functionality, professional UI modals, and critical bug fixes!

- ✅ **Multi-Selection System** - Bulk operations with checkboxes and "Select All" functionality
- 🎨 **Professional UI Modals** - Custom confirmation dialogs replacing browser alerts
- 🪲 **Critical Bug Fixes** - Resolved duplicate ID issues and selection state problems
- ⏱ **Enhanced Performance** - Set-based selection logic for guaranteed uniqueness
- 📊 **Improved Data Management** - Better CSV import detection and error handling
- 🎯 **Better User Experience** - Toast notifications and non-blocking interactions
- 🛠️ **Code Quality** - Comprehensive refactoring and optimization improvements

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

## 🛠️ Tech Stack

| Technology | Purpose | Version | New in v1.1.0 |
|------------|---------|---------|----------------|
| **React** | Frontend Framework | 18.2.0 | |
| **Vite** | Build Tool & Dev Server | 4.4.5 | |
| **Tailwind CSS** | Styling Framework | 3.3.3 | |
| **Recharts** | Data Visualization | 2.8.0 | ✨ Enhanced |
| **Framer Motion** | Animations | 10.16.0 | |
| **React Router** | Navigation | 6.15.0 | |
| **Lucide React** | Icons | 0.279.0 | |
| **date-fns** | Date Utilities | 2.30.0 | |
| **XLSX** | Excel Import/Export | 0.18.5 | ✨ **NEW** |
| **clsx** | Conditional Classes | 2.0.0 | |
| **CVA** | Class Variance Authority | 0.7.0 | |

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

### 🎯 First Time Setup

1. **Welcome Screen** - You'll see a clean dashboard with no sample data
2. **Import Your Data** - Click "Manage Data" to import your business data
3. **Supported Formats** - Upload JSON, CSV, or Excel files
4. **Explore Analytics** - View comprehensive insights and visualizations

### 📊 Sample Data Templates

Download pre-formatted templates to get started quickly:
- **Customers Template** - Customer information format
- **Revenues Template** - Revenue transaction format
- **Expenses Template** - Expense transaction format

### Build for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist/` directory, ready for deployment.

## 📖 Comprehensive Documentation

### 🏗️ Project Structure (v1.1.0)

```
biz-grow/
├── docs/                   # Marketing website and documentation
│   ├── index.html         # Marketing landing page
│   ├── styles/            # Website styles
│   └── scripts/           # Website functionality
├── public/                # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── dashboard/     # Dashboard-specific components
│   │   │   ├── DataSummaryCards.jsx      # ✨ NEW: 8 comprehensive stat cards
│   │   │   ├── TrendSparklines.jsx       # ✨ NEW: 6-month trend visualization
│   │   │   ├── CategoryPieChart.jsx      # ✨ NEW: Interactive pie charts
│   │   │   ├── RevenueChart.jsx          # ✅ Enhanced with empty states
│   │   │   ├── ExpenseChart.jsx          # ✅ Enhanced with empty states
│   │   │   └── CustomerGrowthChart.jsx   # Customer growth visualization
│   │   ├── DataManager.jsx               # ✨ NEW: Centralized data management
│   │   ├── TestRunner.jsx                # ✨ NEW: Built-in test suite
│   │   ├── EnhancedDatePicker.jsx        # ✨ NEW: Advanced date selection
│   │   └── ui/                           # Base UI components
│   ├── entities/          # Data models and API layer
│   ├── pages/             # Application pages
│   ├── store/             # Enhanced data management
│   │   └── dataStore.js   # ✅ Enhanced with backup/restore
│   ├── utils/             # Utility functions
│   │   ├── dataImporter.js               # ✨ NEW: Multi-format import engine
│   │   ├── dataExporter.js               # ✨ NEW: Advanced export system
│   │   ├── advancedAnalytics.js          # ✨ NEW: Comprehensive analytics
│   │   └── testSuite.js                  # ✨ NEW: Automated testing
│   ├── App.jsx            # Main application component
│   └── main.jsx           # Application entry point
├── CHANGELOG.md           # Version history and updates
├── package.json           # Dependencies and scripts (v1.1.0)
└── README.md             # This comprehensive documentation
```

### 🎯 Key Features & Usage

#### 🏠 **Enhanced Dashboard**
The main overview featuring:
- **8 Data Summary Cards** - Comprehensive business metrics with growth indicators
- **Trend Sparklines** - 6-month trends for revenue, expenses, customers, and profit
- **Interactive Pie Charts** - Category breakdowns for expenses and revenue sources
- **Professional Empty States** - Helpful guidance when no data exists
- **Smart Welcome System** - Context-aware onboarding for new users

#### 🗃️ **Data Management Hub**
Centralized data operations:
- **Multi-Format Import** - JSON, CSV, Excel with intelligent field mapping
- **Import Preview** - Review and validate data before importing
- **Multi-Format Export** - JSON, CSV, Excel with comprehensive metadata
- **Auto-Backup System** - Automatic backups on every data change
- **Manual Backups** - Create restore points before major operations
- **Template Downloads** - Pre-formatted templates for easy data entry

#### 📊 **Advanced Analytics Engine**
Enterprise-grade business intelligence:
- **Financial Metrics** - Revenue, expenses, profit margins, cash flow analysis
- **Customer Intelligence** - CLV, CAC, churn rates, value distribution
- **Growth Analysis** - Revenue/customer growth rates with trend indicators
- **Performance Scoring** - Overall business health score with benchmarks
- **Forecasting** - Revenue, expense, and customer growth projections

#### 🧪 **Enhanced Testing Suite v1.3.3**
Comprehensive testing system for beta stability:
- **25+ Automated Tests** - Multi-selection, modals, ID management, data validation
- **Performance Testing** - Memory usage, large dataset handling, Set operations
- **Error Simulation** - Network failures, storage issues, edge cases
- **Development Utilities** - State debugging, storage analysis, error injection
- **Real-time Results** - Pass/fail status with detailed error messages
- **Export Results** - JSON export with environment details for bug reports

### 🗄️ Enhanced Data Management

The application features enterprise-grade data management:

- **Multi-Format Support** - Import/export JSON, CSV, Excel files
- **Intelligent Field Mapping** - Automatic detection of data types and fields
- **Data Validation** - Comprehensive validation with error reporting
- **Auto-Backup System** - Automatic backups on every data change
- **Manual Backups** - Create restore points before major operations
- **localStorage Persistence** - All data automatically saved to browser storage
- **Real-time Updates** - Changes reflect immediately across all components

## 🎯 Comprehensive Usage Guide

### 🚀 Getting Started (First Time Users)

1. **Launch BizGrow** - Open the application in your browser
2. **Welcome Screen** - You'll see a clean dashboard with no sample data
3. **Import Your Data** - Click "Manage Data" to access the data management hub
4. **Choose Import Method**:
   - Upload existing files (JSON, CSV, Excel)
   - Download templates and fill them out
   - Start fresh and add data manually

### 📥 Importing Your Business Data

#### **From Excel/CSV Files:**
1. Click **"Manage Data"** → **"Import Data"** tab
2. **Select File** - Choose your Excel (.xlsx) or CSV file
3. **Preview Data** - Review the imported data and field mappings
4. **Choose Import Option**:
   - **Replace All Data** - Clear existing data and import new
   - **Merge with Existing** - Add to current data
5. **Confirm Import** - Click to complete the process

#### **Using Templates:**
1. **Download Templates** - Get pre-formatted templates for customers, revenues, expenses
2. **Fill Templates** - Add your business data using the provided format
3. **Import Templates** - Upload the completed templates

#### **Supported Data Formats:**
- **JSON** - Native BizGrow format with full metadata
- **CSV** - Comma-separated values with intelligent field mapping
- **Excel** - Multi-sheet Excel files (.xlsx, .xls)

### 📊 Understanding Your Analytics

#### **Data Summary Cards (8 Cards):**
1. **Total Revenue** - Sum of all income with growth indicators
2. **Total Expenses** - Sum of all expenses with transaction count
3. **Net Profit** - Revenue minus expenses with profit margin
4. **Total Customers** - Customer count with active/potential breakdown
5. **Avg Revenue/Transaction** - Average transaction value
6. **Avg Customer Value** - Average lifetime customer value
7. **Data Range** - Span of your data with date range
8. **Profit Margin** - Profitability percentage with performance rating

#### **Trend Sparklines (4 Mini-Charts):**
1. **Revenue Trend** - 6-month revenue trend with growth percentage
2. **Expense Trend** - 6-month expense analysis
3. **Customer Growth** - New customer acquisition trends
4. **Net Profit Trend** - Overall profitability trends

#### **Interactive Pie Charts:**
1. **Expense Categories** - Visual breakdown of where money is spent
2. **Revenue Sources** - Analysis of income sources and categories
### 📤 Exporting Your Data

#### **Multiple Export Formats:**
1. **JSON Export** - Complete data with metadata (best for backup)
2. **CSV Export** - Separate CSV files for each data type (great for spreadsheets)
3. **Excel Export** - Multi-sheet Excel file with summary (perfect for analysis)

#### **Export Process:**
1. Click **"Manage Data"** → **"Export Data"** tab
2. **Choose Format** - Select JSON, CSV, or Excel
3. **Download** - Files are automatically downloaded to your device

### 🧪 Testing Your Installation

#### **Built-in Test Suite:**
1. **Development Mode** - Test button appears in development
2. **Run Tests** - Click "Test Suite" to run comprehensive tests
3. **View Results** - See pass/fail status for all functionality
4. **Export Results** - Copy test results for debugging

#### **Manual Testing Checklist:**
- ✅ Import data from different formats (JSON, CSV, Excel)
- ✅ View analytics and charts with your data
- ✅ Export data in different formats
- ✅ Create manual backups and restore
- ✅ Test date range filtering
- ✅ Verify empty state handling

## 🔧 Configuration & Customization

### Environment Variables

Create a `.env` file in the root directory:

```env
# Application Configuration
VITE_APP_NAME=BizGrow Dashboard
VITE_APP_VERSION=1.1.0

# Development Configuration
NODE_ENV=development

# Future API Configuration
# VITE_API_BASE_URL=http://localhost:3001/api
```

### Brand Customization

#### **Version Management:**
- **Automatic Synchronization** - Version number automatically synced from package.json
- **Single Source of Truth** - No manual version updates needed in code
- **Build Compatibility** - Works in both development and production builds
- **Error Handling** - Fallback version if package.json cannot be read
- **Testing Integration** - Version synchronization included in test suite

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

## 🧪 Testing & Quality Assurance

### **Enhanced Testing Suite v1.3.3**
- **25+ Comprehensive Tests** covering all v1.3.3 functionality
- **Multi-Selection Testing** - Set-based logic, ID normalization, bulk operations
- **Modal System Testing** - Professional UI components, state management
- **ID Management Testing** - Duplicate prevention, uniqueness enforcement
- **Data Validation Testing** - CSV import, type detection, error scenarios
- **Performance Testing** - Large datasets, memory usage, operation speed
- **Error Handling Testing** - Edge cases, null safety, graceful failures
- **Version Synchronization Testing** - Automatic version consistency across components
- **Development Utilities** - State debugging, error simulation, storage analysis

### **Running Tests**
```bash
# Development mode - use built-in test runner
npm run dev
# Click "Test Suite" button in the dashboard

# Visual Testing Interface (Development Mode)
# 1. Click "Test Suite" button next to "Manage Data" on Dashboard
# 2. Use the TestRunner dialog to run tests with visual interface
# 3. Keyboard shortcut: Ctrl+Shift+T to toggle TestRunner dialog

# Console testing - Enhanced v1.3.3 commands
# Open browser console and run:
window.BizGrowTestSuite.runAllTests()     # Full test suite
window.BizGrowTestSuite.quickTest()       # Essential tests only
window.BizGrowTestSuite.debugState()      # Debug application state
window.BizGrowTestSuite.exportResults()   # Export test results

# Test version synchronization
window.BizGrowTestSuite.testVersionSynchronization()
# Check version info
window.dataStore.getVersionInfo()
```

### **Test Coverage**
- ✅ Multi-format data import (JSON, CSV, Excel)
- ✅ Multi-format data export with validation
- ✅ Data store operations and persistence
- ✅ Backup and restore functionality
- ✅ Advanced analytics calculations
- ✅ User interface interactions

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

### **Marketing Website**
The `docs/` folder contains a complete marketing website:
- Professional landing page
- Feature showcase
- Live demo links
- Contact information

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

## 📊 Project Stats

- **Version**: 1.3.3 (Beta Release)
- **Total Components**: 25+ React components
- **Test Coverage**: 100% for critical functionality
- **Supported Formats**: JSON, CSV, Excel
- **Browser Support**: Chrome, Firefox, Safari, Edge
- **Mobile Support**: Fully responsive design

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
- 📖 **User Guide**: [Complete documentation](../../wiki)
- 🎬 **Video Tutorials**: [YouTube Channel](https://www.youtube.com/embed/1FjwAr5wmGg)
- 📚 **API Reference**: [Developer docs](docs/api/)
- 🔧 **Setup Guide**: [Installation instructions](#-quick-start)

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

**[🚀 Try Live Demo](https://bizgow-app.netlify.app) • [📖 Read Docs](../../wiki)**

[![Discord](https://img.shields.io/badge/Discord-Community-5865F2?style=for-the-badge&logo=discord)](https://discord.gg/s27WGufPgp)

</div>
