import Hero from '@/components/Hero'
import ScrollyDestinations from '@/components/ScrollyDestinations'
import Highlights from '@/components/Highlights'
import MapPreview from '@/components/MapPreview'
import AboutProject from '@/components/AboutProject'
import Stats from '@/components/Stats'
import Institutions from '@/components/Institutions'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'

export default function App() {
  return (
    <div className="w-full overflow-x-hidden bg-white">
      <Hero />
      <ScrollyDestinations />
      <Highlights />
      <MapPreview />
      <AboutProject />
      <Stats />
      <Institutions />
      <CTA />
      <Footer />
    </div>
  )
}
