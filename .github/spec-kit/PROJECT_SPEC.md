# Emerald Gem AR Platform - Project Specification

## High-Level Description

Digital Royal Wardrobe: Cultural hospitality AR pilot transforming hotel guest experiences through immersive AR try-on flows (cocktails, photo moments, cultural content) delivered via mobile PWA and Meta Horizon VR/MR platforms.

## User Journeys

### Journey 1: Hotel Guest - AR Cocktail Experience
1. Guest scans QR code in hotel lobby
2. PWA loads with emerald glow entry animation
3. Front-facing camera activates for AR try-on
4. Guest browses 3D cocktail menu with nutritional info
5. Virtual cocktail appears in hand via AR
6. Guest captures photo with AR frame
7. Orders cocktail via Customer.io → hotel POS

### Journey 2: Hotel Guest - Photo Booth Experience
1. Guest accesses photo booth from main menu
2. Front-facing camera activates (60fps target)
3. Chooses Glinda avatar or emerald frame overlay
4. Takes photo with AR effects
5. Shares via social or downloads locally
6. Event tracked to Amplitude + Customer.io

### Journey 3: Meta Horizon VR Station
1. Guest puts on Quest 3 headset at hotel demo station
2. Launches Emerald Gem Horizon World
3. Interacts with 3D cocktail carousel via hand tracking
4. Views Tavus.io AI concierge avatar
5. Captures VR photo moment
6. Events sync to web analytics pipeline

### Journey 4: Competition Submission Flow
1. Developer joins Meta Horizon Start Program
2. Prepares demo video showcasing Passthrough Camera + AI
3. Documents lifestyle track positioning
4. Submits to Devpost by December 9
5. Includes Royal Sonesta launch proof (Dec 15)

## Desired Outcomes

### Business Outcomes
- 285% ROI from bundled hospitality offering
- Royal Sonesta Seattle soft launch December 15, 2025
- Win Meta Horizon Start Competition (Lifestyle Track + Special Award)
- Secure 3 hotel contracts Q1 2026
- Achieve 3B+ reach via Instagram/Facebook integration

### Technical Outcomes
- 60fps front-facing camera performance
- <2s load time for PWA
- 95%+ camera initialization success rate
- Cross-platform event tracking (web/mobile/VR unified)
- Zero critical bugs at launch
- Autonomous asset sync between web↔Horizon

### User Experience Outcomes
- Seamless AR try-on across devices
- Immersive cultural storytelling
- Frictionless QR onboarding
- Delightful photo capture moments
- Mirror-accurate selfie mode

## Success Criteria

### Launch Criteria (December 15)
- [ ] Camera system production-ready on 5+ device types
- [ ] AR try-on flows operational (cocktail + photo booth)
- [ ] Analytics pipeline capturing 100% of events
- [ ] Day-of runbook with recovery procedures
- [ ] Staff trained with troubleshooting guide

### Competition Criteria (December 9)
- [ ] Meta Horizon Start Program membership confirmed
- [ ] Demo video produced (3-5 minutes)
- [ ] Passthrough Camera + AI features documented
- [ ] Lifestyle track positioning clear
- [ ] Royal Sonesta launch mentioned as proof

### Technical Quality Criteria
- [ ] Front camera fallback chain tested (60fps→30fps→basic)
- [ ] Performance monitoring dashboard operational
- [ ] Error recovery UX handles all failure modes
- [ ] Cross-platform state sync functional
- [ ] Security audit passed (no exposed keys)

---

*This specification serves as the living contract for AI-driven development using GitHub Spec Kit.*
