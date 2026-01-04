# Cooper of the Crop - Admin Dashboard & Upload System

A free, Next.js-based photography portfolio with admin dashboard and direct browser-to-Supabase upload system.

## 🎯 Project Philosophy

This project is built with **strict free-tier constraints**:
- ✅ 100% free forever
- ✅ No paid plans, trials, or credits
- ✅ No credit card requirements
- ✅ Only free-tier services

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Hosting**: Vercel (free tier)
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (free tier)
- **Storage**: Supabase Storage (free tier)
- **Auth**: Supabase Auth (free tier)

## 🚀 Getting Started

### 1. Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier)
- A Vercel account (free tier)

### 2. Clone the Repository

```bash
git clone https://github.com/CooperHofmann/cooperofthecrop.github.io.git
cd cooperofthecrop.github.io
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Project Settings** → **API**
3. Copy your Project URL and anon key

#### Create Database Tables

Run this SQL in the Supabase SQL Editor:

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

-- Featured images (Best Of references)
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

#### Create Storage Bucket

1. Go to **Storage** in Supabase
2. Create a new bucket called `images`
3. Set it to **Public** (so images can be viewed)
4. Configure RLS policies:

```sql
-- Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Allow authenticated uploads (if you add auth later)
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'images');
```

### 4. Configure Environment Variables

Create `.env.local` in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your site.

### 6. Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables (same as `.env.local`)
5. Deploy!

## 📁 Project Structure

```
/app
  /admin              # Admin dashboard
    /dashboard        # Stats and overview
    /upload           # Photo upload page
    /galleries        # Gallery management
    /best-of          # Best Of curation
    /settings         # Settings
  /gallery
    /[category]       # Public gallery pages
  page.tsx            # Public home page
/components
  /admin              # Admin UI components
/lib
  /supabase           # Supabase client & types
/public
  /images             # Static images
```

## 🎨 Design System

**Brutalist Aesthetic**:
- White/off-white backgrounds
- Near-black text (#0A0A0A)
- Strong typography hierarchy
- Large spacing
- Borders instead of shadows
- No glassmorphism or gradients
- Minimal animations only

## 📤 Upload Architecture

**Direct Browser-to-Supabase Upload**:
- Files upload directly from browser to Supabase Storage
- No server proxy (Vercel API routes not used)
- **Automatic image optimization** to save storage space
- Images compressed to max 2048px (85% JPEG quality)
- Typical 70-90% file size reduction while maintaining quality

**Features**:
- ✅ Drag & drop
- ✅ Batch uploads
- ✅ **Client-side image compression** (no backend needed)
- ✅ Upload progress bars
- ✅ Retry on failure
- ✅ Cancel upload
- ✅ Instant previews
- ✅ Editable metadata

## 🖼️ Image Categories

- **Track & Field** - Track & field photography
- **Soccer** - Soccer photography
- **Football** - Football photography
- **Basketball** - Basketball photography
- **Best Of** - Featured collection (references existing images, no duplicates)

## 🔐 Security Notes

- Currently no authentication implemented
- Add Supabase Auth for production use
- RLS policies should be configured for your use case
- Don't commit `.env.local` to git

## 📊 Database Schema

### `images` table
- `id` - Unique image ID
- `storage_path` - Path in Supabase Storage
- `category` - Image category
- `width` / `height` - Image dimensions
- `order` - Display order
- `visibility` - public or draft
- `created_at` - Upload timestamp

### `featured_images` table
- `id` - Unique ID
- `image_id` - References images table
- `order` - Display order in Best Of
- `enabled` - Show/hide toggle
- `created_at` - Creation timestamp

## 🚫 Do NOT

- ❌ Use paid services
- ❌ Store images in GitHub
- ❌ Proxy files through Vercel
- ❌ Add artificial file size limits
- ❌ Use heavy UI libraries
- ❌ Add drop shadows or glassmorphism
- ❌ Over-animate the UI

## 📝 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🆘 Troubleshooting

**Images not uploading?**
- Check Supabase environment variables
- Verify Storage bucket exists and is public
- Check browser console for errors

**Database errors?**
- Verify tables are created
- Check RLS policies
- Ensure anon key has correct permissions

**Build errors?**
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version (18+ required)

## 📄 License

MIT

## 🙏 Credits

Built with:
- Next.js
- Supabase
- Tailwind CSS
- TypeScript

Design inspired by:
- [Botronics](https://www.botronics.be/)
- Apple editorial UI
- Modern brutalism

---

**Built to be free forever. No subscriptions. No paid plans. Just photography.**
