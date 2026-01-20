# Cooper of the Crop - Photography Portfolio

A brutalist photography portfolio website showcasing sports and creative photography.

## 🎯 Overview

This is a static website designed for easy image management with a bold, minimal brutalist aesthetic. The site is deployed via GitHub Pages and features dynamic image loading from organized folders.

## 📁 Folder Structure

```
/images/
  /track/        - Track & Field photos
  /soccer/       - Soccer photos
  /football/     - Football photos
  /basketball/   - Basketball photos
  /best-of/      - Best of all categories

/js/
  config.js      - Image configuration file (edit this!)
  gallery.js     - Gallery functionality

/css/
  gallery.css    - Shared styles
```

## 🖼️ How to Add/Remove/Reorder Images

### Method 1: Quick Steps

1. **Add your photos** to the appropriate folder in `/images/`
   - Example: Add `my-photo.jpg` to `/images/track/`

2. **Edit the config file** at `/js/config.js`
   - Find the category (track, soccer, football, basketball, bestOf)
   - Add your filename to the `images` array
   ```javascript
   track: {
       images: [
           "existing-photo.jpg",
           "my-photo.jpg"  // Add your new photo here
       ]
   }
   ```

3. **Reorder by changing the order** in the array
   - First image becomes the featured (full-width) image
   - Images appear in the order they're listed

4. **Remove by deleting** the filename from the array

5. **Save and push** to GitHub
   ```bash
   git add .
   git commit -m "Update portfolio images"
   git push
   ```

### Method 2: Use the Edit Page

1. Open `edit.html` in your browser (works locally)
2. Follow the step-by-step instructions
3. Use the Quick Config Editor to manage your images
4. Copy the config and paste into `/js/config.js`

## 🚀 Deployment

This site is automatically deployed to GitHub Pages. After pushing changes:

1. Changes appear in 1-2 minutes
2. Visit your site at: `https://cooperhofmann.github.io/cooperofthecrop.github.io/`
3. Clear browser cache if changes don't appear immediately

## 📄 Pages

- **index.html** - Home page with category grid
- **track.html** - Track & Field gallery
- **soccer.html** - Soccer gallery
- **football.html** - Football gallery
- **basketball.html** - Basketball gallery
- **best-of.html** - Best Of gallery
- **contact.html** - Contact information
- **edit.html** - Portfolio management page (local use)
- **admin.html** - 🔐 Admin panel with PIN authentication (see ADMIN_GUIDE.md)

## 🔐 Admin Panel

A powerful admin panel is now available for managing your portfolio:

### Quick Access:
- Look for the secret button (•) at the bottom of any page
- Or navigate directly to `admin.html`
- Default PIN: `1234`

### Features:
- 📊 Dashboard with photo statistics
- ⬆️ Drag & drop photo uploads
- ☁️ **NEW: Import directly from Google Drive!** - Share a folder link and automatically download images
- 🖼️ Gallery management (view/delete photos)
- ⚙️ Auto-generate configuration code
- 💾 Browser-based photo storage
- 🚀 **NEW: Direct GitHub deployment** - Upload photos on the live site and deploy directly to GitHub with one click!
- 📦 **Alternative: One-click photo package download** - Get all photos + config in a ready-to-deploy ZIP file!

**For detailed instructions, see [ADMIN_GUIDE.md](ADMIN_GUIDE.md)**

## 🎨 Design Philosophy

**Brutalist Design Principles:**
- Bold, oversized typography
- Visible grid system
- Black, white, and gray only
- Raw layout over polish
- No rounded corners
- No gradients or shadows

## 💻 Technical Details

- **Static HTML/CSS/JavaScript** - No build process required
- **Vanilla JavaScript** - No frameworks, easy to understand
- **Responsive Design** - Works on mobile and desktop
- **Lightbox Gallery** - Click images to view fullscreen
- **Lazy Loading** - Images load as needed for performance

## 🔧 Customization

### Update Site Title/Branding
Edit the `<title>` tags and `.logo` content in each HTML file.

### Change Colors
Edit CSS variables in `/css/gallery.css`:
```css
:root {
    --black: #000000;
    --white: #FFFFFF;
    --gray: #808080;
    --light-gray: #E0E0E0;
}
```

### Modify Grid Layout
Edit grid settings in `/css/gallery.css` under `.gallery-grid`

## 📝 Tips

- **Image naming**: Use descriptive names without spaces (use hyphens or underscores)
- **Image format**: JPEG recommended for photos (smaller file size)
- **Image size**: Recommended max width 2000px for web
- **First image**: The first image in each category appears full-width
- **Empty galleries**: Will show placeholder images until you add your own

## 🆘 Troubleshooting

**Images not showing?**
- Check the filename exactly matches in config.js (case-sensitive)
- Verify the image is in the correct folder
- Clear browser cache

**Changes not appearing on live site?**
- Wait 1-2 minutes after pushing to GitHub
- Check GitHub Actions for deployment status
- Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

**Need to test locally?**
- Open any HTML file directly in your browser
- Or use a simple local server: `python -m http.server`

## 📧 Questions?

For technical support or customization help, contact the developer who set this up for you.

---

**Built with simplicity in mind. No complex frameworks. Easy to edit. Built to last.**
