"use client"
import HeroCarousel from '@/components/HeroCarousel'
import CategorySection from '@/components/CategorySection'

export default function Home() {
  return (
    <div className="bg-white">
      <HeroCarousel />

      {/* Shop by Fit - Category Section with Internal Product Grid */}
      <CategorySection />
    </div>
  )
}
