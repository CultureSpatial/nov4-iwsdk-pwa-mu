# 8th Wall Integration Guide

## Overview

8th Wall is a WebAR platform that provides cross-platform AR support, including iOS Safari where native WebXR is not available. This makes it an essential fallback for reaching 100% of mobile users.

## Why 8th Wall?

- **iOS Support**: Works on iOS Safari (WebXR doesn't)
- **No App Download**: Runs in mobile browsers
- **Cross-Platform**: iOS, Android, desktop
- **Better Tracking**: Advanced computer vision algorithms
- **63% of millennials** prefer AR interactions (research-backed)

## Integration Options

### Option 1: 8th Wall Cloud Hosting
- Hosted on 8th Wall's global CDN
- Instant previews and publishing
- Default URL: `yourworkspace.8thwall.app/project-name`
- Can connect custom domains
- **Best for**: Quick deployment, testing

### Option 2: Self-Hosted (Pro/Enterprise)
- Host on your own domain (Vercel, etc.)
- Full control over deployment
- Requires domain whitelisting in 8th Wall dashboard
- **Best for**: Production, custom infrastructure

## Setup Instructions

### 1. Create 8th Wall Account

1. Go to [8thwall.com](https://www.8thwall.com)
2. Click "Create for Free"
3. Create a workspace (choose workspace URL carefully - can't change later)

### 2. Create Project

1. In 8th Wall dashboard, create a new project
2. Choose project name (used in URL, can't change later)
3. Copy the **App Key** from project settings

### 3. Add to Next.js App

Install the React integration package:

\`\`\`bash
npm install react-8thwall-aframe
\`\`\`

Add to your layout:

\`\`\`tsx
// app/layout.tsx
import { XR8Scripts } from 'react-8thwall-aframe'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <XR8Scripts xr8ApiKey={process.env.NEXT_PUBLIC_8THWALL_APP_KEY} />
      </head>
      <body>{children}</body>
    </html>
  )
}
\`\`\`

Use in components:

\`\`\`tsx
import { useXR8Ready } from 'react-8thwall-aframe'

function ARComponent() {
  const { xrReady, dracoReady, error } = useXR8Ready()
  
  if (error) return <div>Error: {error.message}</div>
  if (!xrReady || !dracoReady) return <div>Loading AR...</div>
  
  return (
    <a-scene>
      {/* Your A-Frame AR content */}
    </a-scene>
  )
}
\`\`\`

### 4. Self-Hosting Setup (Optional)

For self-hosting on Vercel or custom domain:

1. In 8th Wall dashboard, go to Project Settings
2. Click "Setup domains"
3. Expand "Setup this project for self-hosting"
4. Add your domain(s):
   - `yourdomain.com`
   - `www.yourdomain.com`
   - `localhost:3000` (for local dev)
5. Note: Domains are subdomain-specific, no wildcards

### 5. Environment Variables

Add to Vercel environment variables (or `.env.local`):

\`\`\`bash
NEXT_PUBLIC_8THWALL_APP_KEY=your_app_key_here
\`\`\`

## Fallback Strategy

Implement progressive enhancement:

\`\`\`tsx
// lib/ar-detection.ts
export async function detectARSupport() {
  // Check for native WebXR first
  if ('xr' in navigator) {
    try {
      const supported = await navigator.xr.isSessionSupported('immersive-ar')
      if (supported) return 'webxr'
    } catch (e) {
      console.log('WebXR not available')
    }
  }
  
  // Fallback to 8th Wall
  if (window.XR8) {
    return '8thwall'
  }
  
  // No AR support
  return 'none'
}
\`\`\`

## Deployment Checklist

- [ ] Create 8th Wall account and workspace
- [ ] Create project and copy App Key
- [ ] Add App Key to environment variables
- [ ] Add production domain to approved domains list
- [ ] Test on iOS Safari
- [ ] Test on Android Chrome
- [ ] Verify camera permissions work
- [ ] Test QR code scanning flow
- [ ] Monitor 8th Wall usage dashboard

## Pricing

- **Free**: Development and testing (watermark)
- **Pro**: $99/month - Self-hosting, remove watermark, 10K scans/month
- **Enterprise**: Custom pricing - Higher limits, priority support

## Resources

- [8th Wall Documentation](https://8thwall.com/docs/)
- [React Integration Package](https://github.com/devhims/react-8thwall-aframe)
- [Quick Start Guide](https://8thwall.com/docs/legacy/getting-started/quick-start-guide/)
- [Self-Hosted Domains](https://8thwall.com/docs/legacy/guides/projects/self-hosted-domains/)

## Support

For issues with 8th Wall integration:
1. Check 8th Wall console for errors
2. Verify domain is whitelisted
3. Confirm App Key is correct
4. Check device authorization for testing
5. Contact 8th Wall support: support@8thwall.com
