# AR Deployment Strategy

## Multi-Platform AR Support

To reach 100% of users, we use a progressive enhancement strategy:

### Platform Support Matrix

| Platform | Technology | Support |
|----------|-----------|---------|
| Android Chrome 125+ | WebXR (IWSDK/Universal AR) | ✅ Native |
| iOS Safari 17+ | 8th Wall | ✅ Fallback |
| Desktop | WebXR | ✅ Native |
| Older Browsers | Static Fallback | ⚠️ Limited |

## Implementation Strategy

### 1. Detection Layer

\`\`\`tsx
// Detect AR capabilities on page load
const arSupport = await detectARSupport()

switch (arSupport) {
  case 'webxr':
    // Use IWSDK + Universal AR (best experience)
    loadWebXRExperience()
    break
  case '8thwall':
    // Use 8th Wall (iOS fallback)
    load8thWallExperience()
    break
  default:
    // Show static content with photos/videos
    loadStaticFallback()
}
\`\`\`

### 2. WebXR Path (Android, Desktop)

**Technologies:**
- IWSDK Core
- Universal AR (@zappar/universal-ar)
- React Three Fiber
- Three.js

**Advantages:**
- No external dependencies
- Best performance
- Full control
- Free

### 3. 8th Wall Path (iOS)

**Technologies:**
- 8th Wall SDK
- A-Frame
- react-8thwall-aframe

**Advantages:**
- iOS Safari support
- Proven reliability
- Advanced tracking
- Enterprise support

**Cost:**
- Free tier: Development only (watermark)
- Pro: $99/month (10K scans)
- Enterprise: Custom pricing

### 4. Static Fallback (Unsupported)

**Content:**
- Photo gallery
- Video demos
- 2D menu
- Contact form

## Deployment Environments

### Development
- **URL**: `localhost:3000`
- **WebXR**: Enabled (with permissions policy)
- **8th Wall**: Requires device authorization
- **Testing**: Use QR codes to test on mobile

### Staging
- **URL**: `staging.yourdomain.com`
- **WebXR**: Enabled
- **8th Wall**: Add to approved domains
- **Testing**: Full QA on all devices

### Production
- **URL**: `yourdomain.com`
- **WebXR**: Enabled
- **8th Wall**: Add to approved domains
- **Monitoring**: Analytics + error tracking

## QR Code Strategy

Generate QR codes with UTM parameters:

\`\`\`
https://yourdomain.com?utm_campaign=nov4_event&scene=photo_booth
https://yourdomain.com?utm_campaign=nov4_event&scene=cocktails
\`\`\`

Deep-link routing automatically loads the correct AR experience.

## Performance Optimization

1. **Lazy Loading**: Load AR libraries only when needed
2. **Code Splitting**: Separate WebXR and 8th Wall bundles
3. **Asset Optimization**: Compress 3D models and textures
4. **CDN**: Use Vercel Edge Network for global delivery
5. **Caching**: Cache AR assets aggressively

## Monitoring

Track these metrics:

- AR session starts by platform
- Success rate (WebXR vs 8th Wall)
- Error rates by device/browser
- User engagement time
- Photo captures
- Cocktail menu views

## Rollout Plan

### Phase 1: WebXR Only (Current)
- Deploy with IWSDK + Universal AR
- Test on Android devices
- Gather feedback

### Phase 2: Add 8th Wall (Next)
- Integrate 8th Wall SDK
- Add iOS fallback detection
- Test on iOS Safari
- Monitor usage split

### Phase 3: Optimize (Ongoing)
- Analyze performance data
- Optimize asset loading
- Improve tracking accuracy
- Add new features

## Cost Analysis

### WebXR Path
- **Cost**: $0
- **Hosting**: Vercel (included)
- **Bandwidth**: Vercel (included)

### 8th Wall Path
- **Development**: $0 (free tier)
- **Production**: $99/month (Pro plan)
- **Enterprise**: Custom (if needed)

### Total Monthly Cost
- **Minimum**: $0 (WebXR only, no iOS)
- **Recommended**: $99 (WebXR + 8th Wall, full coverage)
- **Enterprise**: $99+ (higher limits)

## Decision Matrix

**Use WebXR Only If:**
- Budget is $0
- Target audience is Android-only
- Event is short-term/one-time

**Use WebXR + 8th Wall If:**
- Need iOS support (63% of millennials)
- Professional/commercial event
- Long-term deployment
- Maximum reach required

## Next Steps

1. ✅ WebXR implementation complete
2. ⏳ Add 8th Wall integration
3. ⏳ Implement detection/fallback logic
4. ⏳ Test on all target devices
5. ⏳ Deploy to production
6. ⏳ Monitor and optimize
