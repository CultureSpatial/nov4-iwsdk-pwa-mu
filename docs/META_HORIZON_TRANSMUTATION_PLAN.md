# Meta Horizon Transmutation Plan

## Critical Update: Multi-Platform Deployment

**Meta Horizon Desktop Editor** can deploy to:
- **VR**: Meta Quest headsets (Quest 2, 3, Pro)
- **MR**: Mixed Reality mode on Quest 3
- **Mobile**: iOS and Android devices
- **Desktop**: Windows/Mac browsers

This changes everything - we CAN transmute the web PWA to Meta Horizon and reach mobile users.

## Two Parallel Paths

### Path 1: IWSDK (Current - Web-Based)
**What we have now:**
- React/Next.js web app
- WebXR API for compatible devices
- Deployed to Vercel
- Works in browsers

**Limitations:**
- WebXR not supported on iOS Safari
- Requires fallback solutions (8th Wall, Mattercraft)
- Browser-based only

### Path 2: Meta Horizon Desktop Editor (Target)
**What we can build:**
- TypeScript-based scripting
- 3D world creation with visual editor
- Deploy to Quest, mobile (iOS/Android), desktop, MR
- Native XR support across all platforms

**Advantages:**
- Solves iOS WebXR limitation natively
- Single codebase for all platforms
- Built-in asset management
- Native performance

## Transmutation Strategy

### Phase 1: Asset Migration (Week 1)
**Export from current app:**
- 3D models (cocktail glasses, photo frames)
- Textures and materials
- UI designs as reference
- Color scheme and branding

**Import to Horizon:**
- Upload GLB/FBX models to Asset Library
- Create materials in Horizon
- Set up theme colors

### Phase 2: Core Features (Week 2-3)
**Rebuild in TypeScript:**

1. **Cocktail Menu**
   \`\`\`typescript
   class CocktailMenu extends Component<typeof CocktailMenu> {
     static propsDefinition = {
       cocktails: Type.Array(Type.String)
     };
     
     onReady() {
       // Display 3D cocktail models
       // Handle selection interactions
     }
   }
   \`\`\`

2. **Photo Booth**
   \`\`\`typescript
   class PhotoBooth extends Component<typeof PhotoBooth> {
     onCapturePhoto() {
       // Capture with AR frame overlay
       // Save to user gallery
     }
   }
   \`\`\`

3. **Analytics Integration**
   - Replace Customer.io webhook with Horizon events
   - Track user interactions
   - Export data for analysis

### Phase 3: Deploy & Test (Week 4)
**Deployment targets:**
- Publish to Horizon Store
- Test on Quest headset
- Test on iOS mobile
- Test on Android mobile
- Test desktop browser

### Phase 4: Progressive Migration
**Run both platforms:**
- Keep IWSDK web app for existing users
- Promote Meta Horizon version for better experience
- Measure adoption and performance
- Eventually sunset web version

## Key Differences to Address

| Web PWA | Meta Horizon |
|---------|--------------|
| React components | TypeScript classes extending Component |
| DOM manipulation | 3D object manipulation |
| CSS styling | Material/texture properties |
| Fetch API | Horizon networking APIs |
| Customer.io webhooks | Horizon analytics events |
| QR code entry | Deep links to world |

## Required Learning

1. **Horizon TypeScript API**
   - Component lifecycle
   - Event handling
   - Asset management
   - Networking

2. **Horizon Desktop Editor**
   - World building tools
   - Asset import workflow
   - Publishing process
   - Testing on devices

3. **3D Asset Optimization**
   - FBX export from current models
   - LOD (Level of Detail) for performance
   - Texture optimization
   - Collision meshes

## Migration Checklist

- [ ] Install Horizon Desktop Editor
- [ ] Create Meta developer account
- [ ] Set up test world
- [ ] Export 3D assets from web app
- [ ] Import assets to Horizon
- [ ] Rebuild cocktail menu in TypeScript
- [ ] Rebuild photo booth in TypeScript
- [ ] Implement analytics tracking
- [ ] Test on Quest device
- [ ] Test on iOS mobile
- [ ] Test on Android mobile
- [ ] Publish to Horizon platform
- [ ] Update QR codes to point to Horizon world
- [ ] Monitor analytics and performance

## Timeline

**Estimated: 4 weeks**
- Week 1: Setup, learning, asset migration
- Week 2: Core feature development
- Week 3: Advanced features, polish
- Week 4: Testing, deployment, launch

## Success Metrics

- 100% mobile device coverage (including iOS)
- Improved performance vs web PWA
- Higher engagement rates
- Simplified deployment (no WebXR fallbacks needed)
- Better user experience across all devices

## Next Steps

1. Install Horizon Desktop Editor
2. Review TypeScript API documentation
3. Create prototype world with one feature
4. Validate deployment to mobile works
5. Commit to full migration or dual-platform approach
