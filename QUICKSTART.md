# 🚀 Quick Start Guide - Get Up and Running in 10 Minutes

This guide will get you from zero to deployed in about 10 minutes.

## What You're Building

A free photography portfolio with:
- ✅ Admin dashboard for managing photos
- ✅ Direct browser-to-cloud uploads
- ✅ Public gallery pages
- ✅ No monthly costs (100% free forever)

---

## Step 1: Prerequisites (1 minute)

You'll need free accounts for:
1. **GitHub** - [github.com](https://github.com) (to store code)
2. **Supabase** - [supabase.com](https://supabase.com) (database & storage)
3. **Vercel** - [vercel.com](https://vercel.com) (hosting)

All three are completely free, no credit card required.

---

## Step 2: Set Up Supabase (5 minutes)

### 2.1 Create Project
1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Name it: `cooper-portfolio` (or your name)
4. Set a strong database password (save it somewhere safe)
5. Choose a region close to you
6. Click **"Create Project"** (takes ~2 minutes)

### 2.2 Create Database Tables
1. Click **"SQL Editor"** in the left sidebar
2. Click **"New Query"**
3. Copy and paste this SQL:

```sql
-- Images table
CREATE TABLE images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  storage_path TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('track', 'soccer', 'football', 'basketball', 'best-of')),
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  "order" INTEGER DEFAULT 0,
  visibility TEXT DEFAULT 'draft' CHECK (visibility IN ('public', 'draft')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Featured images table
CREATE TABLE featured_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_id UUID REFERENCES images(id) ON DELETE CASCADE,
  "order" INTEGER DEFAULT 0,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_images_category ON images(category);
CREATE INDEX idx_images_visibility ON images(visibility);
CREATE INDEX idx_images_order ON images("order");
CREATE INDEX idx_featured_images_order ON featured_images("order");
```

4. Click **"Run"** (or press Ctrl+Enter)
5. You should see "Success. No rows returned"

### 2.3 Create Storage Bucket
1. Click **"Storage"** in the left sidebar
2. Click **"Create a new bucket"**
3. Name: `images`
4. Make it **Public** (toggle the switch)
5. Click **"Create bucket"**

### 2.4 Set Storage Policies
1. Click on the `images` bucket you just created
2. Click **"Policies"** tab
3. Click **"New Policy"** → **"For full customization"**
4. Choose: **"SELECT"** operation
5. Policy name: `Public Access`
6. Target roles: Leave blank (public)
7. USING expression: `true`
8. Click **"Review"** then **"Save policy"**

### 2.5 Get Your Credentials
1. Click **"Settings"** (gear icon) → **"API"**
2. Copy these two values (you'll need them):
   - **Project URL** (looks like: `https://xxx.supabase.co`)
   - **anon public key** (long string starting with `eyJ...`)

---

## Step 3: Set Up Your Code (2 minutes)

### 3.1 Clone Repository
```bash
git clone https://github.com/CooperHofmann/cooperofthecrop.github.io.git
cd cooperofthecrop.github.io
```

### 3.2 Install Dependencies
```bash
npm install
```

### 3.3 Configure Environment
1. Create a file called `.env.local` in the root directory
2. Add your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace `your-project-url-here` and `your-anon-key-here` with the values you copied from Supabase.

### 3.4 Test Locally
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You should see your portfolio!

---

## Step 4: Deploy to Vercel (2 minutes)

### 4.1 Push to GitHub
If you haven't already:
```bash
git add .
git commit -m "Initial setup"
git push origin main
```

### 4.2 Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js
5. Click **"Environment Variables"** dropdown
6. Add your Supabase credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`: your-project-url
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: your-anon-key
7. Click **"Deploy"**

Wait ~2 minutes for deployment. You'll get a URL like: `https://your-project.vercel.app`

---

## Step 5: Upload Your First Photo (1 minute)

1. Go to your deployed site: `https://your-project.vercel.app`
2. Click **"Admin Access"** at the bottom
3. Click **"Upload"** in the sidebar
4. Select a category (e.g., "Track & Field")
5. Drag and drop a photo or click to browse
6. Wait for upload to complete
7. Go to **"Galleries"** to see your photo
8. Click the photo → Click **"👁️ Draft"** to make it **"Public"**
9. Go back to home page and view your gallery!

---

## 🎉 You're Done!

Your portfolio is now live and free forever!

### What You Can Do Now

1. **Upload more photos** - Via the admin panel
2. **Organize categories** - Track, Soccer, Football, Basketball
3. **Curate Best Of** - Highlight your top shots
4. **Share your URL** - Give it to friends, put it on your resume
5. **Customize** - Edit code to match your style

### Need Help?

- Check **README.md** for detailed documentation
- Check **DEPLOYMENT.md** for deployment tips
- Check **GitHub Issues** for community help

---

## 💰 Cost Reminder

- **Vercel**: $0/month (100GB bandwidth)
- **Supabase**: $0/month (500MB storage, 2GB bandwidth)
- **Total**: **$0/month forever**

No hidden costs. No credit card. No subscriptions.

---

## 🎯 Next Steps

- **Add more photos** - Build your portfolio
- **Customize design** - Edit colors in `app/globals.css`
- **Add custom domain** - Optional, ~$10/year
- **Add authentication** - Protect admin panel (see README.md)
- **Share with friends** - Show off your work!

---

**Enjoy your free photography portfolio! 📸**
