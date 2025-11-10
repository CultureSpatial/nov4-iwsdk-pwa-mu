# Camera Architecture Documentation

## Overview

The camera system is the **critical foundation** for AR try-on experiences in the Emerald Gem platform. It prioritizes front-facing camera access with robust error handling and progressive fallback mechanisms.

## Architecture Components

### 1. **CameraManager** (`lib/camera-manager.ts`)
**Isolated, production-ready camera management**

**Key Features:**
- Front-facing camera prioritization for try-on flows
- Progressive constraint fallback (ideal → basic → any)
- Automatic retry logic (3 attempts with exponential backoff)
- Device enumeration and capability detection
- Camera switching (front/rear)
- Comprehensive error handling with user-friendly messages
- State management with subscriptions
- Singleton pattern for app-wide consistency

**State Machine:**
\`\`\`
idle → requesting → active
  ↓        ↓
error ← denied
\`\`\`

**Error Types:**
- `NOT_SUPPORTED`: Browser lacks camera API (non-recoverable)
- `PERMISSION_DENIED`: User denied camera access (non-recoverable)
- `CAMERA_UNAVAILABLE`: No camera found (recoverable with retry)
- `CAMERA_IN_USE`: Camera occupied by another app (recoverable)
- `AUTOPLAY_BLOCKED`: Video autoplay prevented (user interaction needed)

### 2. **CameraFeed Component** (`components/camera/camera-feed.tsx`)
**React component wrapper for camera display**

**Features:**
- Video stream rendering with proper constraints
- Loading and error UI states
- Camera switch controls
- Live indicator
- Retry mechanism
- Event callbacks for parent components

## Configuration

### Default Config (Optimized for Try-On)
\`\`\`typescript
{
  facing: "user",          // Front-facing camera
  width: 1280,             // HD resolution
  height: 720,
  aspectRatio: 16/9,       // Standard mobile aspect
  frameRate: 30            // Smooth capture
}
\`\`\`

### Usage Example

\`\`\`tsx
import { CameraFeed } from "@/components/camera/camera-feed"

function PhotoBooth() {
  const handleCameraReady = (stream: MediaStream) => {
    console.log("Camera ready:", stream)
    // Initialize AR filters, Three.js scene, etc.
  }

  const handleCameraError = (error: CameraError) => {
    // Track error analytics
    Analytics.trackEvent({
      event: "camera_error",
      properties: { code: error.code, message: error.message }
    })
  }

  return (
    <CameraFeed
      facing="user"
      onReady={handleCameraReady}
      onError={handleCameraError}
      showControls={true}
    />
  )
}
\`\`\`

## Error Handling Strategy

### Progressive Fallback
1. **Ideal constraints** - Request specific resolution, frame rate, facing mode
2. **Basic constraints** - Request only facing mode
3. **Any video** - Accept any available camera
4. **User guidance** - Show clear error message and action steps

### Retry Logic
- Automatic retry for recoverable errors
- Maximum 3 attempts
- Exponential backoff: 1s, 2s, 3s
- Manual retry button for user control

### Permission Flow
\`\`\`
Request Camera
  ↓
Permission Prompt
  ↓
├─ Granted → Initialize Stream → Attach to Video
└─ Denied → Show Error → Suggest Settings
\`\`\`

## Integration with AR Systems

### WebXR Integration
\`\`\`typescript
const manager = getCameraManager({ facing: "user" })
await manager.initialize()

// Use stream with WebXR
const stream = manager.getStream()
const videoTrack = stream.getVideoTracks()[0]
// Pass to XR session
\`\`\`

### Meta Horizon Integration
Camera feed is managed by Meta Horizon on native platforms. For web preview:
\`\`\`typescript
// Web-based testing before Horizon deployment
const manager = getCameraManager()
await manager.initialize()
// Test try-on logic with web camera
\`\`\`

### Three.js/Universal AR Integration
\`\`\`typescript
const manager = getCameraManager()
const stream = await manager.initialize()

// Create video texture
const videoTexture = new THREE.VideoTexture(videoElement)
// Apply to AR plane
\`\`\`

## Testing Checklist

### Device Testing
- [ ] iOS Safari (front camera priority)
- [ ] iOS Chrome/Firefox (WebKit restrictions)
- [ ] Android Chrome (front + rear camera switching)
- [ ] Android Samsung Internet
- [ ] Desktop Chrome (webcam)
- [ ] Desktop Firefox (webcam)
- [ ] Meta Quest Browser (passthrough camera)

### Scenario Testing
- [ ] First-time permission request
- [ ] Permission denied and retry
- [ ] Camera already in use by another tab
- [ ] Camera switching (front ↔ rear)
- [ ] Network interruption during stream
- [ ] Device rotation during active stream
- [ ] Background/foreground app transitions
- [ ] Low-light conditions
- [ ] Multiple cameras available

### Performance Testing
- [ ] Stream startup time < 2s
- [ ] Memory usage stable over 5 minutes
- [ ] No frame drops at 30fps
- [ ] Proper cleanup on component unmount
- [ ] No memory leaks after multiple start/stop cycles

## Analytics Integration

All camera events automatically tracked:
\`\`\`typescript
// Camera lifecycle events
- camera_requested
- camera_active  
- camera_error
- camera_switched
- camera_denied

// Include metadata
- platform (web/horizon/mobile)
- facing_mode (user/environment)
- resolution (width x height)
- error_code (for failures)
\`\`\`

## Security & Privacy

### Best Practices
- Always request camera only when needed (user-initiated)
- Show live indicator when camera is active
- Provide clear explanation before permission request
- Stop camera when not in use (page navigation, minimize)
- Never store raw video frames without explicit consent
- Use HTTPS (required for getUserMedia)

### Permission Messaging
\`\`\`
"We need camera access to let you try on AR frames and filters. 
Your camera feed stays on your device and is never uploaded."
\`\`\`

## Troubleshooting

### Common Issues

**Issue: "Camera not working on iOS"**
- Ensure using Safari or in-app browser (Chrome uses WebKit on iOS)
- Check Settings → Safari → Camera permission
- Use `playsInline` attribute on video element
- Use HTTPS (required on iOS)

**Issue: "Black screen after granting permission"**
- Check if camera is already in use by another tab/app
- Verify video element has correct `srcObject` assignment
- Ensure `video.play()` is called and awaited
- Check browser console for autoplay policy errors

**Issue: "Rear camera opens instead of front"**
- Some Android devices default to rear camera
- Implement camera switching UI
- Check `facingMode: "user"` constraint
- Enumerate devices and explicitly select front camera

## Future Enhancements

### Phase 2 (Transmutation)
- [ ] Advanced filters (beauty mode, color correction)
- [ ] Face mesh detection integration
- [ ] Hand tracking overlay
- [ ] Multi-camera simultaneous capture
- [ ] 4K resolution support

### Phase 3 (Stabilization)
- [ ] Background replacement
- [ ] Real-time lighting analysis
- [ ] Camera calibration persistence
- [ ] Bandwidth-adaptive quality
- [ ] Edge ML for on-device processing

## Summary

The camera system is built for **reliability and robustness** as the critical entry point for AR try-on experiences. With progressive fallback, automatic retry, and comprehensive error handling, it ensures the highest possible success rate across all devices and scenarios, particularly prioritizing front-facing camera access for the core try-on use case.
