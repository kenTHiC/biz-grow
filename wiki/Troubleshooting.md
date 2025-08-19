# 🐛 Troubleshooting Guide

Comprehensive troubleshooting guide for BizGrow v1.3.3 Beta. Find solutions to common issues and learn how to diagnose problems effectively.

---

## 🚨 Emergency Quick Fixes

### **Application Won't Start**

```bash
# 1. Check Node.js version (must be 16+)
node --version

# 2. Clear everything and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# 3. Try starting again
npm run dev
```

### **Page Shows Blank/White Screen**

1. **Open Browser Console** (F12)
2. **Look for Red Errors** in console
3. **Refresh Page** (Ctrl+R or Cmd+R)
4. **Clear Browser Cache** (Ctrl+Shift+R)

### **Data Not Loading/Saving**

```javascript
// Check in browser console (F12)
// 1. Verify localStorage access
console.log('LocalStorage available:', typeof Storage !== 'undefined');

// 2. Check data store
console.log('DataStore loaded:', typeof window.dataStore !== 'undefined');

// 3. Test data access
window.dataStore.getAllCustomers();
```

---

## 🔧 Installation Issues

### **Node.js Version Problems**

#### **Symptoms**
- "Node.js version not supported" errors
- npm install fails with version warnings
- Build process fails

#### **Solutions**
```bash
# Check current version
node --version

# If version is below 16.0.0:
# 1. Visit https://nodejs.org/
# 2. Download and install latest LTS version
# 3. Restart terminal/command prompt
# 4. Verify installation
node --version
npm --version
```

### **Permission Errors (macOS/Linux)**

#### **Symptoms**
- "EACCES" permission denied errors
- npm install fails with permission issues

#### **Solutions**
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm

# Alternative: Use nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install node
nvm use node
```

### **Port Already in Use**

#### **Symptoms**
- "Port 5173 is already in use" error
- Development server won't start

#### **Solutions**
```bash
# Vite automatically finds next available port
# Or specify different port:
npm run dev -- --port 3000

# Kill process using port (if needed)
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:5173 | xargs kill -9
```

---

## 🌐 Browser Issues

### **JavaScript Errors**

#### **Common Error Messages**

**"Cannot read property of undefined"**
```javascript
// Check if objects are loaded
console.log('DataStore:', window.dataStore);
console.log('Test Suite:', window.BizGrowTestSuite);

// If undefined, refresh page and check network tab
```

**"Module not found" or Import Errors**
- Clear browser cache (Ctrl+Shift+R)
- Check if development server is running
- Verify all files are present in project directory

#### **Browser Compatibility**

**Supported Browsers:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Unsupported Browsers:**
- Internet Explorer (any version)
- Chrome < 90
- Firefox < 88

### **Performance Issues**

#### **Slow Loading**

**Symptoms:**
- Page takes long time to load
- Interactions are sluggish
- Charts render slowly

**Solutions:**
1. **Close Other Tabs** - Free up memory
2. **Restart Browser** - Clear memory leaks
3. **Check System Resources** - Ensure adequate RAM
4. **Disable Browser Extensions** - Test in incognito mode

#### **Memory Issues**

```javascript
// Check memory usage in console
if (performance.memory) {
  const memory = performance.memory;
  console.log('Memory Usage:', {
    used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + 'MB',
    total: Math.round(memory.totalJSHeapSize / 1024 / 1024) + 'MB',
    limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) + 'MB'
  });
}
```

---

## 📊 Data Issues

### **Data Not Persisting**

#### **Symptoms**
- Data disappears after page refresh
- Changes don't save
- Import/export not working

#### **Diagnosis**
```javascript
// Check localStorage availability
try {
  localStorage.setItem('test', 'test');
  localStorage.removeItem('test');
  console.log('✅ localStorage working');
} catch (e) {
  console.error('❌ localStorage not available:', e);
}

// Check data store functionality
window.dataStore.debugState();
```

#### **Solutions**
1. **Enable Cookies/Storage** in browser settings
2. **Clear Corrupted Data**:
   ```javascript
   // Clear all BizGrow data (WARNING: This deletes all data)
   Object.keys(localStorage).forEach(key => {
     if (key.startsWith('biz-grow-')) {
       localStorage.removeItem(key);
     }
   });
   location.reload();
   ```

### **Import/Export Problems**

#### **CSV Import Issues**

**File Not Recognized:**
- Ensure file has .csv extension
- Check file encoding (UTF-8 recommended)
- Verify CSV format with commas as separators

**Data Not Importing Correctly:**
```javascript
// Test CSV parsing
const testCSV = "name,email,phone\nJohn Doe,john@example.com,123-456-7890";
console.log('CSV Test:', window.BizGrowTestSuite.testCSVParsing(testCSV));
```

**Sample CSV Format:**
```csv
name,email,phone,company,status,total_value,acquisition_date
John Doe,john@example.com,123-456-7890,Acme Corp,active,5000,2024-01-15
Jane Smith,jane@example.com,987-654-3210,Tech Inc,potential,2500,2024-02-01
```

---

## 🧪 Testing Issues

### **Test Suite Not Available**

#### **Symptoms**
- "Test Suite" button doesn't appear
- `window.BizGrowTestSuite` is undefined
- Console tests don't work

#### **Solutions**
```javascript
// Check if test suite is loaded
if (typeof window.BizGrowTestSuite === 'undefined') {
  console.error('Test suite not loaded. Possible causes:');
  console.log('1. Page not fully loaded - wait and try again');
  console.log('2. JavaScript error preventing load - check console');
  console.log('3. Development mode not active - ensure npm run dev');
}

