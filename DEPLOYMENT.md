# Deployment Guide - Vercel (Free Tier)

This guide will help you deploy your Cooper of the Crop portfolio to Vercel for free.

## Prerequisites

- GitHub account with your repository
- Vercel account (sign up at [vercel.com](https://vercel.com) - it's free!)
- Supabase project set up (see main README.md)

## Step 1: Prepare Your Repository

Ensure your code is pushed to GitHub:

```bash
git add .
git commit -m "Ready for deployment"
git push
```

## Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js - click **"Deploy"** for now

## Step 3: Configure Environment Variables

After the first deployment (it will fail without env vars):

1. Go to your project settings in Vercel
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Make sure to select **Production**, **Preview**, and **Development** for each variable

## Step 4: Redeploy

1. Go to **Deployments** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. Your site should now build successfully!

## Step 5: Custom Domain (Optional)

Vercel provides a free `.vercel.app` domain, but you can add a custom domain:

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Vercel provides free SSL certificates automatically

## Vercel Free Tier Limits

The free tier is generous and perfect for this project:

- ✅ 100 GB bandwidth per month
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Preview deployments for each PR
- ✅ No credit card required

## Automatic Deployments

Every time you push to your main branch:
- Vercel automatically builds and deploys
- Takes about 1-2 minutes
- You'll get a notification when it's live

## Preview Deployments

When you create a pull request:
- Vercel creates a preview deployment
- You can test changes before merging
- Each PR gets a unique URL

## Troubleshooting

### Build Fails

**Error**: Missing environment variables
- **Solution**: Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel settings

**Error**: Build timeout
- **Solution**: The free tier has a 15-minute build limit (you should be well under this)

**Error**: TypeScript errors
- **Solution**: Fix type errors locally first, then redeploy

### Images Not Loading

**Error**: Images return 404
- **Solution**: Verify Supabase Storage bucket is public
- **Solution**: Check RLS policies allow public read access

### Slow Performance

- Vercel's free tier is serverless and may have cold starts
- First load might be slower, subsequent loads are fast
- Consider enabling Supabase CDN for images

## Monitoring

Vercel provides free analytics:

1. Go to **Analytics** tab
2. View page views, performance metrics
3. Monitor Core Web Vitals

## Cost Summary

- **Vercel**: $0/month (free tier)
- **Supabase**: $0/month (free tier up to 500MB storage, 2GB bandwidth)
- **Domain** (optional): ~$10/year if you want custom domain
- **Total**: FREE (or ~$10/year with custom domain)

## Security Notes

1. **Never commit** `.env.local` to git (it's in .gitignore)
2. **Use environment variables** in Vercel for secrets
3. **RLS policies** in Supabase protect your data
4. **Anon key** is safe to expose (it's public-facing)

## Next Steps

After deployment:

1. Test upload functionality
2. Upload some photos via admin panel
3. Verify they appear on public pages
4. Share your portfolio URL!

## Support

- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Supabase: [supabase.com/docs](https://supabase.com/docs)
- Next.js: [nextjs.org/docs](https://nextjs.org/docs)

---

**Remember**: Everything is free! No hidden costs, no credit card required.
