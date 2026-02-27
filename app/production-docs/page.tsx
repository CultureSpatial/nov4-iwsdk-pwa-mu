'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ProductionDocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Meta Ray-Ban Production Documents
          </h1>
          <p className="text-lg text-slate-600">
            We Rise Wine Shop • Seattle, WA
          </p>
        </div>

        {/* Tabs Interface */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <Tabs defaultValue="call-sheet" className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b bg-slate-50 p-0">
              <TabsTrigger
                value="call-sheet"
                className="rounded-none border-b-2 border-transparent px-6 py-4 data-[state=active]:border-blue-600 data-[state=active]:bg-white"
              >
                <span className="flex items-center gap-2">
                  <span className="text-xl">📋</span>
                  Call Sheet
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="production-schedule"
                className="rounded-none border-b-2 border-transparent px-6 py-4 data-[state=active]:border-blue-600 data-[state=active]:bg-white"
              >
                <span className="flex items-center gap-2">
                  <span className="text-xl">🎬</span>
                  Production Schedule
                </span>
              </TabsTrigger>
            </TabsList>

            {/* Call Sheet Tab */}
            <TabsContent value="call-sheet" className="p-0">
              <CallSheetContent />
            </TabsContent>

            {/* Production Schedule Tab */}
            <TabsContent value="production-schedule" className="p-0">
              <ProductionScheduleContent />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function CallSheetContent() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="border-b-4 border-purple-600 pb-6">
        <h2 className="text-3xl font-bold text-purple-600 mb-2">
          Meta Ray-Ban AR Glasses Verchandising Shoot
        </h2>
        <p className="text-lg text-slate-600">We Rise Wine Shop • Seattle, WA</p>
      </div>

      {/* Project Meta */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-slate-50 p-4 rounded-lg">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Shoot Date
          </p>
          <p className="text-lg font-semibold text-slate-900">TBD (Weekday AM)</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Call Time
          </p>
          <p className="text-lg font-semibold text-slate-900">09:00 - 12:00</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Location
          </p>
          <p className="text-lg font-semibold text-slate-900">We Rise Wines Bottle Shop</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Linear Parent
          </p>
          <p className="text-lg font-semibold text-purple-600">HOW-192</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Output
          </p>
          <p className="text-lg font-semibold text-slate-900">60-90s Sizzle + 5 Shots</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Budget
          </p>
          <p className="text-lg font-semibold text-slate-900">$2,500</p>
        </div>
      </div>

      {/* Mission Objectives */}
      <section>
        <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span>🎯</span> Mission Objectives
        </h3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-3">
          <p className="text-slate-700">
            <strong>Primary Goal:</strong> Capture proof-of-concept footage demonstrating Meta
            Ray-Ban Stories glasses recording verchandising experiences in a live wine retail
            environment.
          </p>
          <p className="text-slate-700">
            <strong>Deliverables:</strong> 60-90 second sizzle reel + 5-shot instructional
            micro-video + 10 high-res press stills + raw POV footage from glasses.
          </p>
          <p className="text-slate-700">
            <strong>Cross-Walk:</strong> Validates HOW-192 (Wine Tycoon Spine), feeds HOW-165
            (Spatial Pattern Library), demonstrates verchandising motion patterns.
          </p>
        </div>
      </section>

      {/* Crew & Contacts */}
      <section>
        <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span>👥</span> Crew & Contacts
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-purple-600 text-white">
                <th className="px-4 py-3 text-left text-sm font-semibold">Role</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Contact</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Responsibility</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  role: 'Producer',
                  name: 'TBD',
                  contact: '[Contact]',
                  responsibility: 'Shop access, schedule coordination',
                },
                {
                  role: 'Tech Lead',
                  name: 'TBD',
                  contact: '[Contact]',
                  responsibility: 'Meta Ray-Ban setup, recording management',
                },
                {
                  role: 'Video',
                  name: 'TBD',
                  contact: '[Contact]',
                  responsibility: 'Camera operation, gimbal work',
                },
                {
                  role: 'Audio',
                  name: 'TBD',
                  contact: '[Contact]',
                  responsibility: 'Lavalier mic, narration recording',
                },
                {
                  role: 'Host/Talent',
                  name: 'TBD',
                  contact: '[Contact]',
                  responsibility: 'On-camera demonstrations',
                },
                {
                  role: 'Shop Contact',
                  name: 'We Rise Wines',
                  contact: 'werisewines-bottleshop.square.site',
                  responsibility: 'Location access, wine selection',
                },
              ].map((item, idx) => (
                <tr key={idx} className="border-b hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-slate-900">{item.role}</td>
                  <td className="px-4 py-3 text-slate-700">{item.name}</td>
                  <td className="px-4 py-3 text-slate-600">{item.contact}</td>
                  <td className="px-4 py-3 text-slate-700">{item.responsibility}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Equipment Checklist */}
      <section>
        <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span>📦</span> Equipment Checklist (T-3 Days)
        </h3>
        <ul className="space-y-2">
          {[
            'Meta Ray-Ban Stories Glasses (2 units) - Charged to 100%, latest firmware',
            'Meta View App - Installed on iOS/Android, tested transfer workflow',
            'Laptop - For file management & quick review',
            'iPhone + Android Phone - PWA testing (verchandising UI mockups)',
            'Demo Wine Bottles (3) - From We Rise Wines inventory',
            'QR Codes + NFC Tags - Printed/programmed for demo anchors',
            'LED Panel + Diffuser - For interior lighting consistency',
            'Lavalier Mic + Backup Recorder - For unboxing narration',
            'Tripod + Gimbal - Locked-off shots + aisle walk',
            'Release Forms - Signed by shop + on-camera talent',
            'Backup Battery Pack - For phones + glasses',
          ].map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg">
              <span className="text-lg">☐</span>
              <span className="text-slate-700">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Wine Selection */}
      <section>
        <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span>🍷</span> Wine Selection Rationale
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-purple-600 text-white">
                <th className="px-4 py-3 text-left text-sm font-semibold">Wine</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Price</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Role</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Why Selected</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  wine: 'WeRise 2023 Cabernet Sauvignon',
                  price: '$45.00',
                  role: 'Hero Bottle (AR Label Scan)',
                  why: 'Brand alignment, mid-price anchor, premium positioning',
                },
                {
                  wine: 'Mvinyo Winery Rafiki Rosé',
                  price: '$35.00',
                  role: 'Bundle Demo (Women Winemakers)',
                  why: 'Narrative diversity, pairing opportunity, accessible price',
                },
                {
                  wine: 'Maison Noir O.P.P. Pinot Noir',
                  price: '$37.00',
                  role: 'Shelf Browse (Infinite Shelf Demo)',
                  why: 'Mid-tier price, storytelling potential, visual appeal',
                },
              ].map((item, idx) => (
                <tr key={idx} className="border-b hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-slate-900">{item.wine}</td>
                  <td className="px-4 py-3 text-slate-700">{item.price}</td>
                  <td className="px-4 py-3 text-slate-700">{item.role}</td>
                  <td className="px-4 py-3 text-slate-700">{item.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function ProductionScheduleContent() {
  const scheduleBlocks = [
    {
      time: '09:00 - 09:15',
      duration: '15 minutes',
      activities: [
        {
          icon: '📦',
          title: 'Load-In & Setup',
          notes:
            'Unload equipment, set up tripod, test LED panel, white balance camera, confirm shop is closed to public',
        },
        {
          icon: '✅',
          title: 'Final Equipment Check',
          notes:
            'Verify: Meta Ray-Ban charged (100%), Meta View app connected, lavalier mic working, backup batteries ready',
        },
      ],
    },
    {
      time: '09:15 - 09:30',
      duration: '15 minutes',
      activities: [
        {
          icon: '🎥',
          title: 'Shot S01: Establish Shop (Wide)',
          notes:
            'Setup: Locked-off tripod, empty shop | Duration: 10s | Shoot before talent arrives for clean plate',
        },
        {
          icon: '📸',
          title: 'Shot S10: Press Stills (Initial Set)',
          notes: 'Capture 3-4 stills: Empty shop wide, tasting bar setup, wine bottles on shelf, storefront exterior',
        },
      ],
    },
    {
      time: '09:30 - 09:50',
      duration: '20 minutes',
      activities: [
        {
          icon: '📦',
          title: 'Shot S02: Unboxing Meta Ray-Ban Glasses',
          notes:
            'Setup: Close-up on bar | Takes: 2 (for safety) | CRITICAL: This is Meta Ray-Ban Stories, NOT Quest 3',
          critical: true,
        },
        {
          icon: '📸',
          title: 'Press Stills: Unboxing Hero Shots',
          notes: 'Capture 2-3 stills: Hands opening case, glasses lifted out, close-up of Ray-Ban branding',
        },
      ],
    },
    {
      time: '09:50 - 10:05',
      duration: '15 minutes',
      activities: [
        {
          icon: '👓',
          title: 'Shot S03: First Boot (POV from Glasses)',
          notes: 'Tech: Host puts on Ray-Ban glasses, taps to activate recording | Duration: 15s',
          high: true,
        },
        {
          icon: '📱',
          title: 'Shot S04: Pairing with Meta View App',
          notes: 'Setup: Over-shoulder shot | Pre-pair glasses before shoot to avoid delays',
        },
      ],
    },
    {
      time: '10:05 - 10:30',
      duration: '25 minutes • CORE DEMO SEQUENCE',
      activities: [
        {
          icon: '🚶',
          title: 'Shot S05: Walk to Bottle (Gimbal Follow)',
          notes:
            'Setup: Gimbal tracking shot | Host walks from bar to shelf, reaches for WeRise Cabernet bottle',
          high: true,
        },
        {
          icon: '🔍',
          title: 'Shot S06: AR Label Scan (POV from Glasses)',
          notes:
            '⭐ CORE VERCHANDISING DEMO | Capture: POV of hands lifting bottle, QR code visible | Duration: 15s',
          critical: true,
        },
        {
          icon: '📱',
          title: 'Shot S07: Phone PWA Fallback',
          notes: 'Setup: Insert close-up | Phone scans same QR code, verchandising PWA opens',
        },
      ],
    },
    {
      time: '10:30 - 10:45',
      duration: '15 minutes',
      activities: [
        {
          icon: '💳',
          title: 'Shot S08: Commerce Flow (Screen Recordings)',
          notes: 'Capture: Phone PWA cart page + Desktop Stripe test checkout | Bundle: Wine + Book = $49.99',
        },
        {
          icon: '😊',
          title: 'Shot S09: Reaction Shot',
          notes:
            'Setup: Medium shot, host looks at camera | Dialogue: "That was under ten seconds." | Keep natural',
        },
      ],
    },
    {
      time: '10:45 - 11:15',
      duration: '30 minutes',
      activities: [
        {
          icon: '🔁',
          title: 'Safety Pickups & B-Roll',
          notes: 're-shoot any problematic takes, capture additional angles, get extra coverage of key moments',
        },
        {
          icon: '📸',
          title: 'Remaining Press Stills',
          notes: 'Complete 10-still set: Host wearing glasses mid-scan, QR code close-up, Meta View app on phone',
        },
        {
          icon: '🎬',
          title: 'Reaction Lines & Alt Takes',
          notes:
            'Capture multiple versions of S09 reaction, get additional host commentary for social/marketing clips',
        },
      ],
    },
    {
      time: '11:15 - 11:30',
      duration: '15 minutes',
      activities: [
        {
          icon: '📦',
          title: 'Pack-Down',
          notes:
            'Break down equipment, secure all media, verify all glasses footage transferred to backup drive, thank shop staff',
        },
      ],
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-8 rounded-lg">
        <h2 className="text-3xl font-bold mb-2">🎬 Production Schedule</h2>
        <p className="text-purple-100">Meta Ray-Ban Verchandising Shoot • We Rise Wine Shop</p>
      </div>

      {/* Overview */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-blue-900 mb-4">📋 Shoot Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: 'Date', value: 'TBD (Weekday AM)' },
            { label: 'Location', value: 'We Rise Wines Bottle Shop' },
            { label: 'Call Time', value: '09:00 AM' },
            { label: 'Wrap Time', value: '12:00 PM (estimated)' },
            { label: 'Total Duration', value: '3 Hours' },
            { label: 'Shot Count', value: '9 Scenes + 10 Stills' },
          ].map((item, idx) => (
            <div key={idx}>
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">
                {item.label}
              </p>
              <p className="text-base font-semibold text-blue-900">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Blocks */}
      <div className="space-y-4">
        {scheduleBlocks.map((block, idx) => (
          <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden">
            {/* Time Header */}
            <div className="bg-slate-100 px-6 py-4 border-b border-slate-200 flex items-center gap-3">
              <span className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                {block.time}
              </span>
              <span className="text-sm text-slate-600">{block.duration}</span>
            </div>

            {/* Activities */}
            <div className="p-6 space-y-4">
              {block.activities.map((activity, actIdx) => (
                <div
                  key={actIdx}
                  className={`flex gap-4 p-4 rounded-lg ${
                    activity.critical
                      ? 'bg-red-50 border-l-4 border-red-500'
                      : activity.high
                        ? 'bg-orange-50 border-l-4 border-orange-500'
                        : 'bg-slate-50 border-l-4 border-purple-500'
                  }`}
                >
                  <span className="text-2xl flex-shrink-0">{activity.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 mb-1">{activity.title}</h4>
                    <p className="text-sm text-slate-700 leading-relaxed">{activity.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="bg-slate-100 border border-slate-200 rounded-lg p-6 text-center text-sm text-slate-600">
        Last updated: {new Date().toLocaleDateString()} | All times subject to location access and
        production contingencies
      </div>
    </div>
  );
}
