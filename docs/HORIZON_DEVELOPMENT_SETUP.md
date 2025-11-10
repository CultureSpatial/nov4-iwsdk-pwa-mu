# Meta Horizon Development Setup Guide

## Prerequisites

### System Requirements
- **Windows PC** (Desktop Editor is Windows-only)
- **Meta Quest Headset** (Quest 2, Quest 3, or Quest Pro) for VR testing
- **Smartphone** (iOS 17+ or Android Chrome 125+) for mobile testing
- **Meta Account** with creator access

## Step 1: Install Desktop Editor

1. **Download Desktop Editor**
   - Visit: https://fb.me/worlds_desktop_editor
   - Download and install Windows application

2. **Create Meta Developer Account**
   - Go to: https://developers.meta.com/horizon-worlds/
   - Sign in with Meta account
   - Accept creator terms

3. **Link Quest Headset**
   - Enable Developer Mode on Quest
   - Connect Quest to same WiFi as PC
   - Pair headset in Desktop Editor

## Step 2: Create First World

1. **New World Setup**
   \`\`\`
   Desktop Editor → File → New World
   Name: "Wicked Cocktails AR Test"
   Target Platforms: Mobile, VR, Web
   \`\`\`

2. **Configure World Settings**
   - Max players: 20 (for event capacity)
   - Entry point: Emerald City themed spawn
   - Lighting: Evening/night theme

## Step 3: Import Assets

### 3D Models (From Current PWA)

1. **Export from Three.js**
   - Current GLB models need FBX conversion
   - Use Blender for conversion:
     \`\`\`
     File → Import → glTF 2.0 (.glb)
     File → Export → FBX (.fbx)
     \`\`\`

2. **Import to Horizon**
   \`\`\`
   Desktop Editor → Asset Library → Import
   Select .fbx files
   Configure materials and textures
   \`\`\`

3. **Cocktail Models**
   - Elphaba's Elixir model
   - Glinda's Sparkle model
   - Oz Old Fashioned model
   - Wicked Witch's Brew model
   - Yellow Brick Road model

### Textures & Materials
- Import PNG/JPG textures
- Emerald glow materials
- Glass and liquid shaders
- UI panel textures

### Audio Assets
- Background ambient audio
- UI interaction sounds
- Cocktail selection sounds

## Step 4: TypeScript Development

### Setup IDE Integration

1. **Install Visual Studio Code**
   - Download: https://code.visualstudio.com/

2. **Add IDE to Desktop Editor**
   \`\`\`
   Desktop Editor → Edit → Preferences → IDE
   Select VS Code path
   Enable hot reload
   \`\`\`

3. **TypeScript Configuration**
   - Horizon provides types automatically
   - IntelliSense enabled
   - Debugging via Desktop Editor console

### Create Component Scripts

1. **New TypeScript Component**
   \`\`\`
   Desktop Editor → Create → Script Component
   Name: "CocktailMenuController"
   \`\`\`

2. **Basic Component Template**
   \`\`\`typescript
   import { Component, Type } from "horizon/core"
   
   class CocktailMenuController extends Component<typeof CocktailMenuController> {
     static propsDefinition = {
       // Define properties here
     }
     
     start() {
       // Initialize component
     }
     
     update() {
       // Per-frame updates
     }
   }
   
   Component.register(CocktailMenuController)
   \`\`\`

## Step 5: Build Interactive Features

### Hand Tracking (VR)
\`\`\`typescript
import { HandTracking } from "horizon/input"

class HandGestureController extends Component<typeof HandGestureController> {
  start() {
    HandTracking.onPinch((hand) => {
      this.selectCocktail()
    })
  }
}
\`\`\`

### Touch Controls (Mobile)
\`\`\`typescript
import { Touch } from "horizon/input"

class TouchController extends Component<typeof TouchController> {
  start() {
    Touch.onTap((position) => {
      this.handleTap(position)
    })
  }
}
\`\`\`

### Photo Capture
\`\`\`typescript
import { Camera } from "horizon/core"

class PhotoBoothController extends Component<typeof PhotoBoothController> {
  capturePhoto() {
    const screenshot = Camera.captureScreenshot()
    this.applyFrame(screenshot)
    this.saveToGallery(screenshot)
  }
}
\`\`\`

## Step 6: Testing

### Desktop Editor Preview
- F5 to launch preview
- Test basic interactions
- Debug TypeScript errors

### Mobile Testing
1. **Enable Mobile Preview**
   \`\`\`
   Desktop Editor → Publish → Mobile Preview
   Scan QR code with smartphone
   \`\`\`

2. **Test Mobile Features**
   - Touch interactions
   - Performance
   - UI scaling
   - Device orientation

### Quest VR Testing
1. **Deploy to Quest**
   \`\`\`
   Desktop Editor → Publish → Quest Preview
   Put on headset
   World loads automatically
   \`\`\`

2. **Test VR Features**
   - Hand tracking
   - Controller input
   - Teleportation
   - 3D UI interactions

### Web Testing
1. **Publish to Web**
   \`\`\`
   Desktop Editor → Publish → Web Preview
   Copy preview URL
   Open in browser
   \`\`\`

2. **Test Web Features**
   - Mouse/keyboard controls
   - WebXR (if supported)
   - UI responsiveness

## Step 7: External Integrations

### Customer.io Analytics

Since Horizon limits external network calls, use a proxy approach:

1. **Create Proxy API**
   \`\`\`typescript
   // In your Vercel deployment (keep existing Next.js API)
   // POST /api/horizon-analytics
   
   export async function POST(request: Request) {
     const { eventType, userId, properties } = await request.json()
     
     // Forward to Customer.io
     await fetch('/api/track', {
       method: 'POST',
       body: JSON.stringify({ eventType, userId, properties })
     })
     
     return Response.json({ success: true })
   }
   \`\`\`

2. **Call from Horizon**
   \`\`\`typescript
   class AnalyticsController extends Component<typeof AnalyticsController> {
     async trackEvent(eventType: string, properties: object) {
       await fetch('https://your-domain.vercel.app/api/horizon-analytics', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           eventType,
           userId: this.getUserId(),
           properties
         })
       })
     }
   }
   \`\`\`

## Step 8: Deployment

### Publish to Meta Horizon

1. **Prepare for Publication**
   \`\`\`
   Desktop Editor → World → Validate
   Fix any errors or warnings
   Optimize performance
   \`\`\`

2. **Set World Details**
   - Title: "Wicked Emerald City Cocktails AR"
   - Description: Event details
   - Thumbnail: Screenshot of experience
   - Category: Social, Entertainment
   - Tags: Wicked, AR, Cocktails, Event

3. **Publish World**
   \`\`\`
   Desktop Editor → Publish → Publish World
   Select platforms: Mobile, VR, Web
   Set visibility: Public/Unlisted/Private
   \`\`\`

4. **Get Share URLs**
   - Mobile: `horizon.meta.com/worlds/YOUR_WORLD_ID` (mobile browser)
   - VR: Opens directly in Quest headset
   - Web: Works in WebXR browsers

### Custom Domain (Enterprise Only)

If on Enterprise plan:
1. Configure custom domain in Meta dashboard
2. Point DNS to Meta servers
3. Access via: `cocktails.yourdomain.com`

### QR Code Generation

Update current QR code generator to use Horizon URLs:

\`\`\`typescript
// lib/qr-generator.ts
export function generateHorizonQRCode(worldId: string) {
  const mobileUrl = `https://horizon.meta.com/worlds/${worldId}`
  const withUTM = `${mobileUrl}?utm_campaign=nov4_event`
  
  return {
    qrCodeData: withUTM,
    mobileUrl: mobileUrl,
    vrUrl: `horizon://world/${worldId}` // Deep link for Quest
  }
}
\`\`\`

## Step 9: Performance Optimization

### Use Performance Tools
\`\`\`
Desktop Editor → Tools → Performance Monitor
\`\`\`

Monitor:
- Frame rate (target: 72fps VR, 60fps mobile)
- CPU usage
- GPU usage
- Memory allocation
- Script execution time

### Optimization Checklist
- [ ] Reduce polygon count on models
- [ ] Optimize textures (compress, resize)
- [ ] Minimize script complexity
- [ ] Use object pooling for repeated elements
- [ ] Implement level-of-detail (LOD)
- [ ] Profile and eliminate bottlenecks

## Step 10: Event Day Operations

### Pre-Event Checklist
- [ ] World published and tested
- [ ] QR codes printed with Horizon URL
- [ ] Quest headset charged and ready
- [ ] Mobile preview tested on both iOS/Android
- [ ] Analytics webhook verified
- [ ] Support contact info added to world

### Live Monitoring
- Check performance metrics in real-time
- Monitor user count
- Track analytics events
- Have backup plan if platform issues

### Post-Event
- Export analytics data
- Gather user feedback
- Review performance logs
- Plan updates based on feedback

## Troubleshooting

### Common Issues

**Desktop Editor won't launch**
- Verify Windows version compatibility
- Check graphics drivers updated
- Run as administrator

**Assets won't import**
- Check file format (FBX, PNG, JPG only)
- Verify file size limits
- Ensure valid mesh topology

**TypeScript errors**
- Check Horizon API documentation
- Verify component registration
- Use Desktop Editor console for debugging

**Mobile preview not loading**
- Verify same WiFi network
- Check firewall settings
- Try different smartphone browser

**Quest preview not deploying**
- Enable Developer Mode on Quest
- Check USB connection
- Verify Meta account linked

## Resources

- Desktop Editor Docs: https://developers.meta.com/horizon-worlds/learn/documentation/desktop-editor/
- TypeScript API: https://developers.meta.com/horizon-worlds/learn/documentation/typescript/
- Community Forum: https://communityforums.atmeta.com/
- Support: https://developers.meta.com/support/

## Next Steps After Setup

1. Create prototype cocktail menu
2. Test photo booth capture
3. Implement analytics tracking
4. Conduct user testing session
5. Iterate based on feedback
6. Prepare for event deployment
