# Meta Data Use Policy (DDUP) Compliance Assessment

## Executive Summary
This document analyzes the Emerald Gem analytics stack (Amplitude + Customer.io + Custom Track API) against Meta's Platform Terms and Data Use Policy. 

**Status:** ⚠️ **Partially Compliant** 
*Requires implementation of Data Deletion mechanism and Limited Data Use (LDU) flags.*

## Compliance Checklist

| Requirement | Status | Current Implementation | Gap / Action Item |
| :--- | :--- | :--- | :--- |
| **Data Deletion** | 🔴 **Missing** | No automated way for users to request data deletion. | **Critical:** Add `deleteUserData` function and API endpoint. |
| **Limited Data Use (LDU)** | 🔴 **Missing** | No flag to restrict data processing for CCPA. | **High:** Add `ldu_enabled` flag to event schema. |
| **Prohibited Data** | 🟢 **Compliant** | No health, financial, or biometric data sent. | Maintain strict schema reviews. |
| **Opt-in/Consent** | 🟡 **Partial** | `sovereignty_flag` in schema but not enforced. | Enforce `sovereignty_flag` check before tracking. |
| **Pixel/CAPI Alignment** | 🟡 **Partial** | CAPI not yet active in `route.ts`. | Ensure LDU is passed when CAPI is enabled. |

## 1. Data Deletion Protocol
**Meta Requirement:** Developers must provide a way for users to request data deletion and must delete data upon request.
**Solution:**
- Add `delete_user_data` event type to `app/api/track/route.ts`.
- Forward deletion requests to Customer.io and Amplitude.
- Log deletion request for audit trail.

## 2. Limited Data Use (LDU)
**Meta Requirement:** For CCPA compliance, businesses must be able to restrict data use.
**Solution:**
- Add `data_processing_options` to all events.
- Default to `['LDU']` for California users if location is known, or allow global toggle.

## 3. Sovereignty & Consent
**Solution:**
- The `sovereignty_flag` defined in `INTERPRETATION_LAYER_SCHEMA.md` must be checked in `lib/analytics.ts`.
- If `sovereignty_flag === false`, disable third-party tracking (Amplitude/Customer.io) and only keep local/essential state.

## Implementation Plan
1. Update `lib/analytics.ts` to support `deleteUser` and `sovereignty` checks.
2. Update `app/api/track/route.ts` to handle deletion requests.
3. Update `Privacy Policy` (external) to link to the deletion tool.
