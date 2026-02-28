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
            <TabsTrigger 
              value="shot-list" 
              className="rounded-none border-b-2 border-transparent px-6 py-4 data-[state=active]:border-primary data-[state=active]:bg-muted/50 text-foreground font-semibold transition-all"
              aria-label="Shot List Tab"
            >
              <span className="mr-2">📹</span>
              Shot List
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="call-sheet" className="space-y-6 p-8">
          <CallSheetContent />
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6 p-8">
          <ScheduleContent />
        </TabsContent>

        <TabsContent value="shot-list" className="space-y-6 p-8">
          <ShotListContent />
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

function ShotListContent() {
  const shotSections = [
    {
      title: 'Unboxing & Meta Ray-Ban',
      icon: '📦',
      description: 'Introduce hardware, set expectations, demonstrate POV capability',
      shots: [
        {
          id: 'U01',
          name: 'Package Introduction',
          duration: '30 sec',
          key_message: 'First-person storytelling tool, not AR overlay device',
          visual: 'Static tabletop shot of Meta Ray-Ban Stories box, hands-on unboxing reveal, close-up of glasses, case, charging cable',
          audio: 'Natural voiceover: "Let\'s see what\'s inside"',
        },
        {
          id: 'U02',
          name: 'Feature Walkthrough',
          duration: '45 sec',
          key_message: 'No screen, no overlay - pure point-of-view capture',
          visual: 'Hold glasses to camera, show button locations, demonstrate tap controls',
          audio: 'Host explains recording, volume, photo modes',
        },
        {
          id: 'U03',
          name: 'First-Person POV Test',
          duration: '30 sec',
          key_message: 'What you see is what you capture',
          visual: 'Put glasses on, walk around room showing natural head movement, pan across space',
          audio: 'Ambient room sounds, natural reactions',
        },
      ],
    },
    {
      title: 'Sense of Arrival & Exterior/Entry Shots',
      icon: '🚶',
      description: 'Establish location, welcome, and "All Ways Friendly" aesthetic',
      shots: [
        {
          id: '101',
          name: 'Approach Shot (POV)',
          duration: '20 sec',
          key_message: 'Journey begins, neighborhood context',
          visual: 'Walking toward wine shop entrance from glasses POV, natural head movement',
          audio: 'Ambient street sounds, footsteps, potential Vancouver skyline context',
        },
        {
          id: '102',
          name: 'Exterior Establishment',
          duration: '15 sec',
          key_message: 'All Ways Friendly - inviting, accessible',
          visual: 'Wide shot of We Rise Wine Shop storefront, signage, windows, welcoming atmosphere',
          audio: 'Ambient exterior ambience',
        },
        {
          id: '103',
          name: 'Entrance (POV)',
          duration: '20 sec',
          key_message: 'Natural greeting from staff',
          visual: 'Hand opening door captured in POV from glasses, first glimpse of interior',
          audio: 'Door sound, natural greeting exchange, ambient interior',
        },
        {
          id: '104',
          name: 'Interior Pan (POV)',
          duration: '25 sec',
          key_message: 'Raw, authentic first impression',
          visual: 'Slow head turn to survey space, wine displays, tasting bar, seating areas',
          audio: 'Natural ambient, background conversations',
        },
      ],
    },
    {
      title: 'Evidence in Shoot & Innovative Gear Storytelling',
      icon: '🎥',
      description: 'Tech enables natural wine discovery, cultural storytelling preserved',
      shots: [
        {
          id: '105',
          name: 'Wine Selection POV',
          duration: '30 sec',
          key_message: 'Tech enables natural discovery',
          visual: 'Approaching bottles from POV, natural framing, hands in frame',
          audio: 'Ambient discussion, natural conversation',
        },
        {
          id: '106',
          name: 'Sommelier Introduction',
          duration: '40 sec',
          key_message: 'Five-mic array captures quality audio',
          visual: 'Person positioned right-of-center, natural eye contact, conversational framing',
          audio: 'Clear dialogue, natural conversation captured',
        },
        {
          id: '107',
          name: 'Wine Pour (ASMR)',
          duration: '30 sec',
          key_message: 'Hands-free POV ideal for capturing action',
          visual: 'Hands pouring wine into glass from glasses perspective, close-up action',
          audio: 'Pouring sound (ASMR quality), glass clink',
        },
        {
          id: '108',
          name: 'Tasting Experience',
          duration: '45 sec',
          key_message: 'Nature\'s Force terroir connection',
          visual: 'Lifting glass, nosing, sipping from wearer\'s perspective',
          audio: 'Natural reactions, ambient sounds',
        },
      ],
    },
    {
      title: 'Digital Readiness & Commerce Transparency',
      icon: '📱',
      description: 'Demonstrate digital integration, QR codes, and transaction flow',
      shots: [
        {
          id: '109',
          name: 'QR Code Discovery (POV)',
          duration: '30 sec',
          key_message: 'Moment-to-Prompt Engagement',
          visual: 'Approach table/booth with QR code display visible in POV',
          audio: 'Natural dialogue about scanning',
        },
        {
          id: '110',
          name: 'Phone Screen Recording',
          duration: '45 sec',
          key_message: 'Digital interface interaction (screen recording)',
          visual: 'Screen shows QR scan, Moment + Mood Selector interface, result matching',
          audio: 'Ambient, selection sounds',
        },
        {
          id: '111',
          name: 'Commerce Flow (Screen)',
          duration: '40 sec',
          key_message: 'Transparency in transaction',
          visual: 'Phone PWA cart page, wine selection, bundled items, pricing clarity',
          audio: 'Voiceover explaining commerce flow',
        },
      ],
    },
    {
      title: 'Human-Centric Experience & Producer Story',
      icon: '❤️',
      description: 'Capture authentic connections, producer narrative, cultural attribution',
      shots: [
        {
          id: '112',
          name: 'Producer Story (POV + B-roll)',
          duration: '60 sec',
          key_message: 'All three playbook themes integrated',
          visual: 'POV of person speaking, backup wide shot for spatial context',
          audio: 'Producer narrative (KEY audio asset), environmental context',
        },
        {
          id: '113',
          name: 'Protocol Card/Attribution',
          duration: '40 sec',
          key_message: 'Cultural attribution, not just product',
          visual: 'Picking up protocol card or viewing digital display with origin story',
          audio: 'Staff narration about terroir and practices',
        },
      ],
    },
    {
      title: 'Community & Celebration',
      icon: '🎉',
      description: 'Capture social gathering, inclusive celebration, continuity',
      shots: [
        {
          id: '114',
          name: 'Social Gathering (POV)',
          duration: '35 sec',
          key_message: 'All Ways Friendly community moment',
          visual: 'Diverse group POV from glasses, natural interactions',
          audio: 'Natural conversation, ambient, laughter',
        },
        {
          id: '115',
          name: 'Toast Moment',
          duration: '25 sec',
          key_message: 'Genuine connection, highly framing-tolerant',
          visual: 'Group raises glasses (framing flexible), diverse participants',
          audio: 'Toast phrase, glass clinks, celebration sounds',
        },
        {
          id: '116',
          name: 'Departure & Community Engagement',
          duration: '30 sec',
          key_message: 'More in a Match - journey continues',
          visual: 'Natural closing POV, farewells, community messaging',
          audio: 'Farewell exchanges, outro messaging',
        },
      ],
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-l-4 border-primary pl-6">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Detailed Shot List & Call Sheets
        </h2>
        <p className="text-lg text-muted-foreground">
          Organized by production theme and playbook pillar alignment
        </p>
      </div>

      {/* Shot Sections */}
      <div className="space-y-8">
        {shotSections.map((section, idx) => (
          <div key={idx} className="space-y-4">
            {/* Section Header */}
            <div className="flex items-center gap-3 pb-4 border-b-2 border-border">
              <span className="text-3xl">{section.icon}</span>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-foreground">{section.title}</h3>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </div>
            </div>

            {/* Shots Grid */}
            <div className="space-y-3">
              {section.shots.map((shot, shotIdx) => (
                <Card key={shotIdx} className="border-border p-6 hover:border-primary/50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold">
                          {shot.id}
                        </span>
                        <h4 className="text-xl font-bold text-foreground">{shot.name}</h4>
                      </div>
                      <p className="text-sm font-semibold text-accent">{shot.duration}</p>
                    </div>
                  </div>

                  {/* Shot Details Grid */}
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                        Key Message
                      </p>
                      <p className="text-foreground leading-relaxed">{shot.key_message}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                        Visual
                      </p>
                      <p className="text-foreground leading-relaxed">{shot.visual}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                        Audio
                      </p>
                      <p className="text-foreground leading-relaxed italic">{shot.audio}</p>
                    </div>
                  </div>

                  {/* Metadata Footer */}
                  <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-4 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                      <input type="checkbox" className="accent-primary" />
                      <span className="text-muted-foreground">Completed</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="Add notes..." 
                      className="flex-1 bg-muted/50 border border-border/50 rounded px-2 py-1 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Supporting B-Roll Section */}
      <Card className="bg-secondary/10 border-none p-6 space-y-4">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          <span>🎬</span> Supporting B-Roll & Technical Assets
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold text-foreground mb-2">Technical B-Roll (Non-POV)</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Wide establishing shots (interior/exterior)</li>
              <li>• Close-ups: wine labels, glasses, QR codes</li>
              <li>• Screen recordings of digital interfaces</li>
              <li>• LED indicator light variations</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-foreground mb-2">Safety & Reference Assets</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Mirror reflection shots showing LED recording indicator</li>
              <li>• Backup wide shots for spatial context</li>
              <li>• Detail shots for color grading reference</li>
              <li>• Multi-angle producer story coverage</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Notes Section */}
      <Card className="bg-accent/5 border-accent/20 p-6">
        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <span>📝</span> Production Notes
        </h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Framing Strategy:</strong> Ray-Ban glasses have no display. Position subjects 15° right of center for dialogue partner visibility. Hands-in-frame activities work best for capturing action naturally.
          </p>
          <p>
            <strong className="text-foreground">Backup Requirements:</strong> All POV shots require backup camera coverage (phone/DSLR) for establishing shots, wide perspectives, and precise framing of small objects (labels, buttons).
          </p>
          <p>
            <strong className="text-foreground">Model Releases:</strong> Collect signed releases from all visible participants. Ensure FIFA compliance checkpoint before final edit.
          </p>
        </div>
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
