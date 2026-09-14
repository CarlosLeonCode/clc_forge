# CLC Kernel — Official Website & Landing Page

Official static website and documentation landing page for **CLC Kernel**, built with **Astro 5**, **Tailwind CSS v4**, and native internationalization (**i18n**).

---

## 🚀 Quickstart & Local Development

### Prerequisites
- Node.js `>= 18.0.0`
- npm `>= 9.0.0`

### 1. From the Repository Root
You can run website tasks directly from the monorepo root:

```bash
# Start local development server (http://localhost:4321)
npm run website:dev

# Build production static bundle (outputs to website/dist/)
npm run website:build
```

### 2. From the `website/` Subdirectory
Alternatively, navigate into the `website/` directory:

```bash
cd website

# Install dependencies
npm install

# Start Astro dev server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Project Structure

```text
website/
├── astro.config.mjs         # Astro configuration with i18n routing (en/es)
├── package.json             # Isolated website dependencies (Astro, Tailwind v4)
├── public/                  # Static assets & CNAME
│   └── CNAME                # Custom domain definition (clckernel.carlosleoncode.com)
└── src/
    ├── components/          # Reusable Astro UI components
    │   ├── Hero.astro       # 2-column hero with dual CLI/agent interactive terminal
    │   ├── LoopSection.astro # 6-phase agent governance lifecycle
    │   ├── SafeguardsSection.astro # Deterministic AST linters catalog
    │   ├── PolyglotSection.astro   # Polyglot ecosystem support matrix
    │   └── QuickstartSection.astro # CLI initialization & audit steps
    ├── i18n/
    │   └── ui.js            # Internationalization dictionaries (EN & ES)
    ├── layouts/
    │   └── Layout.astro     # Global layout, meta tags, fonts, & language switcher
    ├── pages/
    │   ├── index.astro      # Root route (English /)
    │   └── es/
    │       └── index.astro  # Spanish route (/es)
    └── styles/
        └── global.css       # Tailwind CSS v4 & custom light surface tokens
```

---

## 🌐 Internationalization (i18n)

The website natively supports English (`en`) and Spanish (`es`).

- **English (Default)**: Served at `/`
- **Spanish**: Served at `/es`

### Adding or Updating Translations
All UI strings are centralized in [`src/i18n/ui.js`](src/i18n/ui.js). When adding new UI copy:
1. Add the keys to both `ui.en` and `ui.es`.
2. Access the translation dictionary inside your Astro component via `import { ui } from '../i18n/ui.js'`.

---

## 🚢 Deployment (Netlify)

The website is configured to deploy automatically to **Netlify** via `netlify.toml` in the repository root:

- **Base directory**: `website`
- **Build command**: `npm run build`
- **Publish directory**: `dist` (relative to base -> `website/dist`)
- **Custom domain**: `clckernel.carlosleoncode.com`

---

## 📄 License
MIT © [Carlos Leon Code](https://github.com/carlosleoncode)
