import type { Metadata } from 'next'
import { ProductionTabs } from '@/components/production-tabs'

export const metadata: Metadata = {
  title: 'Production Documents | Meta Ray-Ban Verchandising Shoot',
  description: 'Call Sheet and Production Schedule for Meta Ray-Ban AR Glasses verchandising shoot at We Rise Wine Shop, Seattle WA.',
}

export default function ProductionDocsPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Premium Gradient Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-accent to-primary/70">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-foreground rounded-full -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary-foreground rounded-full -ml-36 -mb-36" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="space-y-4">
            <div className="inline-block">
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-primary-foreground/10 text-primary-foreground">
                Production Management
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground tracking-tight">
              Production Documents
            </h1>
            <p className="text-lg sm:text-xl text-primary-foreground/90 max-w-2xl leading-relaxed">
              Complete documentation for the Meta Ray-Ban AR Glasses verchandising shoot at We Rise Wine Shop, Seattle WA. Access detailed crew information, equipment checklists, and the complete 3-hour production timeline.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <ProductionTabs />
        </div>

        {/* Information Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <span>📋</span> Tab Navigation
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Switch seamlessly between Call Sheet and Production Schedule tabs. Each tab contains comprehensive information organized by section with clear visual hierarchy.
            </p>
          </div>
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <span>♿</span> Accessibility
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Full keyboard navigation support with clear visual focus indicators. All content is structured for screen readers with semantic HTML and proper ARIA labels.
            </p>
          </div>
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <span>📱</span> Responsive Design
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Optimized for all screen sizes from mobile devices to large displays. Tables and grids adapt intelligently to available space for optimal readability.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
