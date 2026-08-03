import Hero from '@/components/Hero'
import Problem from '@/components/Problem'
import Features from '@/components/Features'
import MapPreview from '@/components/MapPreview'
import Highlights from '@/components/Highlights'
import Stats from '@/components/Stats'
import Institutions from '@/components/Institutions'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'

export default function App() {
  return (
    <div className="w-full overflow-x-hidden">
      <Hero />
      <Problem />
      <Features />
      <MapPreview />
      <Highlights />
      <Stats />
      <Institutions />
      <CTA />
      <Footer />
    </div>
  )
}
