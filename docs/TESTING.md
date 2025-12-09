# Testing Guide

## Phase 1: IWSDK Integration Testing

### Gold Test Box Verification
1. Navigate to `/ring-room`
2. Verify gold cube (0.5x0.5x0.5m) is visible above the rings
3. Verify cube rotates at 0.5 RPM
4. Verify "Phase 1: IWSDK Test" label is displayed

### IWSDK Status Verification
1. On Quest device: Should show "IWSDK Active" (green)
2. On desktop: Should show "IWSDK Inactive" (red) or fallback mode
3. Check `/test/iwsdk` page for detailed capabilities

## Phase 2: Ring Interaction Testing

### Shortlist Operations
- [ ] Click ring to select
- [ ] Drag ring down to add to shortlist
- [ ] Verify haptic feedback on add
- [ ] Max 10 items enforced
- [ ] Persistence across page refresh

### Detail Panel
- [ ] Click ring opens detail panel
- [ ] Swipe/keyboard navigation works
- [ ] 360° rotation controls work
- [ ] "Add to Shortlist" button works
- [ ] "Try in AR" button tracks analytics

## Phase 3: XR Experience Testing

### VR Mode (Quest)
- [ ] "Enter VR" button appears on Quest
- [ ] Session starts successfully
- [ ] Rings positioned correctly (1.2-1.3m height)
- [ ] Hand tracking displays (if supported)
- [ ] Controllers work for selection
- [ ] "Exit XR" button works

### AR Mode (Quest/Mobile)
- [ ] "Enter AR" button appears on supported devices
- [ ] Session starts with passthrough
- [ ] Hit-test reticle visible on surfaces
- [ ] Tap places ring at reticle position
- [ ] Max 3 rings can be placed
- [ ] Spatial anchors created (Quest only)

## Phase 4: Production Checklist

### Performance
- [ ] First Load JS < 200KB
- [ ] Time to Interactive < 3s on 4G
- [ ] FPS > 60 on Quest
- [ ] No memory leaks (monitor with Chrome DevTools)

### Accessibility
- [ ] Tab navigation works throughout
- [ ] Screen reader announces state changes
- [ ] Color contrast > 4.5:1
- [ ] Touch targets > 44x44px
- [ ] Focus indicators visible

### Error Handling
- [ ] Error boundaries catch failures
- [ ] User-friendly error messages shown
- [ ] "Try Again" and "Go Home" actions work
- [ ] WebGL context loss handled gracefully

### Analytics
- [ ] All events fire correctly (check Vercel dashboard)
- [ ] Session tracking works
- [ ] Error events logged
- [ ] XR events tracked

## Browser Compatibility Matrix

| Browser | Desktop | Mobile | Quest |
|---------|---------|--------|-------|
| Chrome | ✅ | ✅ | N/A |
| Safari | ✅ | ✅ | N/A |
| Firefox | ✅ | ✅ | N/A |
| Meta Quest Browser | N/A | N/A | ✅ |
| Wolvic | N/A | N/A | ✅ |

## Known Limitations

1. IWSDK spatial anchors only work on Quest devices
2. AR mode requires WebXR AR Module support
3. Hand tracking requires Quest 2+ with tracking enabled
4. Voice commands are Phase 5 (not implemented)
