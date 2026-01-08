"use client"
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Official Maryum N Maria slides - 3 slides
const slides = [
    {
        id: 1,
        image: "/Images/Rani-35.png",
        type: "rani",
        position: "left"
    },
    {
        id: 2,
        image: "/Images/Formal-Edit-35.png",
        type: "formal",
        position: "right"
    },
    {
        id: 3,
        image: "/Images/Serena-35.png",
        type: "serene",
        position: "left"
    }
]

export default function HeroCarousel() {
    const [current, setCurrent] = useState(0)

    if (!slides || slides.length === 0) return null

    const nextSlide = () => setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1))

    useEffect(() => {
        const timer = setInterval(nextSlide, 7000)
        return () => clearInterval(timer)
    }, [])

    const currentSlide = slides[current]
    if (!currentSlide) return null

    return (
        <section className="relative h-screen w-full overflow-hidden bg-gray-100">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                >
                    {/* Background Image */}
                    <img
                        src={currentSlide.image}
                        alt="Hero Slide"
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/10" />

                    {/* Text Content - Position based on slide */}
                    <div className={`absolute inset-y-0 flex items-center ${currentSlide.position === 'right' ? 'right-16 md:right-32' : 'left-16 md:left-32'}`}>
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className={`flex flex-col ${currentSlide.position === 'right' ? 'items-end text-right' : 'items-start text-left'} space-y-4`}
                        >
                            {/* Slide 1: Rani - Urdu/Arabic style */}
                            {currentSlide.type === 'rani' && (
                                <>
                                    <h1 className="text-6xl md:text-7xl lg:text-8xl text-white font-serif drop-shadow-lg leading-none" style={{ fontFamily: 'Georgia, serif' }}>
                                        رانی
                                    </h1>
                                    <p className="text-xl md:text-2xl text-white/90 tracking-[0.3em] uppercase font-light">
                                        celeste
                                    </p>
                                    <a href="/products" className="mt-4 text-white text-sm tracking-widest uppercase hover:underline underline-offset-4 font-medium">
                                        LIVE NOW
                                    </a>
                                </>
                            )}

                            {/* Slide 2: Formal Edit - Modern Serif */}
                            {currentSlide.type === 'formal' && (
                                <>
                                    <h1 className="text-5xl md:text-6xl text-white font-serif font-medium tracking-wider drop-shadow-lg uppercase leading-tight">
                                        FORMAL EDIT <span className="font-light italic">35</span>
                                    </h1>
                                    <button className="mt-6 bg-transparent border border-white text-white px-10 py-3 text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300">
                                        <a href="/products">EXPLORE MORE</a>
                                    </button>
                                </>
                            )}

                            {/* Slide 3: Serene - Elegant Cursive/Script */}
                            {currentSlide.type === 'serene' && (
                                <>
                                    <h1 className="text-6xl md:text-7xl text-white italic drop-shadow-lg leading-none" style={{ fontFamily: 'Georgia, serif' }}>
                                        Serene
                                    </h1>
                                    <p className="text-sm md:text-base text-white tracking-[0.4em] uppercase font-light">
                                        BRIDAL COLLECTION
                                    </p>
                                    <a href="/products" className="mt-4 text-white text-sm tracking-widest uppercase hover:underline underline-offset-4 font-medium">
                                        SHOP NOW
                                    </a>
                                </>
                            )}
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Subtle Navigation Arrows */}
            <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 z-30 text-white/50 hover:text-white transition-colors" aria-label="Previous">
                <ChevronLeft className="h-8 w-8" strokeWidth={1} />
            </button>
            <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 z-30 text-white/50 hover:text-white transition-colors" aria-label="Next">
                <ChevronRight className="h-8 w-8" strokeWidth={1} />
            </button>

            {/* 3 Pagination Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`h-0.5 transition-all duration-500 ${index === current ? 'w-10 bg-white' : 'w-6 bg-white/40'}`}
                        aria-label={`Slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    )
}
