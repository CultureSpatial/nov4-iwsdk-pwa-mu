# Customer.io Forms in Meta Horizon: Feasibility Assessment

## Executive Summary

**Direct Customer.io form embedding in Meta Horizon Worlds is NOT technically possible** due to lack of iframe/web panel support in the Horizon platform. However, **native VR forms + existing Vercel Analytics integration** provides a viable alternative for data collection.

> **Note:** This project now uses Vercel Analytics for all tracking. Customer.io integration has been removed.

## Meta Horizon Capabilities

### What Meta Horizon Supports

- **Text Display Gizmos** - Static text labels, dynamic text updates via TypeScript, UI panels with text content
- **Button Inputs** - Clickable buttons, VR hand interactions, Quest controller inputs (A, B, X, Y)
- **Custom UI Panels** - 2D UI overlays in VR, modal-style popups, player-facing interfaces
- **TypeScript API Access** - HTTP fetch requests, external API calls, data storage/retrieval

### What Meta Horizon Does NOT Support

- **Web Browser Panels** - No iframe embedding, no web page rendering, no HTML form elements
- **Native Text Input Fields** - No keyboard input in VR (as of current documentation), no free-form text entry gizmos
- **Direct Web Integration** - Cannot embed web forms, cannot render external web content

## Recommended Solution: Native VR Forms

### Architecture

\`\`\`
┌─────────────────────────────────────────────────────┐
│  Meta Horizon World (VR Form)                       │
│  • Button-based selection inputs                    │
│  • Predefined option menus                          │
│  • Quest controller interactions                    │
└─────────────────┬───────────────────────────────────┘
                  │ HTTP POST
                  ▼
┌─────────────────────────────────────────────────────┐
│  Web API: /api/track (Next.js)                      │
│  • Validates event data                             │
│  • Enriches with platform context                   │
│  • Routes to Vercel Analytics                       │
└─────────────────────────────────────────────────────┘
\`\`\`

### VR Form Example

**Scenario:** Collect guest preferences in VR lounge

\`\`\`typescript
// Horizon TypeScript form script
class VRFormScript extends hz.Component<typeof VRFormScript> {
  static propsDefinition = {
    userId: { type: hz.PropTypes.String },
  };

  // Predefined options (no free text input)
  private selectedOptions = {
    drinkPreference: '',
    experienceInterest: '',
    visitFrequency: '',
  };

  async onSubmit() {
    // Send to web API (uses Vercel Analytics)
    await fetch('https://your-app.vercel.app/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'vr_form_submitted',
        properties: {
          drink_preference: this.selectedOptions.drinkPreference,
          experience_interest: this.selectedOptions.experienceInterest,
          visit_frequency: this.selectedOptions.visitFrequency,
          platform: 'horizon',
          collected_in_vr: true,
        },
      }),
    });

    this.displayThankYou();
  }
}
\`\`\`

### VR Form UI Design

\`\`\`
┌────────────────────────────────────────┐
│  Welcome to Emerald Lounge VR!         │
│  Help us personalize your experience   │
│                                        │
│  What's your drink preference?         │
│  [Cocktails] [Wine] [Beer] [Non-Alc]  │
│                                        │
│  What interests you most?              │
│  [Photo Booth] [AR Menus] [Gestures]  │
│                                        │
│  How often do you visit?               │
│  [First Time] [Monthly] [Weekly]       │
│                                        │
│           [Submit Preferences]         │
└────────────────────────────────────────┘
\`\`\`

## Hybrid Approach: VR + Web Handoff

For more complex intake (requiring free text), use QR code bridge:

### Step 1: Collect Basic Info in VR

\`\`\`typescript
// Quick VR form (2-3 button selections)
onVRFormComplete(data) {
  // Save basic preferences via Vercel Analytics
  await fetch('/api/track', {
    method: 'POST',
    body: JSON.stringify({
      event: 'vr_preferences_collected',
      properties: data,
    }),
  });

  // Generate personalized QR code
  const qrCode = generateQRCode(hz.world.playerId);
  showQRGizmo(qrCode);
}
\`\`\`

### Step 2: Detailed Form on Phone

\`\`\`
VR Message: "For exclusive offers, scan this QR code on your phone!"

QR Code → https://your-app.vercel.app/intake?vr_user_id=xyz123
\`\`\`

## Use Cases

### Use Case 1: Guest Preferences (VR-Native)

**Scenario:** Quick preference survey in VR lounge

**Form Fields:**
- Drink type (buttons: Cocktails, Wine, Beer, Non-Alcoholic)
- Experience interest (buttons: Photo Booth, AR Menus, Gestures)
- Visit frequency (buttons: First Time, Monthly, Weekly)

**Implementation:** Native VR form (100% in Horizon)

### Use Case 2: Feedback Collection (VR-Native)

**Scenario:** Post-experience satisfaction survey

**Form Fields:**
- Experience rating (buttons: 1-5 stars)
- Favorite feature (buttons: Photo, Cocktails, Gestures)
- Would recommend? (buttons: Yes, Maybe, No)

**Implementation:** Native VR form (100% in Horizon)

## Comparison Matrix

| Approach | Data Richness | VR Immersion | Implementation | Analytics |
|----------|---------------|--------------|----------------|-----------|
| **Native VR Form** | Limited | Perfect | Easy | Vercel Analytics |
| **QR → Mobile Form** | Full | Good | Moderate | Vercel Analytics |
| **Exit to Browser** | High | Poor | Easy | Vercel Analytics |

## Summary

**Bottom Line:**
- Cannot embed web forms directly in VR
- Can collect data via native VR forms (buttons)
- Can integrate with Vercel Analytics via existing API
- Can use QR codes for complex web forms

**Recommended Approach:**
- Start with button-based VR forms (simple, immersive)
- Use QR code handoff only when text input essential
- Leverage existing `/api/track` Vercel Analytics integration
