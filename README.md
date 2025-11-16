# AgriBase - Modular Website System

A modern, lightweight, modular website architecture built with pure HTML, CSS, and JavaScript. No external dependencies, frameworks, or build tools required.

## 🌟 Features

- **Modular Architecture**: Each section is a separate HTML file that can be reused across pages
- **Zero Dependencies**: No external CSS frameworks or JavaScript libraries
- **Dynamic Loading**: Sections are loaded asynchronously for better performance
- **Responsive Design**: Fully responsive and mobile-friendly
- **Easy to Customize**: Simple structure makes it easy to add, remove, or modify sections
- **SEO Friendly**: Proper semantic HTML and meta tags
- **Fast & Lightweight**: Minimal footprint with optimized loading

## 📁 Project Structure

```
html/
├── index.html              # Home page
├── about.html              # About page
├── services.html           # Services page
├── contact.html            # Contact page
├── header.html             # Reusable header/navigation
├── footer.html             # Reusable footer
├── README.md               # Documentation
├── assets/
│   ├── css/
│   │   └── main.css       # Custom CSS framework
│   └── js/
│       ├── loader.js      # Section loader with error handling
│       └── config.js      # Page configuration system (optional)
└── sections/
    ├── 01-hero.html       # Hero section
    ├── 02-features.html   # Features grid
    ├── 03-about.html      # About section
    ├── 04-services.html   # Services section
    ├── 05-testimonials.html # Customer testimonials
    ├── 06-pricing.html    # Pricing tables
    ├── 07-cta.html        # Call-to-action
    ├── 08-contact.html    # Contact form
    └── 09-team.html       # Team members
```

## 🚀 Quick Start

1. **Clone or Download** the project
2. **Open** `index.html` in a web browser
3. **That's it!** No installation or build process required

> **Note**: Due to CORS restrictions, you need to serve the files through a local web server. You can use:

```bash
# Python 3
python -m http.server 8000

# PHP
php -S localhost:8000

# Node.js (with npx)
npx http-server

# Or use VS Code Live Server extension
```

Then open `http://localhost:8000` in your browser.

## 🎨 Creating New Pages

### Method 1: Manual Creation

1. Create a new HTML file (e.g., `pricing.html`)
2. Copy the structure from an existing page
3. Add/remove sections by including `data-include` attributes:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pricing - AgriBase</title>
  <link rel="stylesheet" href="assets/css/main.css">
</head>
<body>
  <header data-include="header.html"></header>
  
  <main>
    <section data-include="sections/06-pricing.html"></section>
    <section data-include="sections/07-cta.html"></section>
  </main>
  
  <footer data-include="footer.html"></footer>
  
  <script src="assets/js/loader.js"></script>
</body>
</html>
```

### Method 2: Using Configuration (Optional)

Update `assets/js/config.js` to define page sections:

```javascript
const pageConfigs = {
  'pricing.html': {
    title: 'Pricing - AgriBase',
    sections: [
      'sections/06-pricing.html',
      'sections/07-cta.html'
    ]
  }
};
```

Then include the config script in your HTML.

## 🧩 Creating New Sections

1. Create a new HTML file in the `sections/` directory
2. Follow the naming convention: `##-section-name.html`
3. Use the existing CSS classes from `main.css`
4. Include any section-specific styles within `<style>` tags

### Section Template

```html
<section>
  <div class="container">
    <h2 class="section-title">Section Title</h2>
    <p class="section-subtitle">Section description</p>
    
    <!-- Your content here -->
    <div class="grid grid-cols-3 gap-lg">
      <div class="card">
        <h3 class="card-title">Card Title</h3>
        <p class="card-text">Card content</p>
      </div>
    </div>
  </div>
</section>
```

## 🎨 CSS Framework

The project includes a custom utility-first CSS framework in `assets/css/main.css`:

### Layout Classes
- `.container`, `.container-sm`, `.container-md`, `.container-lg`
- `.grid`, `.grid-cols-1/2/3/4`
- `.flex`, `.flex-col`, `.flex-wrap`
- `.items-center`, `.justify-between`, `.gap-md`

### Components
- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-outline`
- `.card`, `.card-title`, `.card-text`
- `.navbar`, `.footer`

### Forms
- `.form-group`, `.form-label`, `.form-input`, `.form-textarea`

### Utilities
- `.text-center`, `.text-primary`, `.text-gray`
- `.bg-primary`, `.bg-gray`, `.bg-white`
- `.mt-md`, `.mb-lg`, `.p-xl`
- `.rounded`, `.shadow-lg`

### Color Variables
```css
--primary: #4f46e5
--secondary: #06b6d4
--success: #10b981
--warning: #f59e0b
--error: #ef4444
```

## ⚙️ JavaScript Loader Features

The `loader.js` file includes:

- ✅ Async section loading
- ✅ Error handling with user-friendly messages
- ✅ Optional caching for performance
- ✅ Loading states
- ✅ Script execution in loaded content
- ✅ Mobile menu toggle
- ✅ Smooth scrolling
- ✅ Form handling
- ✅ Active navigation highlighting

### Customization

```javascript
// Custom loader configuration
const loader = new SectionLoader({
  enableCache: true,        // Enable/disable caching
  showLoading: true,        // Show loading states
  attribute: 'data-include', // Custom attribute name
  onLoad: (element, path) => {
    console.log(`Loaded: ${path}`);
  },
  onError: (element, path, error) => {
    // Custom error handling
  }
});

loader.init();
```

## 📱 Responsive Design

The framework is mobile-first and fully responsive:

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

Grid columns automatically stack on mobile devices.

## 🎯 Best Practices

1. **Naming Convention**: Use numbered prefixes for sections (01-, 02-, etc.) to maintain order
2. **Reusability**: Create generic sections that can be reused across pages
3. **Semantic HTML**: Use proper HTML5 semantic elements
4. **Accessibility**: Include alt text, ARIA labels, and keyboard navigation
5. **Performance**: Keep images optimized and minimize inline styles
6. **Modularity**: Each section should be self-contained and independent

## 🔧 Customization Guide

### Changing Colors

Edit CSS variables in `assets/css/main.css`:

```css
:root {
  --primary: #your-color;
  --secondary: #your-color;
  /* ... */
}
```

### Changing Fonts

Update the font import in each HTML file or in `main.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Your+Font&display=swap');

:root {
  --font-sans: 'Your Font', sans-serif;
}
```

### Adding New Utility Classes

Add to `assets/css/main.css` following the existing pattern:

```css
.your-utility {
  /* styles */
}
```

## 📦 Adding Icons

Current sections use inline SVG icons. You can:

1. **Continue with inline SVG** (recommended for performance)
2. **Use icon fonts** like Font Awesome (add CDN link)
3. **Use icon libraries** like Heroicons, Feather Icons

## 🚀 Deployment

This website can be deployed to any static hosting service:

- **Netlify**: Drag and drop the folder
- **Vercel**: Connect your Git repository
- **GitHub Pages**: Push to a GitHub repo and enable Pages
- **AWS S3**: Upload to an S3 bucket with static hosting
- **Traditional Hosting**: Upload via FTP to your web host

## 🔄 Version Control

Recommended `.gitignore`:

```
.DS_Store
*.log
node_modules/
.env
```

## 📄 License

Free to use for personal and commercial projects.

## 🤝 Contributing

Feel free to customize and extend this system for your needs!

## 📞 Support

For questions or issues, refer to the inline code comments or modify the code to suit your needs.

---

Built with ❤️ for modern, modular web development

