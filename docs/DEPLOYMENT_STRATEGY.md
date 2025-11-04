# AR Deployment Strategy

## Multi-Platform AR Support

To reach 100% of users, we use a **three-platform progressive enhancement strategy**:

1. **Meta IWSDK** → Meta Horizon (Quest, Desktop VR)
2. **Universal AR SDK** → Mattercraft by Zappar (Mobile AR - iOS & Android)
3. **8th Wall** → Optional enterprise enhancement (iOS optimization)

See [MULTI_PLATFORM_AR_STRATEGY.md](./MULTI_PLATFORM_AR_STRATEGY.md) for complete platform details.

### Platform Support Matrix

| Platform | Primary Technology | Deployment Target | Support |
|----------|-------------------|-------------------|---------|
| Meta Quest / VR | IWSDK | Meta Horizon | ✅ Native |
| Android Chrome 125+ | Universal AR | Mattercraft | ✅ Native |
| iOS Safari 17+ | Universal AR | Mattercraft | ✅ Native |
| Desktop WebXR | IWSDK | Meta Horizon | ✅ Native |
| 8th Wall (Optional) | 8th Wall SDK | 8th Wall Cloud | ✅ Enhanced |
| Older Browsers | Static Fallback | Web | ⚠️ Limited |

## Implementation Strategy

### 1. Detection Layer

