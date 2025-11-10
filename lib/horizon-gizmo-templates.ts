/**
 * Meta Horizon Gizmo Templates
 * Ready-to-use TypeScript patterns for common AR interactions
 */

import * as hz from "horizon/core"

// ============================================================================
// BASE INTERACTIVE GIZMO
// ============================================================================

export class BaseInteractiveGizmo extends hz.Component<typeof BaseInteractiveGizmo> {
  static propsDefinition = {
    enablePhysics: { type: hz.PropTypes.Boolean, default: true },
    enableGlow: { type: hz.PropTypes.Boolean, default: false },
    glowColor: { type: hz.PropTypes.Color, default: new hz.Color(0.06, 0.73, 0.51) },
  }

  start() {
    if (this.props.enablePhysics) {
      this.entity.physics.set({
        motionType: "Interactive",
        interactionType: "Physics",
        collidable: true,
      })
    }

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPointerEnter, this.onHoverStart.bind(this))

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPointerExit, this.onHoverEnd.bind(this))
  }

  onHoverStart() {
    if (this.props.enableGlow) {
      this.entity.material.setEmissive(this.props.glowColor)
      this.entity.material.setEmissiveIntensity(0.5)
    }
  }

  onHoverEnd() {
    if (this.props.enableGlow) {
      this.entity.material.setEmissiveIntensity(0)
    }
  }
}

// ============================================================================
// FLOATING ANIMATION GIZMO
// ============================================================================

export class FloatingGizmo extends hz.Component<typeof FloatingGizmo> {
  static propsDefinition = {
    amplitude: { type: hz.PropTypes.Number, default: 0.1 },
    speed: { type: hz.PropTypes.Number, default: 1.0 },
    rotationSpeed: { type: hz.PropTypes.Number, default: 0.005 },
  }

  originalPosition: hz.Vec3 = hz.Vec3.zero
  elapsedTime = 0

  start() {
    this.originalPosition = this.entity.position.get()
  }

  update(deltaTime: number) {
    this.elapsedTime += deltaTime

    // Floating animation
    const yOffset = Math.sin(this.elapsedTime * this.props.speed) * this.props.amplitude
    const currentPos = this.entity.position.get()
    this.entity.position.set(new hz.Vec3(currentPos.x, this.originalPosition.y + yOffset, currentPos.z))

    // Rotation
    const currentRot = this.entity.rotation.get()
    this.entity.rotation.set(currentRot.add(new hz.Vec3(0, this.props.rotationSpeed, 0)))
  }
}

// ============================================================================
// PHOTO CAPTURE GIZMO
// ============================================================================

export class PhotoCaptureGizmo extends hz.Component<typeof PhotoCaptureGizmo> {
  static propsDefinition = {
    captureButton: { type: hz.PropTypes.Entity, default: null },
    frameOverlay: { type: hz.PropTypes.Entity, default: null },
    countdownText: { type: hz.PropTypes.Entity, default: null },
  }

  start() {
    this.connectCodeBlockEvent(
      this.props.captureButton!,
      hz.CodeBlockEvents.OnButtonPress,
      this.startCountdown.bind(this),
    )
  }

  async startCountdown() {
    const textGizmo = this.props.countdownText?.as(hz.TextGizmo)

    for (let i = 3; i > 0; i--) {
      textGizmo?.text.set(i.toString())
      await this.async.setTimeout(() => {}, 1000)
    }

    textGizmo?.text.set("Say Cheese!")
    await this.async.setTimeout(() => this.capturePhoto(), 500)
  }

  capturePhoto() {
    // Show frame overlay
    this.props.frameOverlay?.visible.set(true)

    // Capture screenshot
    hz.CameraUtils.captureScreenshot({
      includeOverlay: true,
      saveToGallery: true,
    })

    // Hide frame after brief delay
    this.async.setTimeout(() => {
      this.props.frameOverlay?.visible.set(false)
      const textGizmo = this.props.countdownText?.as(hz.TextGizmo)
      textGizmo?.text.set("")
    }, 200)

    // Track event
    this.sendCustomEvent("photo_captured", {
      timestamp: Date.now(),
      platform: hz.Device.getPlatform(),
    })
  }
}

