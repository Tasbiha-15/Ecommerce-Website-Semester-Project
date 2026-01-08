"use client"
import { motion } from 'framer-motion'
import Link from 'next/link'
import { CLOTHES } from '@/lib/data'

export default function CategorySection() {
    const CategoryCard = ({ category, index }) => (
        <Link href={`/category/${category.slug}`} className="group cursor-pointer flex flex-col items-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="w-full"
            >
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 mb-4 transition-all duration-300 shadow-sm">
                    <img
                        src={category.image}
                        alt={category.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1617922001439-4a2e6562f328?q=80&w=800" }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300" />
                </div>
                <h3 className="text-center text-[10px] md:text-sm font-bold tracking-[0.2em] uppercase text-slate-900 group-hover:text-slate-600 transition-colors">
                    {category.name}
                </h3>
            </motion.div>
        </Link>
    )

    return (
        <section className="bg-white py-16 md:py-24">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <p className="text-slate-400 text-[10px] tracking-[0.4em] uppercase mb-3 font-medium">Distinctive Style</p>
                    <h2 className="text-3xl md:text-5xl font-serif font-medium text-slate-900 tracking-tight mb-4 uppercase">
                        Shop by Fit
                    </h2>
                    <div className="w-16 h-[1.5px] bg-slate-200 mx-auto" />
                </div>

                {/* Staggered Grid (3+2+2) */}
                <div className="max-w-6xl mx-auto space-y-12 md:space-y-16">
                    {/* Row 1: Top 3 */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
                        {CLOTHES.slice(0, 3).map((cat, i) => (
                            <CategoryCard key={cat.id} category={cat} index={i} />
                        ))}
                    </div>

                    {/* Row 2: Middle 2 (Aligned and Centered) */}
                    <div className="flex justify-center">
                        <div className="grid grid-cols-2 gap-6 md:gap-10 w-full md:w-2/3">
                            {CLOTHES.slice(3, 5).map((cat, i) => (
                                <CategoryCard key={cat.id} category={cat} index={i + 3} />
                            ))}
                        </div>
                    </div>


                </div>
            </div>
        </section>
    )
}
