# SAM 3D Asset Intelligence Pipeline

## Overview
This document outlines the strategy for leveraging **Meta's SAM 2.1 / SAM 3D** technology to automate the semantic understanding of 3D assets (jewelry, artifacts) for the Emerald Gem platform. This pipeline directly supports the **"Context-Aware AI"** special award in the Meta Horizon Start Developer Competition.

## Core Concept
Instead of treating 3D assets as single monolithic objects, we use SAM 3D to segment them into semantic parts (e.g., "Gem", "Clasp", "Filigree"). This granular understanding enables:
1.  **Precision Analytics:** Tracking which *part* of an object a user is looking at (Interpretation Layer).
2.  **Intelligent Search:** Finding items based on specific component characteristics (Vespa.ai).
3.  **Dynamic Content:** Triggering voice narrations (Ruby NPC) specific to the highlighted segment.

## Workflow

### 1. Ingestion
- **Input:** High-fidelity GLB/USDZ scan of museum artifact or jewelry piece.
- **Source:** Digital Royal Wardrobe / Museum Partners.

### 2. Processing (SAM 3D)
- **Step A: Point Cloud Conversion:** Convert mesh to point cloud.
- **Step B: Segmentation:** Run SAM 3D to identify distinct geometric and visual segments.
- **Step C: Semantic Labeling:** Use VLM (e.g., Llama Vision) to tag segments (e.g., Segment 1 = "Emerald", Segment 2 = "Gold Setting").

### 3. Output & Integration
- **Asset:** GlTF file with `EXT_mesh_features` or named sub-meshes.
- **Metadata:** JSON map of `mesh_id` -> `semantic_tags`.

## Integration Points

### A. Interpretation Layer (Analytics)
When a user interacts with an asset in AR/VR:
- **Event:** `MUSEUM_ASSET_VIEWED`
- **Enrichment:** Include `segment_id` focused by user gaze/touch.
- **Outcome:** "User X is interested in *rubies* specifically, not just rings."

### B. Vespa.ai (Search)
- **Index:** Index individual segments as searchable documents.
- **Query:** "Show me jewelry with large emeralds."
- **Result:** Returns assets where SAM 3D identified a large emerald segment.

### C. Ruby NPC (Voice)
- **Trigger:** User gaze lingers on "Clasp" segment.
- **Action:** Ruby says, "Notice the intricate clasp mechanism, typical of the Victorian era."

## Implementation Plan (Dec 9 Competition)

### Phase 1: Proof-of-Concept
1.  **Manual Segmentation:** Manually segment 1 key asset (e.g., The Crown) to simulate SAM 3D output.
2.  **Event Wiring:** Fire `MUSEUM_ASSET_VIEWED` with segment data in the Web PWA.
3.  **Documentation:** Include this pipeline in the Technical Submission as "AI-Driven Asset Understanding."

### Phase 2: Automation (Q1 2026)
1.  Deploy SAM 3D inference server.
2.  Build automated "Upload -> Analyze -> Publish" pipeline.
