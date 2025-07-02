import { Hero } from '@/components/Hero'
import { Features } from '@/components/Features'
import { EventsSection } from '@/components/EventsSection'
import { Stats } from '@/components/Stats'
import { CTA } from '@/components/CTA'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <EventsSection />
      <Stats />
      <CTA />
    </main>
  )
} 