# Migration to HTML Admin Panel Version

## Overview
This repository has been migrated from a Next.js application to a static HTML site with an admin panel. This change was made to deploy the admin panel version from PR #3 as the live version.

## What Changed

### Removed (Next.js Infrastructure)
- `app/` directory (Next.js pages and layouts)
- `components/` directory (React components)
- `lib/` directory (Supabase client libraries)
- `package.json`, `package-lock.json` (Node dependencies)
- `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`
- `vercel.json` (Vercel deployment config)
- `DEPLOYMENT.md`, `QUICKSTART.md` (Next.js specific docs)

### Added (Static HTML Site)
- **HTML Pages:**
  - `index.html` - Home page with brutalist design
  - `admin.html` - Admin panel with PIN authentication
  - `track.html`, `soccer.html`, `football.html`, `basketball.html`, `best-of.html` - Gallery pages
  - `contact.html` - Contact page
  - `edit.html` - Local editing tool

- **Assets:**
  - `css/gallery.css` - Shared styles
  - `js/config.js` - Image configuration
  - `js/gallery.js` - Gallery functionality
  - `images/track/` - Sample image included

- **Documentation:**
  - `ADMIN_GUIDE.md` - Comprehensive admin panel guide
  - `SETUP.md` - Setup instructions
  - Updated `README.md` - Main documentation

## Admin Panel Features

### Access
- Secret button (•) in footer of all pages
- Direct access via `admin.html`
- PIN protection (default: 1234)

### Capabilities
- 📊 Dashboard with photo statistics
- ⬆️ Drag & drop photo uploads (stored in browser localStorage)
- 🖼️ Gallery management (view/delete photos)
- ⚙️ Auto-generate configuration code for deployment
- 💾 Browser-based photo storage

### Security Notes
- **Default PIN is 1234** - MUST be changed for production
- Client-side authentication only (anyone can view source)
- XSS protection implemented with HTML escaping
- Modern Clipboard API with fallback

## Deployment

### Current Setup
This is a static HTML site that works with:
- GitHub Pages (recommended)
- Any static hosting provider
- Local HTTP server for testing

### No Build Process Required
- No npm install needed
- No build step required
- Just deploy the HTML files directly

### How to Deploy Changes
1. Edit files locally
2. Commit changes: `git add . && git commit -m "Your message"`
3. Push to GitHub: `git push`
4. GitHub Pages deploys automatically in 1-2 minutes

## Testing Locally

```bash
# Option 1: Open HTML files directly in browser
open index.html

# Option 2: Use a simple HTTP server
python -m http.server 8000
# Then visit http://localhost:8000

# Option 3: Use PHP's built-in server
php -S localhost:8000
```

## Next Steps

1. **Change the default PIN** in `admin.html` (line 789)
2. **Add your photos** to the appropriate `/images/` folders
3. **Update config** via admin panel or manually in `js/config.js`
4. **Test the admin panel** by accessing the secret button
5. **Deploy to GitHub Pages** or your hosting provider

## Support

- See `README.md` for general usage
- See `ADMIN_GUIDE.md` for admin panel details
- See `SETUP.md` for setup instructions

---

**Migration Date:** January 4, 2026
**From:** Next.js + Supabase
**To:** Static HTML + Client-side Admin Panel
