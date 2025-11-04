# Deployment Guide - Nov 4 IWSDK PWA

## Pre-Deployment Checklist

- [ ] All environment variables configured in Vercel
- [ ] Vercel Analytics enabled on project
- [ ] Customer.io integration tested (if using)
- [ ] PWA manifest and icons verified
- [ ] WebXR functionality tested on target devices
- [ ] Health check endpoint responding
- [ ] Version endpoint showing correct build info

## Deployment Steps

### 1. Connect GitHub Repository to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import `CultureSpatial/nov4-iwsdk-pwa`
3. Configure project settings:
   - **Framework Preset:** Next.js
   - **Root Directory:** ./
   - **Build Command:** `pnpm build` (or `npm run build`)
   - **Output Directory:** .next

### 2. Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

\`\`\`
NEXT_PUBLIC_CUSTOMERIO_SITE_ID=your_site_id
CUSTOMERIO_API_KEY=your_api_key
NEXT_PUBLIC_ENABLE_PHOTO_BOOTH=true
NEXT_PUBLIC_ENABLE_COCKTAIL_MENU=true
NEXT_PUBLIC_ENABLE_POLLS=true
NEXT_PUBLIC_ENABLE_QA=true
NEXT_PUBLIC_EVENT_DATE=2025-11-04
NEXT_PUBLIC_EVENT_NAME=nov4_event
\`\`\`

### 3. Enable Vercel Analytics

1. Go to project → Analytics tab
2. Enable Web Analytics
3. `NEXT_PUBLIC_VERCEL_ANALYTICS_ID` will be auto-provided

### 4. Deploy

\`\`\`bash
git push origin main
\`\`\`

Vercel will automatically build and deploy.

## Post-Deployment Verification

### 1. Health Check

\`\`\`bash
curl https://your-domain.vercel.app/api/health
\`\`\`

Expected response:
\`\`\`json
{
  "status": "healthy",
  "timestamp": "2025-11-04T...",
  "uptime": 123.45,
  "version": "1.0.0",
  "commit": "abc123"
}
\`\`\`

### 2. Version Check

\`\`\`bash
curl https://your-domain.vercel.app/api/version
\`\`\`

### 3. Analytics Verification

1. Visit the deployed site
2. Check Vercel Analytics dashboard
3. Verify custom events are being tracked

### 4. PWA Installation Test

**iOS Safari:**
1. Open site in Safari
2. Tap Share button
3. Tap "Add to Home Screen"
4. Verify app opens in standalone mode

**Android Chrome:**
1. Open site in Chrome
2. Tap "Install" prompt or menu → "Install app"
3. Verify app opens in standalone mode

### 5. WebXR Functionality Test

1. Open app on WebXR-compatible device
2. Grant camera permissions
3. Verify AR experience loads
4. Test photo booth and menu interactions

## Monitoring

### Real-Time Monitoring

- **Vercel Analytics:** [vercel.com/dashboard/analytics](https://vercel.com/dashboard/analytics)
- **Health Endpoint:** `https://your-domain.vercel.app/api/health`
- **Customer.io Dashboard:** Track engagement events

### Key Metrics to Monitor

- Session start/end events
- Photo booth usage
- Menu interactions
- Technical interruptions
- Engagement scores
- Frame rate and tracking accuracy

## Rollback Procedure

If issues occur during the event:

1. Go to Vercel Dashboard → Deployments
2. Find the last stable deployment
3. Click "..." → "Promote to Production"
4. Verify rollback with health check

## Feature Flags

Toggle features without redeployment:

\`\`\`bash
# Disable photo booth
vercel env add NEXT_PUBLIC_ENABLE_PHOTO_BOOTH false

# Redeploy
vercel --prod
\`\`\`

## Troubleshooting

### PWA Not Installing

- Verify manifest.json is accessible
- Check HTTPS is enabled
- Ensure service worker is registered

### Analytics Not Tracking

- Verify `NEXT_PUBLIC_VERCEL_ANALYTICS_ID` is set
- Check browser console for errors
- Confirm Analytics is enabled in Vercel dashboard

### WebXR Not Working

- Verify device compatibility (iOS Safari 17+, Android Chrome 125+)
- Check camera permissions granted
- Test 2D fallback mode

### Performance Issues

- Check frame rate metrics in analytics
- Verify asset sizes are optimized
- Monitor network latency events

## Day-of Event Checklist

**1 Hour Before:**
- [ ] Verify deployment is live
- [ ] Test QR code entry flow
- [ ] Confirm analytics tracking
- [ ] Check health endpoint
- [ ] Test on multiple devices

**During Event:**
- [ ] Monitor Vercel Analytics dashboard
- [ ] Watch for technical interruption events
- [ ] Track engagement metrics in real-time
- [ ] Have rollback plan ready

**After Event:**
- [ ] Export analytics data
- [ ] Review engagement scores
- [ ] Analyze user journey in Customer.io
- [ ] Document any issues for post-mortem

## Support Contacts

- **Vercel Support:** [vercel.com/help](https://vercel.com/help)
- **CultureSpatial Team:** [contact info]

## Additional Resources

- [Vercel Deployment Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [PWA Best Practices](https://web.dev/progressive-web-apps/)
