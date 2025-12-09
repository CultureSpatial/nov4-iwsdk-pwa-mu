# Camera System Architecture

## Overview

The Emerald Gem camera system provides production-ready front-facing camera access for AR try-on experiences with robust error handling, progressive fallback, and performance monitoring aligned with industry standards (8th Wall, Meta Horizon, Instagram).

## Critical Requirements

**Why Front-Facing Camera is Mission-Critical:**
- Primary input for AR try-on flows (Digital Royal Wardrobe)
- Required for photo booth experiences with AR frames
- Essential for gesture-based interactions
- Core to December 15 Royal Sonesta launch success

**Single Point of Failure Prevention:**
- Isolated module design (lib/camera-manager.ts)
- Progressive quality fallback (60fps → 30fps → basic)
- Automatic retry with exponential backoff
- Comprehensive error recovery

## Architecture

\`\`\`
┌─────────────────────────────────────────────────────┐
│  CameraFeed Component (React UI)                    │
│  • Loading states                                    │
│  • Error UI with recovery                           │
│  • Live indicator & FPS display                     │
│  • Camera switch controls                           │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  CameraManager (Singleton)                          │
│  • Progressive fallback configs                     │
│  • getUserMedia() with retry logic                  │
│  • Stream lifecycle management                      │
│  • Performance monitoring                           │
└─────────┬───────────────────────────────┬───────────┘
          │                               │
          ▼                               ▼
┌──────────────────────┐      ┌──────────────────────┐
│  MediaStream         │      │  Analytics Events    │
│  • Video track       │      │  • camera_initialized│
│  • Audio track       │      │  • camera_switched   │
│  • Constraints       │      │  • camera_error      │
└──────────────────────┘      └──────────────────────┘
\`\`\`

## Progressive Fallback Strategy

### Tier 1: Ideal (60fps)
**Aligned with 8th Wall standard for premium AR**
\`\`\`typescript
{
  facingMode: "user",
  width: { ideal: 1280, max: 1920 },
  height: { ideal: 720, max: 1080 },
  frameRate: { ideal: 60, max: 60 }
}
\`\`\`
- Target: Latest iOS/Android flagship devices
- Use case: Smooth AR tracking, gesture recognition
- Fallback trigger: Browser/device doesn't support 60fps

### Tier 2: Optimized (30fps)
**Balanced performance for most devices**
\`\`\`typescript
{
  facingMode: "user",
  width: { ideal: 1280 },
  height: { ideal: 720 },
  frameRate: { ideal: 30, max: 30 }
}
\`\`\`
- Target: Mid-range devices (2-3 years old)
- Use case: Standard AR experiences
- Fallback trigger: Resolution/framerate constraints fail

### Tier 3: Basic
**Guaranteed compatibility**
\`\`\`typescript
{
  facingMode: "user",
  width: { ideal: 640 },
  height: { ideal: 480 },
  frameRate: { ideal: 30 }
}
\`\`\`
- Target: Older devices, low-bandwidth situations
- Use case: Core functionality maintained
- Fallback trigger: All higher tiers fail

## Error Handling & Recovery

### Automatic Retry Logic
\`\`\`typescript
private retryCount = 0
private maxRetries = 3
private retryDelay = 1000 // Exponential backoff

// 1st retry: 1000ms
// 2nd retry: 2000ms
// 3rd retry: 4000ms
\`\`\`

### Common Error Scenarios

| Error | Cause | Recovery Strategy |
|-------|-------|-------------------|
| `NotAllowedError` | User denied permission | Display permission prompt UI |
| `NotFoundError` | No camera available | Suggest device check |
| `NotReadableError` | Camera in use by another app | Prompt user to close other apps |
| `OverconstrainedError` | Constraints not supported | Automatic fallback to lower tier |
| `AbortError` | Camera access aborted | Retry with exponential backoff |

### User-Facing Error Messages
\`\`\`typescript
{
  NotAllowedError: "Camera access denied. Please allow camera access in browser settings.",
  NotFoundError: "No camera found. Please connect a camera device.",
  NotReadableError: "Camera is in use. Please close other apps using the camera.",
  OverconstrainedError: "Camera doesn't support required quality. Trying lower quality...",
  default: "Camera initialization failed. Please try again."
}
\`\`\`

## Performance Monitoring

### Real-Time Metrics
\`\`\`typescript
interface CameraPerformanceMetrics {
  fps: number              // Current frames per second
  latency: number          // Average frame latency (ms)
  droppedFrames: number    // Cumulative dropped frames
  timestamp: number        // Last measurement time
}
\`\`\`

### Performance Thresholds
- **Ideal**: 60 FPS (8th Wall standard)
- **Acceptable**: 30-59 FPS
- **Degraded**: 24-29 FPS (triggers analytics event)
- **Critical**: <24 FPS (automatic quality reduction)

### FPS Calculation
\`\`\`typescript
const monitorFrame = () => {
  const now = performance.now()
  const delta = now - lastFrameTime
  frameCount++

  if (delta >= 1000) {
    fps = Math.round((frameCount * 1000) / delta)
    // Track if FPS < 24
    lastFrameTime = now
    frameCount = 0
  }
  
  requestAnimationFrame(monitorFrame)
}
\`\`\`

## Integration with AR Experiences

### Photo Booth
\`\`\`tsx
import { CameraFeed } from '@/components/camera/camera-feed'

<CameraFeed
  facingMode="user"
  onStreamReady={(stream) => {
    // Apply AR filters to stream
    applyARFilter(stream, 'emerald_glow')
  }}
/>
\`\`\`

### Try-On Flows
\`\`\`tsx
<CameraFeed
  facingMode="user"
  showControls={false}
  onStreamReady={(stream) => {
    // Track face for virtual try-on
    startFaceTracking(stream)
  }}
/>
\`\`\`

### Gesture Controls
\`\`\`tsx
<CameraFeed
  facingMode="user"
  onStreamReady={(stream) => {
    // Detect hand gestures
    initializeHandTracking(stream)
  }}
/>
\`\`\`

## Analytics Integration

All camera lifecycle events automatically tracked:

\`\`\`typescript
// Camera initialized
Analytics.trackEvent({
  event: "camera_initialized",
  properties: {
    facing_mode: "user",
    config_tier: "ideal_60fps",
    width: 1280,
    height: 720,
    frame_rate: 60
  },
  platform: "web"
})

// Camera switched
Analytics.trackEvent({
  event: "camera_switched",
  properties: { new_facing_mode: "environment" },
  platform: "web"
})

// Performance degradation
Analytics.trackEvent({
  event: "camera_performance_degraded",
  properties: { fps: 18, latency: 55 },
  platform: "web"
})
\`\`\`

## Testing Strategy

### Unit Tests
- Progressive fallback logic
- Retry mechanism with exponential backoff
- Error handling for all getUserMedia() errors
- FPS calculation accuracy

### Integration Tests
- CameraFeed component rendering
- Stream attachment to video element
- Camera switching functionality
- Error recovery UI

### Device Testing Matrix

| Device | Browser | Expected Tier | Notes |
|--------|---------|---------------|-------|
| iPhone 15 Pro | Safari 17+ | Tier 1 (60fps) | Ideal performance |
| iPhone 12 | Safari 16+ | Tier 2 (30fps) | Standard performance |
| Pixel 8 | Chrome 120+ | Tier 1 (60fps) | Ideal performance |
| Samsung S21 | Chrome 119+ | Tier 2 (30fps) | Standard performance |
| iPad Pro M2 | Safari 17+ | Tier 1 (60fps) | Ideal performance |
| Older Android | Chrome 100+ | Tier 3 (basic) | Compatibility mode |

### Manual Test Checklist
- [ ] Camera initializes on first load
- [ ] Permission prompt appears correctly
- [ ] Switching between front/back camera works
- [ ] Error recovery UI appears on failure
- [ ] Retry button successfully re-initializes
- [ ] FPS counter displays accurate values
- [ ] Camera stops cleanly on navigation
- [ ] No memory leaks after multiple starts/stops

## Production Deployment

### Environment Requirements
- HTTPS required (getUserMedia() restriction)
- Camera permission in browser
- Sufficient device memory (>2GB recommended)

### Browser Compatibility
- Safari 14+ (iOS 14+)
- Chrome 90+ (Android 10+)
- Edge 90+
- Firefox 95+

### Performance Optimization
- Use `playsInline` attribute for mobile
- Set `muted` to avoid audio feedback
- Apply `scaleX(-1)` for front camera mirror effect
- Clean up streams on component unmount

### Security Considerations
- Camera access requires HTTPS
- User must grant permission
- Streams automatically stop when tab loses focus
- No automatic recording without user consent

## Troubleshooting

### Common Issues

**Issue: Camera not initializing**
- Check browser console for specific error
- Verify HTTPS connection
- Confirm camera permission granted
- Try different browser/device

**Issue: Low FPS**
- Check device specifications
- Close other apps using camera
- Reduce camera resolution constraints
- Monitor CPU/memory usage

**Issue: Camera switching fails**
- Verify device has multiple cameras
- Check browser support for camera enumeration
- Ensure proper stream cleanup before switch

## Future Enhancements

1. **Face Detection Integration**
   - MediaPipe Face Mesh
   - AR landmark tracking
   - Expression recognition

2. **Advanced AR Features**
   - 3D object placement
   - Occlusion handling
   - Real-time lighting estimation

3. **Multi-Camera Support**
   - Simultaneous front/back streams
   - Picture-in-picture mode
   - Multi-view AR experiences

4. **Recording Capabilities**
   - MediaRecorder API integration
   - Photo capture with filters
   - Video export functionality

## Support

- Camera issues: Check browser console logs (search for `[v0]`)
- Analytics dashboard: `/dashboard` for camera event tracking
- Performance metrics: Displayed in CameraFeed component UI
