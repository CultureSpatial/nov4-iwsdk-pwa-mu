'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'

export function ProductionTabs() {
  const [activeTab, setActiveTab] = useState('call-sheet')

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b border-border">
          <TabsList className="w-full justify-start bg-transparent p-0 rounded-none gap-0 h-auto">
            <TabsTrigger 
              value="call-sheet" 
              className="rounded-none border-b-2 border-transparent px-6 py-4 data-[state=active]:border-primary data-[state=active]:bg-muted/50 text-foreground font-semibold transition-all"
              aria-label="Call Sheet Tab"
            >
              <span className="mr-2">📋</span>
              Call Sheet
            </TabsTrigger>
            <TabsTrigger 
              value="schedule" 
              className="rounded-none border-b-2 border-transparent px-6 py-4 data-[state=active]:border-primary data-[state=active]:bg-muted/50 text-foreground font-semibold transition-all"
              aria-label="Production Schedule Tab"
            >
              <span className="mr-2">🎬</span>
              Production Schedule
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="call-sheet" className="space-y-6 p-8">
          <CallSheetContent />
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6 p-8">
          <ScheduleContent />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function CallSheetContent() {
  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="border-l-4 border-primary pl-6">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Meta Ray-Ban AR Glasses Verchandising Shoot
        </h2>
        <p className="text-lg text-muted-foreground">
          We Rise Wine Shop • Seattle, WA
        </p>
      </div>

      {/* Project Metadata */}
      <Card className="bg-secondary/10 border-none p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Shoot Date
            </p>
            <p className="text-lg font-semibold text-foreground">TBD (Weekday AM)</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Call Time
            </p>
            <p className="text-lg font-semibold text-foreground">09:00 - 12:00</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Location
            </p>
            <p className="text-lg font-semibold text-foreground">We Rise Wines</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Output
            </p>
            <p className="text-lg font-semibold text-foreground">60-90s Sizzle + 5 Shots</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Budget
            </p>
            <p className="text-lg font-semibold text-foreground">$2,500</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Status
            </p>
            <p className="text-lg font-semibold text-primary">In Planning</p>
          </div>
        </div>
      </Card>

      {/* Mission Objectives */}
      <div className="space-y-3">
        <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <span>🎯</span> Mission Objectives
        </h3>
        <Card className="bg-accent/5 border-accent/20 p-6 space-y-4">
          <div>
            <h4 className="font-semibold text-foreground mb-2">Primary Goal</h4>
            <p className="text-muted-foreground leading-relaxed">
              Capture proof-of-concept footage demonstrating Meta Ray-Ban Stories glasses recording verchandising experiences in a live wine retail environment.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Deliverables</h4>
            <p className="text-muted-foreground leading-relaxed">
              60-90 second sizzle reel + 5-shot instructional micro-video + 10 high-res press stills + raw POV footage from glasses.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Cross-Walk</h4>
            <p className="text-muted-foreground leading-relaxed">
              Validates HOW-192 (Wine Tycoon Spine), feeds HOW-165 (Spatial Pattern Library), demonstrates verchandising motion patterns.
            </p>
          </div>
        </Card>
      </div>

      {/* Crew & Contacts Table */}
      <div className="space-y-3">
        <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <span>👥</span> Crew & Contacts
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="px-4 py-3 text-left font-semibold">Role</th>
                <th className="px-4 py-3 text-left font-semibold">Name</th>
                <th className="px-4 py-3 text-left font-semibold">Contact</th>
                <th className="px-4 py-3 text-left font-semibold">Responsibility</th>
              </tr>
            </thead>
            <tbody>
              {[
                { role: 'Producer', name: 'TBD', contact: '[Contact]', responsibility: 'Shop access, schedule coordination' },
                { role: 'Tech Lead', name: 'TBD', contact: '[Contact]', responsibility: 'Equipment setup, Meta Ray-Ban configuration' },
                { role: 'Camera Op', name: 'TBD', contact: '[Contact]', responsibility: 'Camera work, B-roll capture' },
                { role: 'Audio Tech', name: 'TBD', contact: '[Contact]', responsibility: 'Lavalier mic setup, audio monitoring' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 text-foreground font-medium">{row.role}</td>
                  <td className="px-4 py-3 text-foreground">{row.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.contact}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.responsibility}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Equipment Checklist */}
      <div className="space-y-3">
        <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <span>⚙️</span> Equipment Checklist
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { category: 'Camera', items: ['Meta Ray-Ban Stories glasses', 'Primary camera (DSLR/mirrorless)', 'Backup camera', 'Tripod & stabilization gear'] },
            { category: 'Audio', items: ['Lavalier microphone', 'Wireless receiver pack', 'Audio recorder (backup)', 'Backup batteries (2x)'] },
            { category: 'Lighting', items: ['LED panel (2x)', 'Reflectors', 'Light stands', 'Gels & diffusers'] },
            { category: 'Support', items: ['Cables & adapters', 'Memory cards (multiple)', 'Color reference chart', 'Gaff tape & tools'] },
          ].map((section, i) => (
            <Card key={i} className="p-4 border-border">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="text-lg">✓</span> {section.category}
              </h4>
              <ul className="space-y-2">
                {section.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-muted-foreground">
                    <input type="checkbox" className="mt-1 accent-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>

      {/* Wine Selection */}
      <div className="space-y-3">
        <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <span>🍷</span> Featured Wine Selection
        </h3>
        <Card className="bg-secondary/10 border-none p-6">
          <p className="text-muted-foreground leading-relaxed mb-4">
            We Rise Wines curates selections that demonstrate retail expertise through verchandising. The featured wines will showcase:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Natural wines with unique story narratives perfect for AR contextualization</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>High-turnover selections demonstrating merchandising frequency patterns</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Visual diversity enabling compelling multi-angle POV coverage</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  )
}

function ScheduleContent() {
  return (
    <div className="space-y-6">
      {/* Schedule Header */}
      <div className="border-l-4 border-accent pl-6">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Production Schedule
        </h2>
        <p className="text-lg text-muted-foreground">
          Meta Ray-Ban Verchandising Shoot • We Rise Wine Shop
        </p>
      </div>

      {/* Shoot Overview */}
      <Card className="bg-accent/5 border-accent/20 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <span>📋</span> Shoot Overview
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Date
            </p>
            <p className="text-lg font-semibold text-foreground">TBD (Weekday AM)</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Location
            </p>
            <p className="text-lg font-semibold text-foreground">We Rise Wines</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Call Time
            </p>
            <p className="text-lg font-semibold text-foreground">09:00 AM</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Wrap Time
            </p>
            <p className="text-lg font-semibold text-foreground">12:00 PM</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Duration
            </p>
            <p className="text-lg font-semibold text-foreground">3 Hours</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Scenes
            </p>
            <p className="text-lg font-semibold text-foreground">9 Scenes + 10 Stills</p>
          </div>
        </div>
      </Card>

      {/* Timeline Blocks */}
      <div className="space-y-4">
        {scheduleBlocks.map((block, i) => (
          <Card key={i} className="border-border overflow-hidden">
            <div className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold">{block.time}</span>
                <span className="text-sm opacity-90">{block.duration} minutes</span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {block.activities.map((activity, j) => (
                <div key={j} className="flex gap-4 pb-4 last:pb-0 last:border-b-0 border-b border-border">
                  <div className="text-3xl flex-shrink-0">{activity.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground mb-2">{activity.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {activity.notes}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Key Reminders */}
      <Card className="bg-secondary/10 border-none p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <span>⚡</span> Key Reminders
        </h3>
        <ul className="space-y-3">
          <li className="flex gap-3">
            <span className="text-primary text-lg flex-shrink-0">→</span>
            <span className="text-muted-foreground">Confirm shop closure to public for clean POV shots</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary text-lg flex-shrink-0">→</span>
            <span className="text-muted-foreground">Test Meta Ray-Ban battery fully charged before load-in</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary text-lg flex-shrink-0">→</span>
            <span className="text-muted-foreground">Allow 5-minute buffer between blocks for equipment adjustments</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary text-lg flex-shrink-0">→</span>
            <span className="text-muted-foreground">Have backup batteries accessible throughout shoot</span>
          </li>
        </ul>
      </Card>
    </div>
  )
}

const scheduleBlocks = [
  {
    time: '09:00 - 09:15',
    duration: 15,
    activities: [
      {
        icon: '📦',
        title: 'Load-In & Setup',
        notes: 'Unload equipment, set up tripod, test LED panel, white balance camera, confirm shop is closed to public',
      },
      {
        icon: '✅',
        title: 'Final Equipment Check',
        notes: 'Verify: Meta Ray-Ban charged (100%), Meta View app connected, lavalier mic working, backup batteries ready',
      },
    ],
  },
  {
    time: '09:15 - 09:30',
    duration: 15,
    activities: [
      {
        icon: '🎥',
        title: 'Shot S01: Establish Shop (Wide)',
        notes: 'Setup: Locked-off tripod, empty shop\nDuration: 10 seconds\nNotes: Shoot before talent arrives for clean plate',
      },
    ],
  },
  {
    time: '09:30 - 09:50',
    duration: 20,
    activities: [
      {
        icon: '🎬',
        title: 'Shot S02-S04: Talent Actions',
        notes: 'Setup: Handheld + Ray-Ban POV\nFocus: Natural verchandising gestures\nActions: Place bottles, explain features, demonstrate retail expertise',
      },
    ],
  },
  {
    time: '09:50 - 10:10',
    duration: 20,
    activities: [
      {
        icon: '📸',
        title: 'Press Still Photography',
        notes: 'Setup: Static wide shots\nDuration: 8x stills\nFocus: High-res product photography, talent interaction',
      },
    ],
  },
  {
    time: '10:10 - 10:30',
    duration: 20,
    activities: [
      {
        icon: '🎞️',
        title: 'Shot S05-S06: POV Sequences',
        notes: 'Setup: Ray-Ban first-person perspective\nFocus: Customer consultation angles\nDuration: 15 seconds combined',
      },
    ],
  },
  {
    time: '10:30 - 10:45',
    duration: 15,
    activities: [
      {
        icon: '☕',
        title: 'Equipment Adjustment & Brief Break',
        notes: 'Review footage, adjust lighting if needed, brief talent on next block',
      },
    ],
  },
  {
    time: '10:45 - 11:00',
    duration: 15,
    activities: [
      {
        icon: '🎯',
        title: 'Shot S07: Environmental Coverage',
        notes: 'Setup: Wide angles capturing full retail environment\nFocus: Context shots for sizzle reel',
      },
    ],
  },
  {
    time: '11:00 - 11:30',
    duration: 30,
    activities: [
      {
        icon: '🎪',
        title: 'Shot S08-S09: Instructional Sequences',
        notes: 'Setup: Multi-angle coverage\nFocus: 5-shot instructional micro-video elements\nActions: Step-by-step wine selection process',
      },
    ],
  },
  {
    time: '11:30 - 12:00',
    duration: 30,
    activities: [
      {
        icon: '📹',
        title: 'Safety Takes & Wrap',
        notes: 'Review all captures, final wide shots for B-roll\nConfirm all media backed up\nThanks to shop & crew',
      },
    ],
  },
]