// Force reload test suite (if available)
if (window.location.reload) {
  window.location.reload();
}
```

### **Tests Failing**

#### **Multi-Selection Tests Failing**
```javascript
// Debug multi-selection state
console.log('Selection state:', {
  isSelectionMode: /* check component state */,
  selectedItems: /* check selected items */,
  totalItems: /* check total items */
});

// Test Set functionality
const testSet = new Set([1, 2, 3, 1, 2]);
console.log('Set test:', testSet.size === 3 ? 'PASS' : 'FAIL');
```

#### **Performance Tests Failing**
- **Close Other Applications** - Free up system resources
- **Restart Browser** - Clear memory issues
- **Run Individual Tests** - Isolate performance problems

---

## 🔄 Version Issues

### **Version Synchronization Problems**

#### **Symptoms**
- Version shows as "fallback" instead of "package.json"
- Version tests failing
- Inconsistent version numbers

#### **Diagnosis**
```javascript
// Check version info
const versionInfo = window.dataStore.getVersionInfo();
console.log('Version Info:', versionInfo);

// Expected output:
// { app: "1.3.3", data: "1.0.0", source: "package.json" }
```

#### **Solutions**
1. **Verify package.json** exists and has correct version
2. **Check import path** in dataStore.js
3. **Rebuild application**:
   ```bash
   npm run build
   npm run dev
   ```

---

## 🔒 Security Issues

### **CORS Errors**

#### **Symptoms**
- "Cross-Origin Request Blocked" errors
- API calls failing
- External resources not loading

#### **Solutions**
- **Development**: CORS should not affect local development
- **Production**: Configure server CORS headers properly
- **Local Files**: Use development server, not file:// protocol

### **Content Security Policy (CSP) Issues**

#### **Symptoms**
- "Refused to execute inline script" errors
- Styles not applying
- External resources blocked

#### **Solutions**
- **Development**: CSP should not affect local development
- **Production**: Configure CSP headers to allow necessary resources

---

## 📱 Mobile/Responsive Issues

### **Mobile Layout Problems**

#### **Symptoms**
- Layout broken on mobile devices
- Touch interactions not working
- Text too small or large

#### **Solutions**
1. **Test Responsive Design**:
   - Open browser dev tools (F12)
   - Click device toggle button
   - Test different screen sizes

2. **Clear Mobile Cache**:
   - Mobile Safari: Settings → Safari → Clear History and Website Data
   - Mobile Chrome: Settings → Privacy → Clear Browsing Data

### **Touch Interaction Issues**

#### **Symptoms**
- Buttons not responding to touch
- Scrolling not working properly
- Hover effects stuck on mobile

#### **Solutions**
- **Restart Mobile Browser**
- **Clear Browser Cache**
- **Test in Different Mobile Browser**

---

## 🔧 Advanced Debugging

### **Debug Mode**

```javascript
// Enable debug mode
localStorage.setItem('bizgrow-debug', 'true');
location.reload();

// Check debug info
window.BizGrowTestSuite.debugState();

// Export debug information
const debugInfo = window.BizGrowTestSuite.exportResults();
console.log('Debug Info:', debugInfo);
```

### **Network Issues**

```javascript
// Check network connectivity
navigator.onLine ? console.log('✅ Online') : console.log('❌ Offline');

// Test local server connection
fetch('http://localhost:5173/')
  .then(() => console.log('✅ Server reachable'))
  .catch(e => console.error('❌ Server unreachable:', e));
```

### **Performance Profiling**

```javascript
// Start performance monitoring
performance.mark('start');

// Run operation to test
window.BizGrowTestSuite.testPerformance();

// End monitoring
performance.mark('end');
performance.measure('operation', 'start', 'end');

// View results
console.log(performance.getEntriesByType('measure'));
```

---

## 📞 Getting Additional Help

### **Before Reporting Issues**

1. **Check Console** for error messages (F12)
2. **Run Diagnostics**:
   ```javascript
   window.BizGrowTestSuite.debugState();
   window.BizGrowTestSuite.exportResults();
   ```
3. **Test in Incognito Mode** to rule out extensions
4. **Try Different Browser** to isolate browser-specific issues

### **When Reporting Issues**

Include this information:
- **Operating System** and version
- **Browser** and version
- **Node.js** and npm versions
- **Error Messages** (exact text)
- **Steps to Reproduce** the issue
- **Debug Output** from diagnostic commands

### **Support Channels**

1. **📖 Documentation**: Check [GitHub Wiki](https://github.com/kenTHiC/biz-grow/wiki)
2. **🔍 Search Issues**: [GitHub Issues](https://github.com/kenTHiC/biz-grow/issues)
3. **💬 Community**: [Discord Server](https://discord.gg/s27WGufPgp)
4. **🐛 Report Bug**: Create new GitHub issue
5. **📧 Email**: bizgrowapp@gmail.com (for critical issues)

---

**Remember**: Most issues can be resolved by refreshing the page, clearing cache, or restarting the development server. When in doubt, try the emergency quick fixes at the top of this guide!
