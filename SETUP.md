# Quick Setup Guide - Cooper of the Crop Portfolio

## 🚀 Getting Started

Welcome to your photography portfolio! This guide will help you add and manage your photos.

## 📸 Adding Your First Photos

### Step 1: Organize Your Photos
Put your photos in the right folders:
- Track & Field photos → `images/track/`
- Soccer photos → `images/soccer/`
- Football photos → `images/football/`
- Basketball photos → `images/basketball/`
- Best shots → `images/best-of/`

### Step 2: Update the Config File
1. Open `js/config.js` in any text editor (Notepad, TextEdit, VS Code, etc.)
2. Find the section for your category (like `track:` or `soccer:`)
3. Add your image filename inside the `images: [...]` array

**Example:**
```javascript
track: {
    title: "TRACK &<br>FIELD",
    description: "Track & Field Photography",
    images: [
        "athlete-jumping.jpg",
        "sprint-finish.jpg",
        "relay-handoff.jpg"
    ]
}
```

### Step 3: Preview Locally
1. Open any `.html` file in your web browser
2. Navigate to your gallery to see the changes
3. The first image in each list appears full-width

### Step 4: Publish to the Web
```bash
git add .
git commit -m "Add new photos"
git push
```
Wait 1-2 minutes, then visit your site!

## 🎨 Tips for Best Results

### Image Guidelines
- **Format**: JPEG works best for photos
- **Size**: Resize to max 2000px wide for faster loading
- **Naming**: Use simple names like `game-1.jpg` (no spaces, use dashes)
- **Quality**: Keep file sizes under 2MB each

### Organization
- **First Image**: Make your best shot first - it displays larger
- **Order Matters**: Images appear in the order you list them
- **Best Of**: Pick 10-15 absolute best shots from all categories

## 🛠️ Common Tasks

### Add Photos
1. Copy image to folder (e.g., `images/soccer/`)
2. Add filename to `js/config.js`
3. Save and push to GitHub

### Remove Photos
1. Delete filename from `js/config.js`
2. Optionally delete the file from the folder
3. Save and push to GitHub

### Reorder Photos
1. Cut and paste filenames in `js/config.js` to change order
2. Save and push to GitHub

### Change Gallery Title
Edit the `title:` field in `js/config.js`

## 📱 Edit Page

Open `edit.html` in your browser for:
- Quick reference guide
- Config file template
- Step-by-step instructions
- Links to all galleries

## ❓ Troubleshooting

**Images not showing?**
- Check filename matches exactly (case-sensitive!)
- Make sure file is in the right folder
- Look for typos in config.js

**Changes not on live site?**
- Wait 2-3 minutes after pushing
- Try hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Check GitHub Actions tab for deployment status

**Need more help?**
- Check the full README.md
- All instructions are in `edit.html`

## 🎯 Your Site URLs

- **Live Site**: https://cooperhofmann.github.io/cooperofthecrop.github.io/
- **Edit Page**: Open `edit.html` locally
- **Track Gallery**: `track.html`
- **Soccer Gallery**: `soccer.html`
- **Football Gallery**: `football.html`
- **Basketball Gallery**: `basketball.html`
- **Best Of Gallery**: `best-of.html`

---

**That's it! Start adding photos and watch your portfolio come to life. 📷**
