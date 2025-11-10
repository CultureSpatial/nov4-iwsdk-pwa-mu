# Meta Horizon Gizmo Mapping & Migration Guide

## Executive Summary

This document maps our current WebAR/Three.js components to Meta Horizon's Gizmo system and provides TypeScript migration patterns for deploying to Meta Horizon mobile, MR, and VR platforms.

---

## Gizmo Architecture Overview

### What Are Gizmos?

Gizmos are Meta Horizon's interactive building blocks - reusable components that combine visual objects with behavior scripts. They use an **Entity-Component-System (ECS)** architecture with TypeScript scripting.

**Core Gizmo Types:**
- **Script Gizmo** - Custom logic/behavior (extends `Component<typeof T>`)
- **Text Gizmo** - Dynamic text display with markup support
- **Media Board Gizmo** - Video/image display
- **NPC Gizmo** - AI-driven characters
- **SpawnPoint Gizmo** - Player entry points
- **Physics Objects** - Interactive, collidable entities

---

## Current Code → Horizon Gizmo Mapping

### 1. Interactive AR Objects

#### Current (Three.js/React)
\`\`\`tsx
// components/ar/mr-demo-scene.tsx
function InteractivePlane({ controls }: Props) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.position.y = 1 + Math.sin(state.clock.elapsedTime) * 0.1
    meshRef.current.rotation.y += 0.005
  })
  
  return (
    <mesh position={[0, 1, 0]} onPointerDown={handleDrag}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial color="#10b981" />
    </mesh>
  )
}
\`\`\`

#### Horizon Equivalent (TypeScript Gizmo)
\`\`\`typescript
// InteractivePlaneGizmo.ts
import * as hz from 'horizon/core';

export class InteractivePlaneGizmo extends hz.Component<typeof InteractivePlaneGizmo> {
  static propsDefinition = {
    floatSpeed: { type: hz.PropTypes.Number, default: 1.0 },
    rotationSpeed: { type: hz.PropTypes.Number, default: 0.005 },
    color: { type: hz.PropTypes.Color, default: new hz.Color(0.06, 0.73, 0.51) }
  };

  originalPosition: hz.Vec3 = hz.Vec3.zero;
  elapsedTime: number = 0;

  start() {
    this.originalPosition = this.entity.position.get();
    
    // Enable physics and interaction
    this.entity.physics.set({
      motionType: 'Interactive',
      interactionType: 'Physics',
      collidable: true
    });
    
    // Listen for pointer events
    this.connectCodeBlockEvent(
      this.entity, 
      hz.CodeBlockEvents.OnPointerDown, 
      this.onDrag.bind(this)
    );
  }

  update(deltaTime: number) {
    this.elapsedTime += deltaTime;
    
    // Floating animation
    const newY = this.originalPosition.y + Math.sin(this.elapsedTime * this.props.floatSpeed) * 0.1;
    const currentPos = this.entity.position.get();
    this.entity.position.set(new hz.Vec3(currentPos.x, newY, currentPos.z));
    
    // Rotation
    const currentRot = this.entity.rotation.get();
    this.entity.rotation.set(currentRot.add(new hz.Vec3(0, this.props.rotationSpeed, 0)));
  }

  onDrag(pointer: hz.PointerEvent) {
    // Handle drag interaction
    const hitPosition = pointer.hitPosition;
    this.entity.position.set(hitPosition);
  }
}
\`\`\`

---

### 2. Photo Booth Component

#### Current (React/WebAR)
\`\`\`tsx
// components/ar/photo-capture.tsx
export function PhotoCapture() {
  const [isCapturing, setIsCapturing] = useState(false)
  
  const capturePhoto = async () => {
    const canvas = gl.domElement
    const dataUrl = canvas.toDataURL('image/png')
    // Save to storage
  }
  
  return (
    <button onClick={capturePhoto}>
      Capture Photo
    </button>
  )
}
\`\`\`

#### Horizon Equivalent
\`\`\`typescript
// PhotoBoothGizmo.ts
import * as hz from 'horizon/core';

export class PhotoBoothGizmo extends hz.Component<typeof PhotoBoothGizmo> {
  static propsDefinition = {
    frameAsset: { type: hz.PropTypes.Entity, default: null },
    captureButton: { type: hz.PropTypes.Entity, default: null }
  };

  start() {
    // Listen for button press
    this.connectCodeBlockEvent(
      this.props.captureButton!,
      hz.CodeBlockEvents.OnButtonPress,
      this.capturePhoto.bind(this)
    );
  }

  capturePhoto() {
    // Get current camera view
    const camera = hz.World.getCamera();
    
    // Show frame overlay
    if (this.props.frameAsset) {
      this.props.frameAsset.visible.set(true);
    }
    
    // Trigger photo capture (built-in Horizon feature)
    hz.CameraUtils.captureScreenshot({
      includeOverlay: true,
      saveToGallery: true
    });
    
    // Hide frame after delay
    this.async.setTimeout(() => {
      if (this.props.frameAsset) {
        this.props.frameAsset.visible.set(false);
      }
    }, 200);
    
    // Track event
    this.sendCustomEvent('photo_captured', { timestamp: Date.now() });
  }
}
\`\`\`

---

### 3. Cocktail Menu Display

#### Current (React/WebAR)
\`\`\`tsx
// app/ar/cocktails/page.tsx
const cocktails = [
  { name: "Elphaba's Elixir", color: "#10b981" },
  // ...
]

return (
  <div className="space-y-4">
    {cocktails.map(cocktail => (
      <div key={cocktail.name} onClick={() => selectCocktail(cocktail)}>
        <h3>{cocktail.name}</h3>
      </div>
    ))}
  </div>
)
\`\`\`

#### Horizon Equivalent (UI + Script)
\`\`\`typescript
// CocktailMenuGizmo.ts
import * as hz from 'horizon/core';

interface Cocktail {
  name: string;
  description: string;
  model: hz.Entity;
  color: hz.Color;
}

export class CocktailMenuGizmo extends hz.UIComponent<typeof CocktailMenuGizmo> {
  static propsDefinition = {
    cocktailModels: { type: hz.PropTypes.Array<hz.Entity>, default: [] },
    displayPanel: { type: hz.PropTypes.Entity, default: null },
    textGizmo: { type: hz.PropTypes.Entity, default: null }
  };

  cocktails: Cocktail[] = [];
  currentIndex: number = 0;

  start() {
    // Initialize cocktail data
    this.cocktails = [
      { name: "Elphaba's Elixir", description: "Emerald green magic", model: this.props.cocktailModels[0], color: new hz.Color(0.06, 0.73, 0.51) },
      { name: "Glinda's Sparkle", description: "Pink champagne dreams", model: this.props.cocktailModels[1], color: new hz.Color(1, 0.75, 0.8) },
      // ... more cocktails
    ];

    // Show first cocktail
    this.displayCocktail(0);

    // Listen for navigation gestures
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnSwipeLeft, () => this.nextCocktail());
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnSwipeRight, () => this.previousCocktail());
  }

  displayCocktail(index: number) {
    // Hide all models
    this.cocktails.forEach(c => c.model.visible.set(false));

    // Show selected model
    const cocktail = this.cocktails[index];
    cocktail.model.visible.set(true);
    cocktail.model.position.set(new hz.Vec3(0, 1.5, -1));

    // Update text display
    if (this.props.textGizmo) {
      const textComponent = this.props.textGizmo.as(hz.TextGizmo)!;
      textComponent.text.set(
        `<size=40><b>${cocktail.name}</b></size>\n` +
        `<size=20>${cocktail.description}</size>`
      );
      textComponent.color.set(cocktail.color);
    }

    // Track view
    this.sendCustomEvent('cocktail_viewed', { name: cocktail.name });
  }

  nextCocktail() {
    this.currentIndex = (this.currentIndex + 1) % this.cocktails.length;
    this.displayCocktail(this.currentIndex);
  }

  previousCocktail() {
    this.currentIndex = (this.currentIndex - 1 + this.cocktails.length) % this.cocktails.length;
    this.displayCocktail(this.currentIndex);
  }
}
\`\`\`

---

### 4. SDK Manager Integration

#### Current (IWSDK/Universal AR)
\`\`\`typescript
// lib/iwsdk-manager.ts
export class IWSDKManager {
  async initialize(config: IWSDKConfig) {
    this.config = config
    if (config.enablePhysics) await this.enablePhysics()
    if (config.enableInput) await this.setupInputHandlers()
  }
}
\`\`\`

#### Horizon Equivalent (World Script)
\`\`\`typescript
// WorldManagerGizmo.ts
import * as hz from 'horizon/core';

export class WorldManagerGizmo extends hz.Component<typeof WorldManagerGizmo> {
  static propsDefinition = {
    enablePhysics: { type: hz.PropTypes.Boolean, default: true },
    enableHandTracking: { type: hz.PropTypes.Boolean, default: true },
    spawnPoint: { type: hz.PropTypes.Entity, default: null }
  };

  start() {
    console.log("[Horizon] Initializing world systems");

    // Configure physics
    if (this.props.enablePhysics) {
      hz.Physics.setGravity(new hz.Vec3(0, -9.8, 0));
    }

    // Enable hand tracking (auto-available in Horizon)
    if (this.props.enableHandTracking) {
      hz.Input.enableHandTracking(true);
    }

    // Set spawn point
    if (this.props.spawnPoint) {
      const player = hz.World.getLocalPlayer();
      player.teleport(this.props.spawnPoint.position.get());
    }

    // Track initialization
    this.sendCustomEvent('world_initialized', {
      platform: hz.Device.getPlatform(), // 'mobile' | 'vr' | 'desktop'
      timestamp: Date.now()
    });
  }
}
\`\`\`

---

## Migration Patterns

### Component Lifecycle Mapping

| React/Three.js | Meta Horizon | Notes |
|----------------|--------------|-------|
| `useEffect(() => {}, [])` | `start()` | Component initialization |
| `useFrame((state, delta) => {})` | `update(deltaTime)` | Per-frame updates |
| `useRef<THREE.Object3D>()` | `this.entity` | Entity reference |
| `onClick` / `onPointerDown` | `OnPointerDown` event | Input handling |
| `useState` | Class properties | State management |
| `Canvas` context | `hz.World` | Scene context |

### Event System Mapping

| Web Event | Horizon Event |
|-----------|---------------|
| `onClick` | `hz.CodeBlockEvents.OnButtonPress` |
| `onPointerDown` | `hz.CodeBlockEvents.OnPointerDown` |
| `onPointerMove` | `hz.CodeBlockEvents.OnPointerMove` |
| `wheel` event | `hz.CodeBlockEvents.OnScroll` |
| Collision detection | `hz.CodeBlockEvents.OnEntityCollision` |
| Swipe gestures | `hz.CodeBlockEvents.OnSwipeLeft/Right` |

---

## Asset Pipeline

### Current (Web)
\`\`\`
3D Models (.glb) → public/ → Three.js loader → Scene
\`\`\`

### Horizon Pipeline
\`\`\`
3D Models (.fbx/.glb) → Blender export → Horizon Asset Library → Entity reference
\`\`\`

**Steps:**
1. Export models as FBX (preferred) or GLB
2. Upload to Horizon Desktop Editor → Asset Library
3. Drag into scene or reference in script via `hz.PropTypes.Entity`
4. Configure physics, materials, colliders in editor

---

## Analytics & Tracking

### Current (Customer.io)
\`\`\`typescript
trackEvent('photo_captured', { userId, timestamp })
\`\`\`

### Horizon Equivalent
\`\`\`typescript
// Custom event broadcast (can be read by external tools)
this.sendCustomEvent('photo_captured', { 
  userId: hz.World.getLocalPlayer().id,
  timestamp: Date.now() 
})

// Or use Meta's built-in analytics
hz.Analytics.logEvent('photo_captured', {
  category: 'engagement',
  value: 1
})
\`\`\`

---

## Platform Detection & Deployment

### Multi-Platform Gizmo Pattern

\`\`\`typescript
import * as hz from 'horizon/core';

export class PlatformAdaptiveGizmo extends hz.Component<typeof PlatformAdaptiveGizmo> {
  static propsDefinition = {
    mobileUI: { type: hz.PropTypes.Entity, default: null },
    vrUI: { type: hz.PropTypes.Entity, default: null },
    desktopUI: { type: hz.PropTypes.Entity, default: null }
  };

  start() {
    const platform = hz.Device.getPlatform();
    
    // Show/hide UI based on platform
    switch (platform) {
      case 'mobile':
        this.props.mobileUI?.visible.set(true);
        this.props.vrUI?.visible.set(false);
        this.props.desktopUI?.visible.set(false);
        this.configureMobileControls();
        break;
      
      case 'vr':
        this.props.mobileUI?.visible.set(false);
        this.props.vrUI?.visible.set(true);
        this.props.desktopUI?.visible.set(false);
        this.configureVRControls();
        break;
      
      case 'desktop':
        this.props.mobileUI?.visible.set(false);
        this.props.vrUI?.visible.set(false);
        this.props.desktopUI?.visible.set(true);
        this.configureDesktopControls();
        break;
    }
  }

  configureMobileControls() {
    // Touch gestures, AR camera
    hz.Input.enableTouchInput(true);
  }

  configureVRControls() {
    // Hand tracking, controller input
    hz.Input.enableHandTracking(true);
  }

  configureDesktopControls() {
    // Mouse, keyboard
    hz.Input.enableMouseInput(true);
  }
}
\`\`\`

---

## Deployment Checklist

### Pre-Migration
- [ ] Export all 3D models as FBX/GLB
- [ ] Document all interactive behaviors
- [ ] Map React components to Gizmo equivalents
- [ ] Plan analytics integration

### Migration Steps
1. **Desktop Editor Setup**
   - Create new Horizon World project
   - Import assets to Asset Library
   - Set up base scene layout

2. **Gizmo Development**
   - Convert React components to TypeScript Gizmos
   - Implement event handlers
   - Test physics interactions

3. **Platform Testing**
   - Test on mobile (iOS/Android via Horizon app)
   - Test on Meta Quest (VR mode)
   - Test on desktop (MR/preview mode)

4. **Publishing**
   - Configure world settings (privacy, permissions)
   - Submit for review (if public)
   - Share via QR code or deep link

### Post-Migration
- [ ] Set up analytics dashboard
- [ ] Monitor performance metrics
- [ ] Gather user feedback
- [ ] Iterate on interactions

---

## Key Advantages of Horizon Platform

1. **No WebXR Limitations** - Works natively on iOS without 8th Wall
2. **Cross-Platform** - Single codebase deploys to mobile, VR, and MR
3. **Built-in Social** - Instagram/Facebook sharing, multiplayer by default
4. **Asset Management** - Centralized asset library with versioning
5. **AI Tools** - AssetGen 2.0 for generating 3D content from text
6. **Performance** - Native rendering, optimized for Meta hardware

---

## Next Steps

1. **Proof of Concept** - Port one component (e.g., photo booth) to validate approach
2. **Asset Preparation** - Export all Wicked-themed models and textures
3. **Gizmo Library** - Build reusable gizmos for common patterns
4. **Testing** - Validate on all target platforms (mobile priority)
5. **Launch** - Deploy for Nov 21 event, iterate based on feedback

---

## Resources

- [Meta Horizon TypeScript API Reference](https://developers.meta.com/horizon-worlds/api)
- [Gizmo Documentation](https://developers.meta.com/horizon-worlds/learn/documentation/code-blocks-and-gizmos/)
- [Desktop Editor Guide](https://developers.meta.com/horizon-worlds/learn/documentation/desktop-editor/)
- [Entity-Component-System (ECS)](https://developers.meta.com/horizon/documentation/spatial-sdk/spatial-sdk-ecs/)
