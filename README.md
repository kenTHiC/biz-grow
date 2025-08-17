# 📊 BizGrow - Business Analytics Dashboard

<div align="center">

![BizGrow Logo](https://img.shields.io/badge/BizGrow-Analytics%20Dashboard-blue?style=for-the-badge&logo=chart-line)

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.4.5-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3.3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

**A modern, responsive business analytics dashboard built with React, featuring real-time data visualization, customer management, and financial tracking.**

[🚀 Live Demo](#) • [📖 Documentation](#documentation) • [🐛 Report Bug](../../issues) • [✨ Request Feature](../../issues)

</div>

---

## ✨ Features

### 📈 **Dashboard & Analytics**
- **Real-time KPI Cards** - Revenue, expenses, profit, and customer metrics
- **Interactive Charts** - Revenue trends, expense breakdowns, customer growth
- **Advanced Analytics** - Category-wise analysis, monthly trends, profit tracking
- **Date Range Filtering** - Custom time periods with preset options
- **Data Export** - JSON export functionality for reports and analytics

### 👥 **Customer Management**
- **Complete CRUD Operations** - Add, edit, delete, and view customers
- **Customer Status Tracking** - Active, potential, and inactive customers
- **Contact Information** - Email, phone, company details
- **Value Tracking** - Total customer value and acquisition dates
- **Search & Filter** - Easy customer discovery and management

### 💰 **Financial Management**
- **Revenue Tracking** - Multiple revenue sources and categories
- **Expense Management** - Categorized expense tracking with vendors
- **Transaction History** - Detailed financial records with descriptions
- **Category Analytics** - Visual breakdown of income and expenses
- **Receipt Management** - Optional receipt URL storage

### 🎨 **Modern UI/UX**
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Glassmorphism Effects** - Modern, translucent design elements
- **Smooth Animations** - Framer Motion powered transitions
- **Toast Notifications** - Real-time user feedback
- **Dark Mode Ready** - Prepared for dark theme implementation

## 🛠️ Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | Frontend Framework | 18.2.0 |
| **Vite** | Build Tool & Dev Server | 4.4.5 |
| **Tailwind CSS** | Styling Framework | 3.3.3 |
| **Recharts** | Data Visualization | 2.8.0 |
| **Framer Motion** | Animations | 10.16.0 |
| **React Router** | Navigation | 6.15.0 |
| **Lucide React** | Icons | 0.279.0 |
| **date-fns** | Date Utilities | 2.30.0 |

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16.0.0 or higher)
- **npm** or **yarn** package manager

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

4. **Open your browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist/` directory.

## 📖 Documentation

### Project Structure

```
biz-grow/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── dashboard/      # Dashboard-specific components
│   │   └── ui/            # Base UI components
│   ├── entities/          # Data models and API layer
│   ├── pages/             # Application pages
│   ├── store/             # Data management and localStorage
│   ├── utils/             # Utility functions
│   ├── App.jsx            # Main application component
│   ├── Layout.jsx         # Application layout
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── vite.config.js         # Vite configuration
└── README.md             # Project documentation
```

### Key Components

#### 🏠 **Dashboard** (`/dashboard`)
The main overview page featuring:
- KPI cards with key business metrics
- Revenue trend line chart
- Expense breakdown bar chart
- Customer growth area chart
- Date range filtering and export functionality

#### 📊 **Analytics** (`/analytics`)
Advanced analytics page with:
- Revenue breakdown by category (pie chart)
- Expense analysis by category (bar chart)
- Monthly trends comparison (line chart)
- Comprehensive filtering and export options

#### 👥 **Customers** (`/customers`)
Customer management interface:
- Customer grid with status indicators
- Add/edit customer modal forms
- Contact information management
- Customer value tracking

#### 📋 **Reports** (`/reports`)
Financial records management:
- Revenue and expense entry forms
- Transaction history with categories
- Vendor and customer tracking
- Detailed financial records

### Data Management

The application uses a sophisticated data management system:

- **localStorage Persistence** - All data is automatically saved to browser storage
- **Entity Classes** - Clean API layer for data operations
- **Real-time Updates** - Changes reflect immediately across all pages
- **Data Validation** - Form validation and error handling
- **Export Functionality** - JSON export for backup and analysis

## 🎯 Usage Examples

### Adding a New Customer

1. Navigate to the **Customers** page
2. Click **"Add Customer"** button
3. Fill in the customer details:
   - Name (required)
   - Email (required)
   - Phone, Company (optional)
   - Status (Active/Potential/Inactive)
   - Total Value
4. Click **"Create Customer"**

### Recording Revenue

1. Go to the **Reports** page
2. Click **"Add Revenue"** button
3. Enter revenue details:
   - Amount (required)
   - Source and Category
   - Customer Name
   - Date and Description
4. Click **"Create"**

### Viewing Analytics

1. Visit the **Analytics** page
2. Use date range filters to focus on specific periods
3. Analyze charts for business insights:
   - Revenue distribution by category
   - Expense patterns
   - Monthly performance trends
4. Export data for further analysis

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Application Configuration
VITE_APP_NAME=BizGrow Dashboard
VITE_APP_VERSION=1.0.0

# API Configuration (if needed for future backend integration)
# VITE_API_BASE_URL=http://localhost:3001/api
```

### Customization

#### Tailwind CSS Theme

Modify `tailwind.config.js` to customize colors, fonts, and spacing:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },
    },
  },
}
```

#### Chart Colors

Update chart colors in component files:

```javascript
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Recharts** for beautiful chart components
- **Framer Motion** for smooth animations
- **Lucide** for the beautiful icon set

## 📞 Support

- 📧 **Email**: bizgrowapp@gmail.com
- 💬 **Discord**: [Join our community](https://discord.gg/bizgrow)
- 🐛 **Issues**: [GitHub Issues](../../issues)
- 📖 **Wiki**: [Project Wiki](../../wiki)

---

<div align="center">

**Made with ❤️ by the BizGrow Team**

[![GitHub stars](https://img.shields.io/github/stars/kenthic/biz-grow?style=social)](../../stargazers)
[![GitHub forks](https://img.shields.io/github/forks/kenthic/biz-grow?style=social)](../../network/members)

</div>
