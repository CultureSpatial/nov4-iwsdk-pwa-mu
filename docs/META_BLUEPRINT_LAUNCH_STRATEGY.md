# Meta Blueprint Launch Strategy for Emerald Gem AR Platform

## Overview

Meta Blueprint is Meta's official education and certification platform for advertising and business tools. For the Emerald Gem AR platform launch at Royal Sonesta Seattle (December 15, 2025), leveraging Meta Blueprint provides critical knowledge for marketing the AR experience through Facebook and Instagram advertising.

## What is Meta Blueprint?

### Platform Capabilities

**Education:**
- Free online learning modules (200+ courses)
- Interactive courses on Facebook/Instagram advertising
- Best practices for creative strategy
- Audience targeting fundamentals
- Campaign optimization techniques

**Certification:**
- Meta Certified Planning Professional
- Meta Certified Buying Professional
- Performance Marketing Specialist Badge
- Verified skills for ad platform mastery

**Key Topics Relevant to Emerald Gem:**
- Increase sales (driving in-store and online purchases)
- Creative inspiration (Reels, Stories, AR content)
- Audience targeting (reaching hotel guests and luxury consumers)
- Results measurement (conversions, engagement tracking)
- Video content creation (AR experience demos)

## Strategic Alignment with Launch

### Why Meta Blueprint Matters for December 15 Launch

**1. Instagram/Facebook = Primary Discovery Channel**
- 3 billion+ monthly active users across Meta platforms
- Instagram's visual-first format ideal for AR demos
- Stories and Reels native AR filter integration
- Geo-targeting for Royal Sonesta Seattle area

**2. Royal Sonesta Guest Acquisition**
- Target travelers searching for Seattle hotels
- Retarget Royal Sonesta website visitors
- Lookalike audiences from luxury hospitality
- Event-based targeting (conferences, leisure travel)

**3. AR Experience Promotion**
- Video ads showing AR photo booth
- Carousel ads featuring cocktail menu
- Collection ads for Digital Royal Wardrobe
- Instagram Story AR filters (native integration)

## Launch Advertising Needs

### Campaign Structure

#### Campaign 1: Awareness (Pre-Launch: Dec 1-14)

**Objective:** Brand awareness for Emerald Gem AR experience

**Target Audience:**
- 25-55 years old
- Interest in: luxury travel, boutique hotels, AR/VR tech
- Location: Seattle metro + travelers planning Seattle trips
- Lookalike: Royal Sonesta email subscribers

**Ad Formats:**
- Instagram Reels (60-sec AR experience demo)
- Facebook Video Ads (behind-the-scenes at Royal Sonesta)
- Instagram Stories (AR filter preview)

**Budget:** $2,000-3,000
**KPI:** 100K+ impressions, 5% engagement rate

#### Campaign 2: Consideration (Launch Week: Dec 15-22)

**Objective:** Drive on-property visits and AR engagement

**Target Audience:**
- Royal Sonesta website visitors (30-day retargeting)
- Hotel searchers in Seattle (Advantage+ targeting)
- Engaged with previous awareness ads

**Ad Formats:**
- Carousel ads (photo booth + cocktail menu + try-on)
- Collection ads (Digital Royal Wardrobe items)
- Messenger ads (chatbot with AR QR code)

**Budget:** $3,000-5,000
**KPI:** 500+ link clicks, 10% CTR, 50+ on-property activations

#### Campaign 3: Conversion (Post-Launch: Dec 23-31)

**Objective:** Drive Digital Royal Wardrobe purchases

**Target Audience:**
- Used AR experience on-property
- Engaged with Collection ads
- Cart abandoners (retargeting)

**Ad Formats:**
- Dynamic Product Ads (personalized recommendations)
- Stories with "Swipe Up" to shop
- Advantage+ Shopping campaigns

**Budget:** $2,000-3,000
**KPI:** $10K+ in Digital Royal Wardrobe revenue, 5x ROAS

### Total Launch Ad Budget: $7,000-11,000

## Required Meta Blueprint Training

### Priority Courses for Immediate Implementation

**1. Get Started with Advertising (Foundation)**
- Duration: 2-3 hours
- Topics: Ads Manager basics, campaign creation, billing setup
- **Action:** Complete by Dec 1

**2. Your Guide to Audience Targeting**
- Duration: 1-2 hours
- Topics: Custom audiences, lookalikes, interest targeting
- **Action:** Build Royal Sonesta guest personas (Dec 2)

