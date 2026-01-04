# Admin Panel Guide

## 🔐 Accessing the Admin Panel

The admin panel is accessible via a secret button located at the bottom of every page on the website.

### Finding the Secret Button
1. Scroll to the very bottom of any page (index.html, contact.html, etc.)
2. Look for a small dot (•) below the copyright text
3. The dot is semi-transparent but becomes visible when you hover over it
4. Click the dot to access the admin panel

**Alternative:** Navigate directly to `admin.html`

## 🔒 PIN Authentication

When you first access the admin panel, you'll be prompted to enter a 4-digit PIN.

**Default PIN:** `1234`

### Changing the PIN
1. Open `admin.html` in a code editor
2. Find the line: `const ADMIN_PIN = '1234';` (around line 799)
3. Change `'1234'` to your desired 4-digit PIN
4. Save the file and push to GitHub

## 📊 Dashboard Overview

The dashboard shows:
- Total photo count for each category (Track, Soccer, Football, Basketball, Best Of)
- Quick action buttons
- Recent activity (when implemented)
- Navigation sidebar with 5 main sections

## ⬆️ Uploading Photos

### Step-by-Step:
1. Click **"Upload Photos"** in the sidebar
2. Select a category (Track, Soccer, Football, Basketball, or Best Of)
3. Either:
   - Click the upload zone to browse files
   - Drag and drop image files onto the upload zone
4. Supported formats: JPG, JPEG, PNG, GIF
5. Photos are stored in browser localStorage for preview

### Important Notes:
- Photos are stored locally in your browser only
- They won't appear on the live site until you deploy
- Browser storage is limited (typically 5-10MB)
- Clearing browser data will delete uploaded photos

## 🖼️ Managing Photos

### View Photos:
1. Click **"Manage Photos"** in the sidebar
2. Select a gallery to view
3. Photos appear in a grid layout

### Delete Photos:
1. Hover over a photo in the Manage Photos section
2. Click the **"Delete"** button that appears
3. Confirm deletion

## ⚙️ Deploying Changes

To make your changes live on the website:

### Method 1: Using the Configuration Panel
1. Click **"Configuration"** in the sidebar
2. Review the generated JavaScript configuration code
3. Click **"Copy to Clipboard"** or **"Download as File"**
4. Open your local copy of the repository
5. Navigate to `js/config.js`
6. Replace the entire content with the copied configuration
7. **Upload actual image files** to the appropriate folders:
   - `/images/track/` - for track photos
   - `/images/soccer/` - for soccer photos
   - `/images/football/` - for football photos
   - `/images/basketball/` - for basketball photos
   - `/images/best-of/` - for best of photos
8. Make sure filenames in the config match your uploaded files exactly
9. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update portfolio images"
   git push
   ```
10. Wait 1-2 minutes for GitHub Pages to deploy

### Method 2: Manual Configuration
1. Add image files to the appropriate `/images/` folder
2. Open `js/config.js` in a text editor
3. Add filenames to the appropriate category array:
   ```javascript
   track: {
       images: [
           "photo1.jpg",
           "photo2.jpg",
           "new-photo.jpg"  // Add new photos here
       ]
   }
   ```
4. Save and push to GitHub

## 🎨 Admin Panel Features

### Statistics Dashboard
- Shows photo counts for all categories
- Updates in real-time as you upload/delete photos

### Category Buttons
- Color-coded for easy identification
- Active state shows selected category
- Supports all 5 portfolio categories

### Drag & Drop Upload
- Modern, intuitive interface
- Visual feedback when dragging files
- Supports multiple file uploads at once

### Photo Preview Grid
- Responsive grid layout
- Hover effects for better UX
- Quick delete functionality

### Configuration Generator
- Automatically generates deployment code
- One-click copy to clipboard
- Download as file option
- Includes proper formatting and comments

### Help Documentation
- Built-in help section
- Step-by-step guides
- Troubleshooting information

## 🔧 Technical Details

### Data Storage
- Photos stored as base64 in localStorage
- Configuration stored in browser
- No server-side database required
- Data persists across page reloads (same browser only)

### Browser Compatibility
- Modern browsers with localStorage support
- Chrome, Firefox, Safari, Edge
- Mobile browsers supported

### Security Considerations
- PIN is stored in the HTML file (client-side only)
- This is for basic access control, not high-security applications
- Anyone with access to the source code can see the PIN
- For production use, consider server-side authentication

## ❓ Troubleshooting

### Photos not showing in admin panel?
- Check if localStorage is enabled in your browser
- Try clearing browser cache and reloading
- Verify photos are in supported formats (JPG, JPEG, PNG, GIF)

### Can't access admin panel?
- Verify you're entering the correct PIN
- Check if JavaScript is enabled in your browser
- Try accessing directly via `admin.html`

### Changes not appearing on live site?
- Remember: admin panel changes are local only
- You must copy configuration and upload actual images
- Push changes to GitHub to deploy
- Wait 1-2 minutes for GitHub Pages to build
- Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Forgot your PIN?
- Open `admin.html` in a code editor
- Find the `ADMIN_PIN` variable
- Change it to a new PIN
- Save and refresh the page

### Browser storage full?
- Delete some photos from the admin panel
- Clear browser localStorage
- Reduce image file sizes before uploading

## 📝 Best Practices

1. **Image Optimization:**
   - Resize images to max 2000px width before uploading
   - Use JPG format for photos (smaller file size)
   - Compress images to reduce loading times

2. **File Naming:**
   - Use descriptive names without spaces
   - Use hyphens or underscores instead: `track-meet-2024.jpg`
   - Keep filenames consistent and organized

3. **Organization:**
   - Use appropriate categories
   - Put your best shots in "Best Of"
   - Keep galleries focused and curated

4. **Regular Backups:**
   - Download your configuration regularly
   - Keep copies of your image files
   - Document your changes

5. **Testing:**
   - Test locally before deploying
   - Verify all images load correctly
   - Check on mobile devices

## 🚀 Quick Start Workflow

1. Access admin panel (click the • button at page bottom)
2. Enter PIN: `1234`
3. Upload photos to desired categories
4. Review photos in Manage section
5. Generate configuration code
6. Upload actual image files to repository
7. Update `js/config.js` with generated code
8. Commit and push to GitHub
9. Wait for deployment
10. Verify changes on live site

## 📧 Support

For technical issues or questions:
- Check the built-in Help section in the admin panel
- Review the main README.md file
- Contact your web developer

---

**Remember:** The admin panel is a local management tool. To publish changes to the live website, you must update the repository and push to GitHub.