\`\`\`tsx
// Detect AR capabilities on page load
const capabilities = await detectDeviceCapabilities()

switch (capabilities.recommendedSDK) {
  case 'meta-iwsdk':
    // Use IWSDK for VR/Desktop → Deploy to Meta Horizon
    loadIWSDKExperience()
    break
  case 'universal-ar':
    // Use Universal AR for Mobile → Deploy to Mattercraft
    loadUniversalARExperience()
    break
  case '8thwall':
    // Use 8th Wall for enhanced iOS (optional)
    load8thWallExperience()
    break
  default:
    // Show static content with photos/videos
    loadStaticFallback()
}
\`\`\`

### 2. IWSDK Path (Meta Horizon)

**Target Devices:**
- Meta Quest 2/3/Pro
- Desktop VR (SteamVR, Oculus Rift)
- WebXR-compatible browsers

**Technologies:**
- IWSDK Core
- React Three Fiber
- Three.js

**Deployment:**
- Meta Horizon Developer Portal
- Meta Horizon Store (optional)

**Advantages:**
- Hand tracking
- Controller input
- Physics simulation
- Teleportation
- Free hosting

### 3. Universal AR Path (Mattercraft)

**Target Devices:**
- iOS Safari 17+
- Android Chrome 125+
- Mobile web browsers

**Technologies:**
- Universal AR (@zappar/universal-ar)
- Zappar SDK
- Image/Face/Instant tracking

**Deployment:**
- Mattercraft platform
- Zappar CLI
- QR code distribution

**Advantages:**
- iOS Safari support (no WebXR needed)
- Image tracking (cocktail menus)
- Face tracking (photo booth)
- Instant tracking (place objects)
- Mobile-optimized

### 4. 8th Wall Path (Optional Enhancement)

**When to Use:**
- Need custom domain branding
- Require advanced analytics
- Want enterprise support
- iOS performance optimization

**Technologies:**
- 8th Wall SDK
- A-Frame
- react-8thwall-aframe

**Cost:**
- Free tier: Development only (watermark)
- Pro: $99/month (10K scans)
- Enterprise: Custom pricing

### 5. Static Fallback (Unsupported)

**Content:**
- Photo gallery
- Video demos
- 2D menu
- Contact form

## Deployment Environments

### Development
- **URL**: `localhost:3000`
- **IWSDK**: Enabled (Meta Quest Browser testing)
- **Universal AR**: Enabled (Zappar CLI testing)
- **8th Wall**: Requires device authorization
- **Testing**: Use QR codes to test on mobile

### Staging
- **URL**: `staging.yourdomain.com`
- **IWSDK**: Enabled
- **Universal AR**: Enabled
- **8th Wall**: Add to approved domains
- **Testing**: Full QA on all devices

### Production
- **URL**: `yourdomain.com`
- **IWSDK**: Deploy to Meta Horizon
- **Universal AR**: Deploy to Mattercraft
- **8th Wall**: Add to approved domains (if using)
- **Monitoring**: Analytics + error tracking

## QR Code Strategy

Generate QR codes with UTM parameters and deep-link routing:

\`\`\`
https://yourdomain.com?utm_campaign=nov4_event&scene=photo_booth
https://yourdomain.com?utm_campaign=nov4_event&scene=cocktails
https://yourdomain.com?utm_campaign=nov4_event&scene=iwsdk
\`\`\`

Deep-link routing automatically loads the correct AR experience based on device capabilities.

## Performance Optimization

1. **Lazy Loading**: Load AR libraries only when needed
2. **Code Splitting**: Separate IWSDK, Universal AR, and 8th Wall bundles
3. **Asset Optimization**: Compress 3D models and textures
4. **CDN**: Use Vercel Edge Network for global delivery
5. **Caching**: Cache AR assets aggressively
6. **Single Three.js Instance**: Prevent multiple Three.js imports

## Monitoring

Track these metrics:

- AR session starts by platform (IWSDK vs Universal AR vs 8th Wall)
- Success rate by device/browser
- Error rates and fallback usage
- User engagement time
- Photo captures
- Cocktail menu views
- Device distribution (iOS vs Android vs VR)

## Rollout Plan

### Phase 1: IWSDK + Universal AR (Current)
- ✅ Deploy with IWSDK for VR
- ✅ Deploy with Universal AR for mobile
- ⏳ Test on Meta Quest
- ⏳ Test on iOS Safari
- ⏳ Test on Android Chrome
- ⏳ Gather feedback

### Phase 2: Optimize & Monitor (Next)
- Analyze performance data
- Optimize asset loading
- Improve tracking accuracy
- Add new features
- Monitor platform usage split

### Phase 3: 8th Wall (Optional)
- Integrate 8th Wall SDK (if needed)
- Add iOS optimization
- Test enhanced features
- Monitor ROI

## Cost Analysis

### IWSDK Path (Meta Horizon)
- **Development**: $0
- **Deployment**: $0 (Meta Horizon hosting)
- **Distribution**: $0 (direct links) or store fees

### Universal AR Path (Mattercraft)
- **Development**: $0 (free tier)
- **Deployment**: Paid plans for production
- **Distribution**: Included in plan

### 8th Wall Path (Optional)
- **Development**: $0 (free tier)
- **Production**: $99/month (Pro plan)
- **Enterprise**: Custom pricing

### Total Monthly Cost
- **Minimum**: $0 + Mattercraft plan (IWSDK + Universal AR)
- **Enhanced**: $0 + Mattercraft + $99 (add 8th Wall)
- **Enterprise**: Custom (higher limits)

## Decision Matrix

**Use IWSDK + Universal AR (Recommended):**
- Need VR support (Meta Quest)
- Need mobile AR (iOS + Android)
- Want platform agnosticism
- Maximum device coverage
- Cost-effective solution

**Add 8th Wall If:**
- Need custom domain branding
- Require advanced analytics
- Want enterprise support
- iOS performance is critical
- Budget allows $99/month

## Environment Variables

\`\`\`bash
# IWSDK (Meta Horizon)
NEXT_PUBLIC_META_APP_ID=your_meta_app_id

# Universal AR (Mattercraft)
NEXT_PUBLIC_ZAPPAR_PROJECT_KEY=your_zappar_key

# 8th Wall (Optional - configure in Vars section, not in code)
# NEXT_PUBLIC_8THWALL_API_KEY=your_8thwall_key
\`\`\`

**Note:** For 8th Wall integration, add the API key in the **Vars section** of the v0 sidebar, not in client-side code.

## Next Steps

1. ✅ IWSDK implementation complete
2. ✅ Universal AR implementation complete
3. ✅ Multi-platform detection logic
4. ⏳ Deploy to Meta Horizon
5. ⏳ Deploy to Mattercraft
6. ⏳ Test on all target devices
7. ⏳ Generate QR codes
8. ⏳ Monitor and optimize
9. ⏳ Consider 8th Wall (optional)
