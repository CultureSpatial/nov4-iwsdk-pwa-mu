# Customer.io Forms in Meta Horizon: Feasibility Assessment

## Executive Summary

**Direct Customer.io form embedding in Meta Horizon Worlds is NOT technically possible** due to lack of iframe/web panel support in the Horizon platform. However, **native VR forms + existing Customer.io API integration** provides a viable alternative for data collection.

## Meta Horizon Capabilities

### What Meta Horizon Supports

✅ **Text Display Gizmos**
- Static text labels
- Dynamic text updates via TypeScript
- UI panels with text content

✅ **Button Inputs**
- Clickable buttons
- VR hand interactions
- Quest controller inputs (A, B, X, Y)

✅ **Custom UI Panels**
- 2D UI overlays in VR
- Modal-style popups
- Player-facing interfaces

✅ **TypeScript API Access**
- HTTP fetch requests
- External API calls (including Customer.io)
- Data storage/retrieval

### What Meta Horizon Does NOT Support

❌ **Web Browser Panels**
- No iframe embedding
- No web page rendering
- No HTML form elements

❌ **Native Text Input Fields**
- No keyboard input in VR (as of current documentation)
- No free-form text entry gizmos
- Limited to button-based interactions

❌ **Direct Web Integration**
- Cannot embed Customer.io web forms
- Cannot render external web content
- No WebView-style components

## Customer.io Form Options

### Option 1: Native Customer.io Forms (Web)

**What it is:**
- Customer.io's lead capture forms
- Embeddable via iframe or web widget
- Requires web browser environment

**Horizon Compatibility:** ❌ **Not Possible**
- Horizon doesn't support iframes
- No web content rendering in VR worlds

### Option 2: Customer.io API Integration (Server)

**What it is:**
- Direct API calls to Customer.io
- Server-side data submission
- Programmatic customer creation