// ============================================================================
// CAROUSEL NAVIGATION GIZMO
// ============================================================================

export class CarouselGizmo extends hz.Component<typeof CarouselGizmo> {
  static propsDefinition = {
    items: { type: hz.PropTypes.Array<hz.Entity>, default: [] },
    displayPanel: { type: hz.PropTypes.Entity, default: null },
    leftButton: { type: hz.PropTypes.Entity, default: null },
    rightButton: { type: hz.PropTypes.Entity, default: null },
  }

  currentIndex = 0

  start() {
    this.connectCodeBlockEvent(this.props.leftButton!, hz.CodeBlockEvents.OnButtonPress, this.previous.bind(this))

    this.connectCodeBlockEvent(this.props.rightButton!, hz.CodeBlockEvents.OnButtonPress, this.next.bind(this))

    // Support swipe gestures on mobile
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnSwipeLeft, this.next.bind(this))

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnSwipeRight, this.previous.bind(this))

    this.displayItem(0)
  }

  displayItem(index: number) {
    // Hide all items
    this.props.items.forEach((item) => item.visible.set(false))

    // Show current item
    const item = this.props.items[index]
    item.visible.set(true)

    this.sendCustomEvent("carousel_item_viewed", { index })
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.props.items.length
    this.displayItem(this.currentIndex)
  }

  previous() {
    this.currentIndex = (this.currentIndex - 1 + this.props.items.length) % this.props.items.length
    this.displayItem(this.currentIndex)
  }
}

// ============================================================================
// PLATFORM DETECTION GIZMO
// ============================================================================

export class PlatformDetectionGizmo extends hz.Component<typeof PlatformDetectionGizmo> {
  static propsDefinition = {
    mobileContent: { type: hz.PropTypes.Entity, default: null },
    vrContent: { type: hz.PropTypes.Entity, default: null },
    desktopContent: { type: hz.PropTypes.Entity, default: null },
  }

  start() {
    const platform = hz.Device.getPlatform()

    // Show platform-specific content
    this.props.mobileContent?.visible.set(platform === "mobile")
    this.props.vrContent?.visible.set(platform === "vr")
    this.props.desktopContent?.visible.set(platform === "desktop")

    // Configure input based on platform
    switch (platform) {
      case "mobile":
        hz.Input.enableTouchInput(true)
        break
      case "vr":
        hz.Input.enableHandTracking(true)
        break
      case "desktop":
        hz.Input.enableMouseInput(true)
        break
    }

    this.sendCustomEvent("platform_detected", { platform })
  }
}

// ============================================================================
// ANALYTICS TRACKER GIZMO
// ============================================================================

export class AnalyticsTrackerGizmo extends hz.Component<typeof AnalyticsTrackerGizmo> {
  static propsDefinition = {
    trackingEnabled: { type: hz.PropTypes.Boolean, default: true },
  }

  start() {
    if (this.props.trackingEnabled) {
      this.trackSessionStart()
    }
  }

  trackSessionStart() {
    const sessionData = {
      platform: hz.Device.getPlatform(),
      timestamp: Date.now(),
      worldId: hz.World.getId(),
      userId: hz.World.getLocalPlayer().id,
    }

    this.sendCustomEvent("session_started", sessionData)
    hz.Analytics.logEvent("session_started", sessionData)
  }

  trackEvent(eventName: string, properties: Record<string, any>) {
    if (!this.props.trackingEnabled) return

    const eventData = {
      ...properties,
      timestamp: Date.now(),
      userId: hz.World.getLocalPlayer().id,
    }

    this.sendCustomEvent(eventName, eventData)
    hz.Analytics.logEvent(eventName, eventData)
  }
}