**3. Creative Inspiration**
- Duration: 2 hours
- Topics: Instagram Reels best practices, Stories engagement, video ads
- **Action:** Create AR demo video templates (Dec 3-5)

**4. Manage Ads with Automated Tools**
- Duration: 1 hour
- Topics: Advantage+ campaigns, automated placements, budget optimization
- **Action:** Set up automated campaigns (Dec 6-8)

**5. Optimize Your Campaigns**
- Duration: 2 hours
- Topics: Conversions API, pixel setup, attribution, A/B testing
- **Action:** Install Meta Pixel on emeraldgem.ai (Dec 9)

**Total Training Time: 8-10 hours (spread over 2 weeks)**

### Optional Advanced Training (Q1 2026)

**Meta Certified Media Buying Professional**
- Full certification exam
- Deep dive into bid strategies
- Advanced measurement
- **Timeline:** Pursue after launch with real data

## Technical Implementation Requirements

### Meta Business Suite Setup

**1. Facebook Business Manager**
- Create Business Manager account
- Add Royal Sonesta as business partner
- Set up ad account with payment method
- Assign user roles (advertiser, analyst)

**2. Meta Pixel Installation**

\`\`\`typescript
// app/layout.tsx
'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

declare global {
  interface Window {
    fbq: any
  }
}

export default function RootLayout({ children }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Initialize Meta Pixel
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('init', process.env.NEXT_PUBLIC_META_PIXEL_ID)
      window.fbq('track', 'PageView')
    }
  }, [pathname, searchParams])

  return (
    <html lang="en">
      <head>
        {/* Meta Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: \`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
            \`
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={\`https://www.facebook.com/tr?id=\${process.env.NEXT_PUBLIC_META_PIXEL_ID || "/placeholder.svg"}&ev=PageView&noscript=1\`}
          />
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  )
}
\`\`\`

**3. Conversion Events**

\`\`\`typescript
// lib/meta-tracking.ts
export function trackMetaEvent(eventName: string, eventData?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, eventData)
  }
}

// Usage examples
trackMetaEvent('ViewContent', { content_name: 'AR Photo Booth' })
trackMetaEvent('AddToCart', { value: 45.00, currency: 'USD' })
trackMetaEvent('Purchase', { value: 89.00, currency: 'USD' })
trackMetaEvent('Lead', { content_category: 'AR Experience' })
\`\`\`

**4. Conversions API (Server-Side Tracking)**

\`\`\`typescript
// app/api/meta-conversion/route.ts
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const FACEBOOK_PIXEL_ID = process.env.META_PIXEL_ID
const FACEBOOK_ACCESS_TOKEN = process.env.META_CONVERSIONS_API_TOKEN

export async function POST(req: NextRequest) {
  const { event_name, user_data, custom_data } = await req.json()
  
  // Hash user data for privacy
  const hashedUserData = {
    em: user_data.email ? hashData(user_data.email) : undefined,
    ph: user_data.phone ? hashData(user_data.phone) : undefined,
    fn: user_data.first_name ? hashData(user_data.first_name) : undefined,
    ln: user_data.last_name ? hashData(user_data.last_name) : undefined,
  }
  
  const payload = {
    data: [
      {
        event_name,
        event_time: Math.floor(Date.now() / 1000),
        user_data: hashedUserData,
        custom_data,
        event_source_url: req.headers.get('referer'),
        action_source: 'website'
      }
    ]
  }
  
  const response = await fetch(
    \`https://graph.facebook.com/v18.0/\${FACEBOOK_PIXEL_ID}/events?access_token=\${FACEBOOK_ACCESS_TOKEN}\`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }
  )
  
  return NextResponse.json(await response.json())
}

function hashData(data: string): string {
  return crypto.createHash('sha256').update(data.toLowerCase().trim()).digest('hex')
}
\`\`\`

### Instagram AR Filter Development

**Option 1: Web-Based AR (Preferred)**
- Use existing IWSDK camera system
- Share link to emeraldgem.ai in Instagram posts
- No Spark AR required (platform shut down Jan 2025)

**Option 2: Instagram Story Stickers**
- Create branded stickers for user-generated content
- QR code sticker linking to AR experience
- Hashtag campaign: #EmeraldGemAR

## Campaign Creative Assets

### Required Assets (by Dec 8)

**1. Video Ads (3 versions)**
- 60-second Instagram Reel (AR experience showcase)
- 30-second Facebook Feed Video (customer testimonials)
- 15-second Instagram Stories (quick demo loop)

**2. Static Images (6 variations)**
- AR photo booth in action (3 frames)
- Cocktail menu 3D renders (2 drinks)
- Digital Royal Wardrobe try-on screenshot

**3. Copy Variations (A/B testing)**
- Headline: 5 variations
- Body text: 3 variations
- Call-to-action: 3 variations

**4. Landing Page**
- emeraldgem.ai/royal-sonesta (dedicated page)
- QR code for instant AR access
- "Book Your AR Experience" CTA

### Creative Best Practices (from Blueprint)

**Instagram Reels:**
- First 3 seconds critical (hook viewers)
- Vertical 9:16 format
- On-screen text (80% watch without sound)
- Trending audio overlay
- Clear CTA at end

**Stories Ads:**
- Full-screen immersive format
- Swipe-up link to AR experience
- Tap-to-sound indicator
- Timer urgency (limited-time AR frames)

**Feed Ads:**
- Square 1:1 format (mobile-optimized)
- Carousel showcases multiple features
- User-generated content builds trust
- Social proof (guest photos/videos)

## Budget Allocation & ROI Projections

### Ad Spend Breakdown

| Campaign Phase | Budget | Duration | Expected Results |
|---------------|--------|----------|------------------|
| Awareness | $2,500 | Dec 1-14 | 150K impressions, 7.5K engagements |
| Consideration | $4,000 | Dec 15-22 | 800 link clicks, 80 on-property activations |
| Conversion | $2,500 | Dec 23-31 | $12.5K Digital Wardrobe revenue |
| **Total** | **$9,000** | **1 month** | **5x ROAS ($45K total impact)** |

### ROI Calculation

**Direct Revenue:**
- Digital Royal Wardrobe sales: $12,500
- Incremental cocktail orders: $5,400 (40 extra guests × 1.5 cocktails × $18)
- Premium AR feature upsells: $2,100 (Royal Sonesta subscription)
- **Total Direct: $20,000**

**Indirect Value:**
- PR/media coverage (award finalist): $15,000 equivalent
- Royal Sonesta partnership renewal: $6,000 annual contract
- Investor interest (valuation increase): Unquantified
- **Total Indirect: $21,000+**

**Combined Impact: $41,000+ from $9,000 ad spend = 4.5x ROI**

## Launch Timeline with Meta Blueprint Integration

### Week 1: Training & Setup (Nov 29 - Dec 5)

**Day 1-2 (Nov 29-30):**
- [ ] Complete "Get Started with Advertising" course
- [ ] Set up Facebook Business Manager
- [ ] Create ad account and add payment method
- [ ] Install Meta Pixel on emeraldgem.ai

**Day 3-4 (Dec 1-2):**
- [ ] Complete "Audience Targeting" course
- [ ] Build custom audiences (website visitors, email list)
- [ ] Create lookalike audiences (Royal Sonesta guests)
- [ ] Define persona targeting (luxury travelers, AR enthusiasts)

**Day 5-7 (Dec 3-5):**
- [ ] Complete "Creative Inspiration" course
- [ ] Film AR experience demo footage
- [ ] Edit video ads (Reels, Stories, Feed)
- [ ] Design static image ads (Canva/Figma)

### Week 2: Campaign Launch (Dec 6-12)

**Day 8-9 (Dec 6-7):**
- [ ] Complete "Automated Tools" course
- [ ] Set up Advantage+ campaigns
- [ ] Configure automated placements
- [ ] Launch Awareness campaign

**Day 10-11 (Dec 8-9):**
- [ ] Complete "Optimize Campaigns" course
- [ ] Install Conversions API
- [ ] Set up attribution tracking
- [ ] Submit Meta Horizon competition (Dec 9)

**Day 12-13 (Dec 10-11):**
- [ ] Monitor campaign performance
- [ ] A/B test creative variations
- [ ] Adjust budgets based on performance
- [ ] Optimize audience targeting

### Week 3: Launch & Conversion (Dec 13-19)

**Day 14-15 (Dec 12-13):**
- [ ] Final campaign optimizations
- [ ] Launch Consideration campaign
- [ ] Prepare on-property signage with QR codes
- [ ] Train Royal Sonesta staff on AR experience

**Day 16 (Dec 15): LAUNCH DAY**
- [ ] Activate all ad campaigns
- [ ] Monitor real-time engagement
- [ ] Respond to social media mentions
- [ ] Track on-property AR usage

**Day 17-21 (Dec 16-19):**
- [ ] Launch Conversion campaign
- [ ] Retarget engaged users
- [ ] Optimize for Digital Wardrobe purchases
- [ ] Daily reporting to Royal Sonesta

### Week 4: Post-Launch Optimization (Dec 20-31)

- [ ] Analyze campaign performance
- [ ] Scale winning ad sets
- [ ] Pause underperforming creatives
- [ ] Prepare Q1 2026 strategy

## Key Performance Indicators (KPIs)

### Campaign Metrics

**Awareness:**
- Reach: 100K+ unique users
- Impressions: 200K+
- Engagement rate: 5%+
- Cost per 1000 impressions (CPM): <$15

**Consideration:**
- Link clicks: 800+
- Click-through rate (CTR): 10%+
- Cost per click (CPC): <$5
- Landing page views: 600+

**Conversion:**
- Purchases: 140+ (Digital Wardrobe)
- Conversion rate: 15%+
- Cost per acquisition (CPA): <$18
- Return on ad spend (ROAS): 5x+

### Business Impact

- On-property AR activations: 500+ guests
- Digital Royal Wardrobe revenue: $12,500+
- Cocktail order increase: 40%+
- Royal Sonesta partnership renewal: Secured
- Meta Horizon competition: Finalist status

## Risk Mitigation

### Potential Challenges

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Ad account suspended | Low | High | Follow Meta policies, verify business |
| Budget overruns | Medium | Medium | Daily budget caps, automated rules |
| Low engagement | Medium | High | A/B test aggressively, pivot creative |
| Conversion issues | Medium | High | Optimize landing page, simplify checkout |
| Attribution gaps | High | Medium | Implement Conversions API, multi-touch |

### Contingency Plans

**If Ad Performance Underperforms:**
1. Pause campaigns immediately
2. Analyze diagnostics in Ads Manager
3. Test new creative variations
4. Adjust targeting parameters
5. Reduce budget to profitable ad sets only

**If Meta Pixel Issues:**
1. Use server-side Conversions API as backup
2. Manual tracking via Customer.io
3. QR code attribution (URL parameters)

## Competitive Advantages

### Why Meta Advertising for AR Launch?

**1. Visual Medium Match**
- Instagram/Facebook = visual-first platforms
- AR demos thrive in short-form video
- Native Story AR filter potential

**2. Precise Targeting**
- Geo-targeting: Seattle metro + travelers
- Interest targeting: luxury hospitality, AR tech
- Behavioral: hotel searchers, luxury shoppers

**3. Multi-Touch Attribution**
- Track full customer journey
- Pixel + Conversions API = complete data
- Attribution across devices

**4. Scalability**
- Campaign Templates for future venues
- Reusable creative assets
- Automated audience expansion

## Next Steps (Immediate Actions)

### This Week (By Dec 1)

1. **Sign up for Meta Blueprint** (free account)
2. **Complete first course**: "Get Started with Advertising"
3. **Set up Business Manager**: Add Royal Sonesta partnership
4. **Create ad account**: Link payment method
5. **Install Meta Pixel**: Add to emeraldgem.ai codebase

### Decision Point (Dec 2)

**Assess:**
- Is $9,000 ad budget approved?
- Are creative assets production-ready?
- Is landing page optimized for conversion?

**Options:**
1. **Full Campaign**: $9,000 budget, all three phases
2. **Conservative**: $4,000 budget, Awareness + Consideration only
3. **Organic Only**: Skip paid ads, rely on PR and word-of-mouth

**Recommendation:** Full campaign ($9,000) for maximum launch impact and 4.5x ROI potential.

## Conclusion

Meta Blueprint provides the foundational knowledge needed to effectively market the Emerald Gem AR platform through Facebook and Instagram advertising. With 8-10 hours of targeted training completed by December 8, combined with $9,000 in strategic ad spend, the Royal Sonesta launch is positioned for:

- 150K+ impressions across luxury hospitality audiences
- 500+ on-property AR activations
- $12,500+ in Digital Royal Wardrobe revenue
- 4.5x overall return on ad investment
- Strong competitive positioning for Meta Horizon awards

**Primary Objective:** Leverage Meta Blueprint education to drive measurable ROI for Royal Sonesta launch.

**Secondary Objective:** Build repeatable campaign templates for multi-venue expansion in Q1 2026.
