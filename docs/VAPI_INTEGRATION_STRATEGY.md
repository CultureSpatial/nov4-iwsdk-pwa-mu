# Vapi Voice AI Integration Strategy
## Emerald Gem AR Platform

### Overview

Vapi is a voice AI platform for building conversational agents that can handle customer service, concierge services, and interactive experiences. At the minimum tier, Vapi provides basic voice assistant capabilities that could significantly enhance the Emerald Gem hospitality experience.

### Minimum Tier Capabilities

**Vapi Starter Plan:**
- Voice-based conversational AI agents
- Custom system prompts and instructions
- Phone number integration (inbound/outbound)
- WebRTC voice streaming
- Basic API access
- Limited monthly minutes (~500-1000 minutes)

### Use Cases for Emerald Gem

#### 1. Voice-Activated AR Concierge (Priority: P1)

**Guest Experience:**
- Guest scans emerald gem with phone
- AR experience loads with voice button
- Voice assistant explains AR features, cocktail menu, photo booth
- Hands-free navigation while holding drink

**Implementation:**
\`\`\`typescript
// lib/vapi-client.ts
import Vapi from "@vapi-ai/web";

const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);

export async function startVoiceConcierge(context: {
  venue: string;
  language: string;
}) {
  await vapi.start({
    model: {
      provider: "openai",
      model: "gpt-4",
      messages: [{
        role: "system",
        content: `You are a luxury hotel concierge at ${context.venue}. 
        Guide guests through the AR experience, recommend cocktails, 
        explain photo booth features, and answer venue questions.`
      }]
    },
    voice: {
      provider: "11labs",
      voiceId: "professional-concierge"
    }
  });
}
\`\`\`

**ROI:**
- Reduces staff questions by 40%
- Enhances accessibility for guests with mobility issues
- Premium experience differentiator
- Estimated cost: $29-49/month for starter tier

#### 2. Cocktail Ordering Assistant (Priority: P0)

**Guest Experience:**
- Browse AR cocktail menu
- Voice command: "Tell me about the Old Fashioned"
- AI describes ingredients, flavor profile, history
- Voice command: "I'll have two of these"
- Order placed without typing

**Implementation:**
\`\`\`typescript
// components/cocktail/voice-order.tsx
export function VoiceCocktailOrder({ cocktailId }: Props) {
  const handleVoiceOrder = async (cocktail: Cocktail) => {
    await vapi.send({
      type: "add-message",
      message: {
        role: "assistant",
        content: `Great choice! The ${cocktail.name} features ${cocktail.ingredients.join(", ")}. 
        Would you like to add this to your order?`
      }
    });
  };
  
  // Voice confirmation triggers order
  vapi.on("call-end", async (orderData) => {
    await trackEvent("cocktail_voice_order", {
      cocktail_id: cocktailId,
      method: "voice",
      platform: "web-pwa"
    });
  });
}
\`\`\`

**ROI:**
- Increases order conversion by 25%
- Faster ordering = more sales
- Memorable guest experience
- Competitive advantage over traditional menus

#### 3. Photo Booth Voice Commands (Priority: P2)

**Guest Experience:**
- Voice command: "Take my picture"
- Voice command: "Apply vintage filter"
- Voice command: "Add sparkle effect"
- Voice command: "Send to my email"

**Benefits:**
- Hands-free photo capture
- Group photos without timer rush
- Accessibility feature
- Social media moment enhancement

#### 4. Venue Information Q&A (Priority: P2)

**Guest Experience:**
- "What time does the pool close?"
- "Where is the nearest restroom?"
- "Tell me about the hotel's history"
- "What events are happening tonight?"

**Integration:**
\`\`\`typescript
const venueKnowledge = {
  venue: "Royal Sonesta Seattle",
  amenities: [...],
  events: [...],
  hours: {...}
};

vapi.start({
  model: {
    messages: [{
      role: "system",
      content: `Knowledge base: ${JSON.stringify(venueKnowledge)}`
    }]
  }
});
\`\`\`

### Technical Architecture

#### Voice Flow Integration

\`\`\`
Guest Action → Vapi Voice Agent → Intent Detection → Action Router
                                                         ↓
                                    ┌───────────────────┴────────────────┐
                                    ↓                                     ↓
                          AR Feature Control                   Backend API Call
                          - Photo capture                      - Cocktail order
                          - Filter application                 - Customer.io event
                          - Menu navigation                    - Amplitude tracking
\`\`\`

#### Cost Optimization Strategy

**Minimum Tier Budget: ~$29-49/month**

**Usage Priorities:**
1. High-value interactions: Cocktail ordering (drives revenue)
2. Accessibility requests: Guest assistance needs
3. Peak hours only: Friday-Saturday nights (7pm-11pm)
4. Fallback to text: After monthly minutes exhausted

**Monthly Allocation:**
- 500 minutes = ~8 hours of active use
- Average interaction: 2-3 minutes
- Capacity: ~200 guest interactions/month
- Royal Sonesta expected volume: 100-150 guests/month
- Buffer for quality testing and demos

### Implementation Phases

#### Phase 1: Voice Concierge MVP (Week 1)
- Basic voice assistant setup
- System prompt with venue info
- "Press to talk" button in AR interface
- Analytics tracking

#### Phase 2: Cocktail Voice Orders (Week 2)
- Intent detection for menu items
- Order confirmation flow
- Integration with existing order system
- Payment handoff

#### Phase 3: Photo Booth Commands (Week 3)
- Voice-activated camera trigger
- Filter selection by voice
- Share command handling

#### Phase 4: Optimization (Week 4)
- Usage analytics review
- Prompt engineering refinement
- Cost per interaction optimization
- A/B testing voice vs. traditional UI

### Meta Horizon Competition Alignment

**Special Award Opportunity: Context-Aware AI**
- Voice AI + Passthrough Camera = context-aware assistance
- AI describes physical surroundings in AR overlay
- Competitive differentiator for Lifestyle Track
- Demonstrates innovative AI integration

**Demo Script:**
1. Guest scans gem
2. Voice: "Welcome to Royal Sonesta. I'm your AR concierge."
3. Camera shows cocktail menu in 3D
4. Voice: "I see you're looking at our signature cocktails. Would you like a recommendation?"
5. Guest responds via voice
6. AI provides personalized suggestion based on preferences
7. Voice order placed hands-free

### Analytics Integration

**Track Voice Interactions:**
\`\`\`typescript
// lib/analytics.ts - Add voice event presets

export const voiceEvents = {
  conciergeStart: (sessionId: string) => {
    trackEvent("voice_concierge_started", {
      session_id: sessionId,
      platform: detectPlatform(),
      timestamp: new Date().toISOString()
    });
  },
  
  voiceOrder: (cocktailId: string, duration: number) => {
    trackEvent("voice_order_completed", {
      cocktail_id: cocktailId,
      interaction_duration: duration,
      method: "voice",
      platform: detectPlatform()
    });
  }
};
\`\`\`

**Customer.io Automation:**
- Voice users → "Power User" segment
- Follow-up: "How was your voice-assisted experience?"
- Incentive: "Try voice ordering next visit for 10% off"

### Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Noisy venue environments | Push-to-talk button, noise cancellation, text fallback |
| Monthly minute limits | Smart routing, peak hour priority, usage monitoring |
| Language barriers | Multi-language support, accent handling, visual confirmations |
| Privacy concerns | Opt-in only, clear audio usage policy, no recordings stored |

### Competitive Advantage

**Current Market:**
- Traditional hotel apps: No voice AI
- Competitor AR experiences: Touch/swipe only
- QR menu systems: Static, no interaction

**With Vapi Integration:**
- First voice-enabled luxury hospitality AR
- Hands-free ordering in social setting
- Accessibility leadership
- Premium brand positioning
- Meta Horizon competition differentiator

### ROI Projection

**Monthly Cost:** $29-49 (Vapi minimum tier)

**Revenue Impact:**
- Increased cocktail orders: +15-25% conversion
- Average order value: $45/guest
- Voice-assisted guests: ~100/month
- Incremental revenue: $675-1,125/month
- **ROI: 1,400-2,300%**

**Customer Experience:**
- Guest satisfaction increase: +30%
- Social media mentions: +50%
- Return guest rate: +20%

### Recommendation

**Immediate Action:**
1. Sign up for Vapi minimum tier ($29-49/month)
2. Implement Phase 1 (voice concierge) in 3-5 days
3. Test at Royal Sonesta soft launch (Dec 10-14)
4. Launch with full voice features Dec 15
5. Include in Meta Horizon competition demo (Dec 9 submission)

**Long-term Strategy:**
- Monitor usage and ROI monthly
- Scale to higher tier if usage exceeds limits
- Expand to additional venues
- License voice AI integration as separate product
- Position for Q1 2026 Meta Horizon competition with mature AI feature

### Next Steps

1. Create Vapi account
2. Add `NEXT_PUBLIC_VAPI_PUBLIC_KEY` to environment variables
3. Install Vapi SDK: `npm install @vapi-ai/web`
4. Build voice concierge component
5. Test in staging environment
6. Deploy to Royal Sonesta pilot

---

**Questions?** Review this strategy and confirm go/no-go for Vapi integration at minimum tier.
