# Interpretation Layer v0.1 Schema

## Overview
The Interpretation Layer acts as the semantic nervous system for the Emerald Gem platform, translating raw user interactions (Web, AR, VR) into meaningful cultural and business insights. This schema supports the **Meta Horizon Competition** narrative by demonstrating "Sovereign Data" and "Context-Aware" analytics.

## Event Taxonomy

### 1. SCENE_ENTERED
**Trigger:** User launches an AR experience or enters a VR world zone.
\`\`\`json
{
  "event_name": "SCENE_ENTERED",
  "timestamp": "ISO8601",
  "platform": "MHCP_WORLD | DEV_VR | DEV_WEB",
  "scene_id": "string (e.g., 'royal_wardrobe_hall')",
  "device_type": "string",
  "sovereignty_flag": "boolean (user data opt-in)"
}
\`\`\`

### 2. MUSEUM_ASSET_VIEWED
**Trigger:** User gaze or touch interacts with a specific artifact.
**SAM 3D Integration:** Uses `segment_id` to identify specific parts.
\`\`\`json
{
  "event_name": "MUSEUM_ASSET_VIEWED",
  "asset_id": "string",
  "duration_ms": "number",
  "interaction_type": "GAZE | TOUCH | MANIPULATE",
  "segment_id": "string (optional, from SAM 3D)",
  "segment_label": "string (e.g., 'emerald_center_stone')"
}
\`\`\`

### 3. REFLECTION_CAPTURED
**Trigger:** User takes a photo/video in the AR Photo Booth.
\`\`\`json
{
  "event_name": "REFLECTION_CAPTURED",
  "filter_id": "string",
  "camera_facing": "FRONT | REAR",
  "shared_to_social": "boolean"
}
\`\`\`

### 4. VENUE_TRANSACTION (Hospitality)
**Trigger:** User orders a cocktail or reserves an item.
\`\`\`json
{
  "event_name": "VENUE_TRANSACTION",
  "item_id": "string",
  "value": "number",
  "currency": "USD",
  "context": "AR_MENU | VR_CONCIERGE"
}
\`\`\`

### 5. THRESHOLD_CROSSED
**Trigger:** User moves between platforms (e.g., Web AR -> Horizon VR).
\`\`\`json
{
  "event_name": "THRESHOLD_CROSSED",
  "source_platform": "string",
  "target_platform": "string",
  "trigger_mechanism": "DEEP_LINK | QR_CODE"
}
\`\`\`

## Architecture
- **Ingest:** `intersection/event-bridge.ts` (Unified entry point)
- **Process:** Automatic enrichment with SAM 3D tags and User Sovereignty preferences.
- **Route:** 
  - **Amplitude:** Product Analytics (Retention, Funnels)
  - **Customer.io:** Engagement (Email/Push triggers)
  - **Vespa:** Personalization (Real-time ranking updates)
