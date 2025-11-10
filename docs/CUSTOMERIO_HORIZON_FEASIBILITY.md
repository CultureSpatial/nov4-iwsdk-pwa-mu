# Customer.io Intake Form in Meta Horizon Worlds - Feasibility Assessment

**Investigation Date:** January 2025  
**Status:** ⚠️ Limited Viability - Alternative Approach Required

## Executive Summary

Customer.io intake forms are **not directly viable** in Meta Horizon World containers due to platform limitations. However, **native UI alternatives** using Horizon's TypeScript UI system can achieve the same data collection goals with better UX.

---

## Technical Findings

### 1. Meta Horizon UI Capabilities

**Available:**
- ✅ Custom UI panels via TypeScript `UIComponent`
- ✅ Button interactions (A, B, X, Y controller mapping)
- ✅ Text gizmos for display
- ✅ Event-driven callbacks for user input
- ✅ Script components for form logic

**Not Available:**
- ❌ Web browser panels/iframe embedding
- ❌ HTML form elements (text inputs, dropdowns)
- ❌ Direct web content embedding
- ❌ Native text input fields (confirmed via research)

### 2. Customer.io Form Options

**Available:**
- ✅ In-app lead forms (journey-based)
- ✅ API integration (server-side)
- ✅ External form platform integrations (Formstack, Webflow, WPForms)

**Limitation:**
- ❌ No embeddable iframe/widget for VR environments
- ✅ But API-based submission works perfectly

---

## Recommended Approach: Native Horizon UI + Customer.io API

### Architecture

\`\`\`
[Horizon UI Panel] → [User Input via Buttons] → [TypeScript Script] → [Web API Endpoint] → [Customer.io CDP API]
\`\`\`

### Implementation Strategy

**Step 1: Build Native Horizon Form UI**
- Use UI gizmos (Text, Button) to create form interface
- Controller buttons for selection (A = confirm, B = back, Y = open keyboard)
- Text gizmos display prompts: "Name:", "Email:", "Interests:"

**Step 2: Data Collection Script**
\`\`\`typescript
// Horizon TypeScript example
import * as hz from 'horizon/core';

class IntakeFormScript extends hz.UIComponent<typeof IntakeFormScript> {
  static propsDefinition = {
    apiEndpoint: { type: hz.PropTypes.String },
  };

  formData = {
    name: '',
    email: '',
    interests: ''
  };

  async submitForm() {
    // Call your web API endpoint
    const response = await fetch(this.props.apiEndpoint!, {
      method: 'POST',
      body: JSON.stringify(this.formData)
    });
    
    if (response.ok) {
      console.log('Form submitted to Customer.io');
    }
  }
}
\`\`\`

**Step 3: Web API Bridge**
\`\`\`typescript
// Your existing web API: /api/customerio/intake
// Already exists at /api/track - just extend it!

export async function POST(request: Request) {
  const body = await request.json();
  
  // Send to Customer.io via CDP API
  await identifyUser(body.userId, {
    name: body.name,
    email: body.email,
    interests: body.interests,
    source: 'horizon_world'
  });
  
  return Response.json({ success: true });
}
\`\`\`

---

## Viability Score

| Criterion | Score | Notes |
|-----------|-------|-------|
| **Technical Feasibility** | 7/10 | Native UI works, but lacks text input fields |
| **User Experience** | 6/10 | Button-based input slower than typing |
| **Development Effort** | 8/10 | Already have API, just need Horizon UI |
| **Data Accuracy** | 9/10 | API integration is reliable |
| **Platform Support** | 10/10 | Works across Quest, mobile, MR |

**Overall: 8/10 - Viable with Native UI Alternative**

---

## Blockers & Workarounds

### Blocker 1: No Text Input Fields
**Impact:** Users can't type freely  
**Workaround Options:**
1. **Pre-set choices** - Multiple choice buttons for common answers
2. **Quest keyboard** - Open system keyboard (cumbersome but functional)
3. **Voice input** - Use Meta's voice commands (if available)
4. **QR code handoff** - Show QR in VR → user completes on phone

### Blocker 2: No Web Embed
**Impact:** Can't use Customer.io's web forms directly  
**Workaround:** ✅ Already solved via API integration (no blocker)

---

## Recommended Implementation Path

### Option A: Native VR Form (Best UX)
**Timeline:** 2-3 days  
**Steps:**
1. Build Horizon UI panel with Text + Button gizmos
2. Create button-based selection system (name, email, interests)
3. Connect to existing `/api/track` endpoint
4. Test data flow to Customer.io

**Pros:**
- Immersive VR experience
- No context switching
- Already have API integration

**Cons:**
- Limited to button inputs (no free text)
- Slower data entry

### Option B: QR Code Handoff (Fastest Development)
**Timeline:** 1 day  
**Steps:**
1. Generate unique QR code in Horizon World
2. Display QR on Media Board gizmo
3. User scans → opens web form on phone
4. Web form submits to Customer.io (existing flow)

**Pros:**
- Full web form capabilities
- Minimal Horizon development
- Fast user input on phone

**Cons:**
- Breaks VR immersion
- Requires phone access

### Option C: Hybrid Approach (Recommended)
**Timeline:** 3-4 days  
**Steps:**
1. Collect basic info in VR (name, email via button selection)
2. Show QR code for detailed intake form
3. Link VR session ID to web form submission

**Pros:**
- Best of both worlds
- Quick VR capture + detailed web follow-up
- Maintains engagement in VR

**Cons:**
- More complex flow
- Requires user education

---

## Integration with Existing Systems

### Already Built:
✅ `/api/track` endpoint for Customer.io  
✅ `identifyUser()` and `trackCustomerIOEvent()` functions  
✅ Customer.io CDP API integration  
✅ Intersection layer for Web↔Horizon bridge  

### Need to Build:
🔨 Horizon UI panel with intake form gizmos  
🔨 TypeScript script for form logic  
🔨 QR code generation (if using Option B/C)  

---

## Conclusion

**Direct Customer.io form embedding is not viable in Horizon Worlds**, but native UI with API integration achieves the same goal with acceptable UX tradeoffs. The **Hybrid Approach (Option C)** is recommended for your Royal Sonesta Seattle soft launch, balancing VR engagement with comprehensive data collection.

**Next Steps:**
1. Choose implementation option (A, B, or C)
2. Design Horizon UI panel layout
3. Implement TypeScript form script
4. Test end-to-end data flow to Customer.io

**Timeline to Production:** 3-5 days with existing API infrastructure.
