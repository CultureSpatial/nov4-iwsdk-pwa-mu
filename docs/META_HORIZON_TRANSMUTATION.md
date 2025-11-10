# Meta Horizon Worlds - Complete Transmutation Plan

## Executive Summary

Meta Horizon Desktop Editor enables deployment to **mobile, VR, and web** from a single TypeScript codebase. This makes it a viable alternative platform that can potentially replace or augment the current multi-SDK approach (IWSDK + Universal AR + 8th Wall).

## Platform Capabilities

### Meta Horizon Desktop Editor
- **Single development environment** for mobile, VR, and web
- **TypeScript scripting** for interactive logic
- **GenAI tools** for 3D mesh, texture, audio, and code generation
- **Custom 3D import** (FBX, PNG from Blender/Maya)
- **NPCs with locomotion** and built-in animations
- **Performance profiling** for CPU/GPU optimization
- **Mobile world creation** with dedicated tutorials

### Deployment Targets
1. **VR**: Meta Quest headsets (primary platform)
2. **Mobile**: iOS and Android smartphone browsers
3. **Web**: Desktop browsers with WebXR support
4. **MR**: Mixed reality experiences on Quest 3

## Current vs. Horizon Architecture

### Current Multi-Platform Stack
\`\`\`
┌─────────────────────────────────────────┐
│ Next.js PWA (React/TypeScript)          │
├─────────────────────────────────────────┤
│ Platform Detection Layer                │
├──────────┬──────────────┬───────────────┤
│ IWSDK    │ Universal AR │ 8th Wall      │
│ (Quest)  │ (Mattercraft)│ (iOS fallback)│
└──────────┴──────────────┴───────────────┘
\`\`\`

### Horizon Single-Platform Stack
\`\`\`
┌─────────────────────────────────────────┐
│ Meta Horizon Desktop Editor             │
│ (TypeScript Components)                 │
├─────────────────────────────────────────┤
│ Meta Horizon Runtime                    │
├──────────┬──────────────┬───────────────┤
│ Quest VR │ Mobile       │ Web Browser   │
│          │ (iOS/Android)│               │
└──────────┴──────────────┴───────────────┘
\`\`\`

## Transmutation Strategy

### Phase 1: Asset Migration (Week 1)
Export and prepare current assets for Horizon import:

**3D Models**
- Cocktail models (GLB → FBX conversion)
- Photo booth frames
- Environmental elements
- Export from Three.js scenes

**Visual Assets**
- Textures and materials (PNG/JPG)
- Emerald glow effects
- Bubble particle systems
- UI icons and graphics

**Audio Assets**
- Background ambient sounds
- UI interaction sounds
- Event-specific audio

### Phase 2: TypeScript Component Architecture (Week 2)

Rebuild React components as Horizon TypeScript Components:

**Core Components to Port**

1. **CocktailMenu Component**
\`\`\`typescript
// Current: React component with useState
// Horizon: TypeScript Component with propsDefinition

class CocktailMenuComponent extends Component<typeof CocktailMenuComponent> {
  static propsDefinition = {
    cocktails: Type.Array({
      id: Type.String(),
      name: Type.String(),
      description: Type.String(),
      modelPath: Type.String()
    }),
    selectedCocktail: Type.String()
  }
  
  start() {
    // Initialize 3D carousel
    this.setupCocktailModels()
    this.attachInputHandlers()
  }
  
  onCocktailSelect(cocktailId: string) {
    // Track selection
    this.sendAnalyticsEvent('cocktail_viewed', { cocktailId })
    // Update display
    this.displayCocktailInfo(cocktailId)
  }
}
\`\`\`

2. **PhotoBooth Component**
\`\`\`typescript
class PhotoBoothComponent extends Component<typeof PhotoBoothComponent> {
  static propsDefinition = {
    frameStyle: Type.String(),
    captureEnabled: Type.Boolean()
  }
  
  start() {
    this.setupCamera()
    this.loadFrameAssets()
  }
  
  capturePhoto() {
    // Capture viewport
    const photo = this.runtime.captureScreenshot()
    // Apply frame overlay
    const framedPhoto = this.applyFrame(photo)
    // Save and share
    this.saveToGallery(framedPhoto)
    this.sendAnalyticsEvent('photo_captured')
  }
}
\`\`\`

3. **Analytics Tracking Component**
\`\`\`typescript
class AnalyticsComponent extends Component<typeof AnalyticsComponent> {
  static propsDefinition = {
    eventName: Type.String(),
    userId: Type.String()
  }
  
  trackEvent(eventType: string, properties: object) {
    // Send to external API (Customer.io webhook)
    this.sendToWebhook(eventType, properties)
  }
  
  async sendToWebhook(eventType: string, data: object) {
    // HTTP request to external analytics endpoint
    const response = await fetch('YOUR_WEBHOOK_URL', {
      method: 'POST',
      body: JSON.stringify({ eventType, data })
    })
  }
}
\`\`\`

### Phase 3: Feature Implementation (Week 3)

**Interactive Features**
- Hand tracking for gesture controls (VR)
- Touch controls for mobile
- Mouse/keyboard for web
- Teleportation for VR navigation
- 2D touch navigation for mobile

**UI Systems**
- 3D UI panels for menus
- Floating info cards
- Progress indicators
- Toast notifications

**Networking (if needed)**
- Multi-user support for events
- Shared experiences
- Real-time updates

### Phase 4: Deployment & Testing (Week 4)

**Deployment Workflow**
1. Build in Desktop Editor
2. Test in Horizon mobile preview
3. Test in Quest VR
4. Publish to Horizon platform
5. Configure custom domain (if Enterprise)

**Testing Matrix**
- Quest 2/3 VR experience
- iPhone Safari mobile
- Android Chrome mobile
- Desktop browser web
- Mixed reality features (Quest 3)

## Key Considerations

### Advantages of Horizon Transmutation

**Single Codebase**
- One TypeScript project for all platforms
- No platform detection needed
- Unified component architecture
- Consistent behavior across devices

**Built-in Tools**
- GenAI for asset creation
- Performance profiling
- NPC system
- Physics engine
- Social/multiplayer ready

**Official Meta Support**
- Direct integration with Meta ecosystem
- Quest hardware optimization
- Regular platform updates
- Creator monetization program

### Disadvantages & Trade-offs

**Platform Lock-in**
- Tied to Meta Horizon ecosystem
- Can't deploy to non-Meta platforms
- Subject to Meta's terms and changes

**Learning Curve**
- New TypeScript API to learn
- Different component model than React
- Desktop Editor workflow (Windows only)
- Limited documentation vs. web standards

**Feature Limitations**
- Web deployment may have reduced features vs. VR
- Mobile performance constraints
- Network API limitations
- External integration constraints

**Analytics & Tracking**
- Customer.io integration requires webhook approach
- Limited access to device analytics
- May need proxy server for external APIs

### Migration Complexity Assessment

**Easy to Port (1-2 days each)**
- 3D model display and interactions
- Basic UI components
- Color schemes and theming
- Audio playback
- Simple animations

**Moderate Complexity (3-5 days each)**
- Photo capture and frame overlay
- Gesture/hand tracking controls
- Analytics event tracking
- Multi-platform input handling
- Performance optimization

**High Complexity (1-2 weeks each)**
- External API integrations (Customer.io)
- Custom domain deployment
- Advanced physics interactions
- Real-time multi-user features
- Complex state management

## Recommended Path Forward

### Option A: Full Transmutation (4-6 weeks)
**Pros:**
- Single platform to maintain
- Consistent experience across devices
- Official Meta support and tools
- Access to Quest VR hardware

**Cons:**
- Complete rebuild required
- Platform lock-in to Meta
- Windows Desktop Editor requirement
- External integrations more complex

**Best for:** Long-term Meta ecosystem commitment, VR-first experiences

### Option B: Hybrid Approach (Recommended)
**Keep:** Current Next.js PWA for web/mobile
**Add:** Horizon World for Quest VR experiences

**Pros:**
- Leverage existing web work
- Add VR capabilities without losing web presence
- Can cross-promote between platforms
- Maintain deployment flexibility

**Cons:**
- Two codebases to maintain
- Asset duplication
- Split analytics

**Best for:** Multi-platform presence, testing Horizon before full commitment

### Option C: Current Multi-SDK Approach
**Continue:** IWSDK + Universal AR + 8th Wall

**Pros:**
- Web-native deployment
- No platform lock-in
- Existing progress preserved
- Standard web tools

**Cons:**
- Complex multi-SDK maintenance
- iOS WebXR limitations remain
- No native VR optimization

**Best for:** Web-first strategy, avoiding platform lock-in

## Decision Matrix

| Factor | Full Transmutation | Hybrid | Current Multi-SDK |
|--------|-------------------|--------|------------------|
| Development Time | 4-6 weeks | 2-3 weeks | Ongoing |
| Platform Coverage | Mobile, VR, Web | Web + VR | Web, AR, MR |
| Maintenance | Single codebase | Two codebases | Complex |
| VR Quality | Excellent | Excellent (VR only) | Good |
| Web/Mobile Quality | Good | Excellent | Excellent |
| Platform Lock-in | High | Medium | Low |
| External Integrations | Complex | Medium | Easy |
| Cost | Desktop Editor req. | Both platforms | Web hosting only |

## Next Steps

1. **Evaluate Requirements**
   - Is VR a primary platform for your events?
   - Do you need Quest hardware presence?
   - Are you comfortable with Meta platform commitment?

2. **Prototype Decision**
   - Build small Horizon prototype (1 cocktail menu)
   - Test deployment to mobile, VR, web
   - Assess development workflow
   - Compare quality vs. current PWA

3. **Integration Testing**
   - Test Customer.io webhook integration
   - Verify analytics tracking works
   - Test photo capture and sharing
   - Validate performance on target devices

4. **Final Architecture Decision**
   - Choose transmutation path based on prototype results
   - Create detailed implementation timeline
   - Allocate resources and training time

## Resources

**Meta Horizon Developer Portal**
- Desktop Editor: https://developers.meta.com/horizon-worlds/advanced-tools
- TypeScript Docs: https://developers.meta.com/horizon-worlds/learn/documentation/typescript/
- Mobile/Web Docs: https://developers.meta.com/horizon-worlds/learn/documentation/create-for-web-and-mobile/
- Community Forum: https://communityforums.atmeta.com/t5/Creator-Forum/ct-p/Meta_Horizon_Creator_Forums

**Current Codebase Assets**
- 3D Models: `/public/models/`
- Components: `/components/ar/`
- Styles: `/app/globals.css`
- Analytics: `/lib/conversion-tracking.ts`

## Conclusion

Meta Horizon Desktop Editor's multi-platform deployment capability makes it a compelling option for transmutation. The **Hybrid Approach** is recommended as a starting point, allowing you to test Horizon's capabilities for VR while maintaining your web presence, before committing to a full transmutation.
