# Google Drive Integration Setup Guide

This guide will help you set up automatic image importing from Google Drive to your GitHub Pages portfolio.

## 🌟 Overview

The Google Drive integration allows you to:
- Share a Google Drive folder link in the admin panel
- Automatically download images from that folder
- Add them to your GitHub repository
- Update your portfolio configuration
- All without manual file downloads or git commands!

## 📋 Prerequisites

- Access to Google Cloud Console
- GitHub repository admin access
- About 10-15 minutes for initial setup

## 🔧 Setup Steps

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Enter a project name (e.g., "Portfolio Image Sync")
5. Click "Create"

### Step 2: Enable Google Drive API

1. In your new project, go to "APIs & Services" → "Library"
2. Search for "Google Drive API"
3. Click on it and press "Enable"

### Step 3: Create a Service Account

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Enter a name (e.g., "portfolio-image-sync")
4. Click "Create and Continue"
5. Skip the optional steps and click "Done"

### Step 4: Generate Service Account Key

1. In the Credentials page, find your service account in the list
2. Click on the service account email
3. Go to the "Keys" tab
4. Click "Add Key" → "Create new key"
5. Select "JSON" format
6. Click "Create"
7. A JSON file will download - **Keep this file secure!**

### Step 5: Add Service Account to GitHub Secrets

1. Open the downloaded JSON file in a text editor
2. Copy the entire contents
3. Go to your GitHub repository
4. Navigate to Settings → Secrets and variables → Actions
5. Click "New repository secret"
6. Name: `GOOGLE_SERVICE_ACCOUNT_KEY`
7. Value: Paste the entire JSON contents
8. Click "Add secret"

### Step 6: Configure Google Drive Folder Permissions

For each Google Drive folder you want to import from:

1. Open the JSON key file you downloaded
2. Find the `client_email` field (looks like: `xxx@xxx.iam.gserviceaccount.com`)
3. Copy this email address
4. In Google Drive, right-click the folder you want to share
5. Click "Share"
6. Paste the service account email
7. Set permission to "Viewer"
8. Click "Share" (uncheck "Notify people" since it's a service account)

**Important:** You must do this for EVERY folder you want to import from!

## 🎯 How to Use

Once setup is complete:

1. Go to your admin panel (`admin.html`)
2. Enter your PIN
3. Click "☁️ Google Drive" in the sidebar
4. Paste your Google Drive folder link
5. Select the category (Track, Soccer, Football, Basketball, or Best Of)
6. Click "IMPORT IMAGES FROM GOOGLE DRIVE"
7. Wait 2-5 minutes for the workflow to complete
8. Refresh your website to see the new images!

## 📝 Supported Google Drive Link Formats

The system accepts these link formats:
- `https://drive.google.com/drive/folders/FOLDER_ID`
- `https://drive.google.com/drive/u/0/folders/FOLDER_ID`
- Direct folder ID: `FOLDER_ID`

## 🔍 Monitoring Progress

To check the import progress:

1. Go to your repository on GitHub
2. Click the "Actions" tab
3. Look for "Google Drive Image Sync" workflow
4. Click on the most recent run to see details and logs

## 🛠️ Troubleshooting

### Error: "GitHub token not found"
**Solution:** Configure your GitHub Personal Access Token in the Configuration panel of the admin interface.

### Error: "GitHub Actions workflow not found"
**Solution:** Make sure the file `.github/workflows/google-drive-sync.yml` exists in your repository.

### Error: "Permission denied" or "File not found"
**Solution:** 
- Make sure you've shared the Google Drive folder with the service account email
- Verify the folder link is correct
- Check that the folder contains image files

### Error: "Invalid credentials"
**Solution:**
- Verify the `GOOGLE_SERVICE_ACCOUNT_KEY` secret is correctly set in GitHub
- Make sure you copied the entire JSON file contents
- Try creating a new service account key

### Images not appearing after import
**Solution:**
- Wait 2-5 minutes for GitHub Pages to rebuild
- Check the Actions tab to confirm the workflow completed successfully
- Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
- Verify images were committed to the repository

### Workflow fails during download
**Solution:**
- Ensure the Google Drive folder is shared with the service account
- Check that the folder contains valid image files (JPG, PNG, GIF)
- Verify Google Drive API is enabled in your Google Cloud project

## 🔒 Security Notes

- The service account key is stored as a GitHub Secret (encrypted and secure)
- The service account only has read-only access to folders you explicitly share
- Never commit the service account JSON file to your repository
- The GitHub token is stored only in your browser's localStorage
- Repository secrets are never exposed in workflow logs

## 💰 Cost

**This solution is 100% FREE:**
- Google Drive API: Free tier includes 10,000 requests per day
- GitHub Actions: Free tier includes 2,000 minutes per month
- For typical usage (10-50 images per import), you'll never hit these limits

## 📊 Workflow Details

When you trigger an import, the workflow:

1. Extracts the folder ID from your link
2. Authenticates with Google Drive using the service account
3. Lists all image files in the folder
4. Downloads each image
5. Optimizes images (compresses JPEGs, converts formats if needed)
6. Saves images to the appropriate category folder (e.g., `images/track/`)
7. Updates `js/config.js` with the new image filenames
8. Commits and pushes changes to the repository
9. GitHub Pages automatically rebuilds your site

## 🎓 Best Practices

1. **Organize folders:** Create separate Google Drive folders for each category
2. **Name images clearly:** Use descriptive filenames (e.g., `track-meet-2024-sprint.jpg`)
3. **Optimize before upload:** While the workflow compresses images, pre-optimizing saves processing time
4. **Test with small folders first:** Try importing 2-3 images before doing bulk imports
5. **Monitor Actions:** Check the Actions tab regularly to ensure imports succeed

## 🔄 Updating Images

To replace or update images:
- The workflow adds new images to the beginning of the gallery
- Existing images remain in place
- To remove old images, use the "Manage Photos" panel in the admin interface

## 📞 Support

If you encounter issues:
1. Check the Troubleshooting section above
2. Review the Actions tab in GitHub for detailed error logs
3. Verify all setup steps were completed correctly
4. Check the ADMIN_GUIDE.md for additional help

## 🚀 Advanced: Manual Workflow Trigger

You can also trigger the workflow manually from GitHub:

1. Go to your repository
2. Click "Actions" tab
3. Select "Google Drive Image Sync" workflow
4. Click "Run workflow"
5. Enter the folder link and category
6. Click "Run workflow"

This is useful for testing or if the admin panel isn't accessible.

---

**Last Updated:** January 2026  
**Version:** 1.0