**Horizon Compatibility:** ✅ **Fully Supported**
- TypeScript fetch() to your web API
- Web API forwards to Customer.io
- Already implemented in `/api/track`

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
│  • type: "identify"                                 │
│  • Enriches VR user data                            │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  Customer.io API                                    │
│  • Creates/updates customer profile                │
│  • Triggers welcome campaigns                       │
│  • Tags for VR user segment                         │
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

  // Button click handlers
  onDrinkSelection(drink: string) {
    this.selectedOptions.drinkPreference = drink;
    // Update UI to show selection
  }

  onExperienceSelection(experience: string) {
    this.selectedOptions.experienceInterest = experience;
  }

  onFrequencySelection(frequency: string) {
    this.selectedOptions.visitFrequency = frequency;
  }

  async onSubmit() {
    // Send to web API
    await fetch('https://your-app.vercel.app/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'identify',
        userId: this.props.userId,
        traits: {
          drink_preference: this.selectedOptions.drinkPreference,
          experience_interest: this.selectedOptions.experienceInterest,
          visit_frequency: this.selectedOptions.visitFrequency,
          platform: 'horizon',
          collected_in_vr: true,
        },
      }),
    });

    // Show confirmation UI
    this.displayThankYou();
  }

  displayThankYou() {
    // Update VR UI to show "Thank you!" message
  }
}
\`\`\`

### VR Form UI Design

**Gizmo Layout:**
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

**Interaction:**
- User points with VR controller
- Clicks button to select option
- Selected buttons change color
- Submit sends data to Customer.io

## Hybrid Approach: VR + Web Handoff

For more complex intake (requiring free text), use QR code bridge:

### Step 1: Collect Basic Info in VR

\`\`\`typescript
// Quick VR form (2-3 button selections)
onVRFormComplete(data) {
  // Save basic preferences
  await identifyCustomer(data);

  // Generate personalized QR code
  const qrCode = generateQRCode(hz.world.playerId);

  // Display QR in VR
  showQRGizmo(qrCode);
}
\`\`\`

### Step 2: Detailed Form on Phone

\`\`\`
VR Message: "For exclusive offers, scan this QR code on your phone!"

QR Code → https://your-app.vercel.app/intake?vr_user_id=xyz123
\`\`\`

**Mobile web form:**
- Pre-filled with VR selections
- Full Customer.io form embed
- Text inputs for email, name, etc.
- Submits to Customer.io via existing API

**Benefits:**
- ✅ Complex data entry on familiar device (phone)
- ✅ Full Customer.io form capabilities
- ✅ Maintains VR immersion (QR code in-world)
- ✅ Tracks VR → web conversion funnel

## Customer.io Integration Code

### Web API (Already Implemented)

\`\`\`typescript
// app/api/track/route.ts
export async function POST(request: Request) {
  const body = await request.json();
  const { type, userId, traits } = body;

  if (type === "identify") {
    // Send to Customer.io
    await fetch("https://cdp.customer.io/v1/identify", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.NEXT_PUBLIC_CUSTOMERIO_SITE_ID}:${process.env.CUSTOMERIO_API_KEY}`
        ).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        traits: {
          ...traits,
          last_seen: new Date().toISOString(),
        },
      }),
    });

    return Response.json({ success: true, type: "identify" });
  }
}
\`\`\`

### Usage from Horizon

\`\`\`typescript
// Identify VR user with preferences
await fetch('https://your-app.vercel.app/api/track', {
  method: 'POST',
  body: JSON.stringify({
    type: 'identify',
    userId: hz.world.playerId,
    traits: {
      name: 'VR Guest', // Or collected via button selection
      drink_preference: 'cocktails',
      experience_interest: 'photo_booth',
      platform: 'horizon',
      vr_onboarding_complete: true,
    },
  }),
});
\`\`\`

## Use Cases

### Use Case 1: Guest Preferences (VR-Native)

**Scenario:** Quick preference survey in VR lounge

**Form Fields:**
- Drink type (buttons: Cocktails, Wine, Beer, Non-Alcoholic)
- Experience interest (buttons: Photo Booth, AR Menus, Gestures)
- Visit frequency (buttons: First Time, Monthly, Weekly)

**Implementation:** Native VR form (100% in Horizon)

### Use Case 2: Event Registration (Hybrid)

**Scenario:** Sign up for exclusive VR event

**VR Step:**
- Select event date (button grid)
- Choose experience tier (Standard, Premium, VIP)
- Display QR code

**Mobile Step:**
- Scan QR code
- Enter name, email, phone (text inputs)
- Confirm registration

**Implementation:** VR form → QR code → Mobile web form

### Use Case 3: Feedback Collection (VR-Native)

**Scenario:** Post-experience satisfaction survey

**Form Fields:**
- Experience rating (buttons: 1-5 stars)
- Favorite feature (buttons: Photo, Cocktails, Gestures)
- Would recommend? (buttons: Yes, Maybe, No)

**Implementation:** Native VR form (100% in Horizon)

## Comparison Matrix

| Approach | Data Richness | VR Immersion | Implementation | Customer.io Integration |
|----------|---------------|--------------|----------------|-------------------------|
| **Native VR Form** | ⭐⭐ Limited | ⭐⭐⭐⭐⭐ Perfect | ⭐⭐⭐⭐ Easy | ✅ Via API |
| **QR → Mobile Form** | ⭐⭐⭐⭐⭐ Full | ⭐⭐⭐ Good | ⭐⭐⭐ Moderate | ✅ Direct embed |
| **Exit to Browser** | ⭐⭐⭐⭐ High | ⭐ Poor | ⭐⭐⭐⭐ Easy | ✅ Direct embed |
| **Voice Input** | ⭐⭐⭐ Moderate | ⭐⭐⭐⭐ Good | ⚠️ Complex | ✅ Via API |

## Recommendation

### For December 15 Launch

**Primary:** Native VR Forms (button-based)
- Quick 3-5 question surveys
- Pre-defined options only
- Instant Customer.io integration
- No VR exit required

**Secondary:** QR Code Handoff (if detailed data needed)
- Display QR in VR for complex forms
- User scans with phone
- Full Customer.io form on mobile web
- Tracks VR → web conversion

### Future Enhancement (Q1 2026)

**Voice Input Integration**
- Quest voice commands for text input
- "Hey Meta, my email is jane@example.com"
- Speech-to-text → Customer.io
- Requires Quest voice API research

## Implementation Checklist

### Native VR Form (Quick Win)

- [ ] Design button-based form UI in Horizon
- [ ] Create TypeScript script for selections
- [ ] Test fetch() to `/api/track` from VR
- [ ] Verify Customer.io profile creation
- [ ] Add "Thank You" confirmation UI

### QR Code Handoff (If Needed)

- [ ] Generate QR codes with user IDs
- [ ] Display QR in VR gizmo
- [ ] Create mobile intake page
- [ ] Embed Customer.io form
- [ ] Test end-to-end flow

### Analytics Tracking

- [ ] Track `vr_form_started`
- [ ] Track `vr_form_completed`
- [ ] Track `qr_code_displayed` (if hybrid)
- [ ] Track `mobile_form_completed` (if hybrid)

## Summary

**Bottom Line:**
- ❌ Cannot embed Customer.io web forms directly in VR
- ✅ Can collect data via native VR forms (buttons)
- ✅ Can integrate with Customer.io via existing API
- ✅ Can use QR codes for complex web forms

**Recommended Approach:**
- Start with button-based VR forms (simple, immersive)
- Use QR code handoff only when text input essential
- Leverage existing `/api/track` Customer.io integration

**December 15 Launch:**
- Ship with native VR preference survey
- Collect drink preferences, experience interests
- No need for complex text input in MVP
