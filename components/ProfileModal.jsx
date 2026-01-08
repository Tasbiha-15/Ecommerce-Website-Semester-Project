"use client"
import { useState } from 'react'
import { Mail, Phone, X, Code, MapPin, Github, Linkedin } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProfileModal() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 h-14 w-14 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-rose-600 transition-all duration-300 group scale-100 hover:scale-110"
                title="Developer Profile"
            >
                <Code className="h-6 w-6 group-hover:rotate-12 transition-transform" />
            </button>

            {/* Modal Overlay and Content */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-start md:items-center justify-center p-4 pt-10 md:p-4">
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        />

                        {/* Card Component */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto md:overflow-visible"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 z-50 p-2 bg-white/80 backdrop-blur-md rounded-full text-slate-500 hover:text-rose-600 transition-colors shadow-sm"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-5 h-auto md:h-[550px]">
                                {/* Left Side: Image (40%) */}
                                <div className="md:col-span-2 bg-slate-100 flex items-center justify-center p-8 border-r border-slate-100 h-64 md:h-auto">
                                    <img
                                        src="/Images/Tasbiha.jpeg"
                                        alt="Tasbiha Ashraf"
                                        className="h-full w-auto md:h-120 md:w-100 object-cover rounded-2xl shadow-xl border-4 border-white"
                                    />
                                </div>

                                {/* Right Side: Details (60%) */}
                                <div className="md:col-span-3 bg-slate-50 px-8 md:px-12 py-10 md:py-16 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent space-y-6">
                                    {/* Header */}
                                    <div>
                                        <h3 className="text-3xl font-serif font-bold text-slate-900 mb-2">
                                            Tasbiha Ashraf
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <span className="h-2 w-2 bg-rose-500 rounded-full animate-pulse" />
                                            <p className="text-sm text-slate-500 uppercase tracking-[0.2em] font-medium">
                                                ID: 23-NTU-CS-1215
                                            </p>
                                        </div>
                                    </div>

                                    {/* Academic */}
                                    <div className="space-y-4 border-t border-slate-200 pt-6">
                                        <div className="flex items-start gap-4">
                                            <div className="mt-1 p-2 bg-white rounded-lg shadow-sm">
                                                <Code className="h-4 w-4 text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] mb-1 font-bold">Academic Program</p>
                                                <p className="text-slate-900 font-serif leading-tight">
                                                    BS Software Engineering<br />
                                                    <span className="text-sm text-slate-500 font-sans italic">5th Semester (Undergraduate)</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="mt-1 p-2 bg-white rounded-lg shadow-sm">
                                                <MapPin className="h-4 w-4 text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] mb-1 font-bold">Institution</p>
                                                <p className="text-slate-900 font-serif">National Textile University</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Project Focus */}
                                    <div className="bg-slate-200 p-6 rounded-2xl text-white shadow-xl shadow-slate-200 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                            <Code className="h-12 w-12" />
                                        </div>
                                        <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] mb-2 font-bold">Semester Project</p>
                                        <p className="text-sm font-bold leading-relaxed mb-1 text-slate-900">
                                            WAD (WEB APPLICATION DEVELOPMENT)
                                        </p>
                                        <p className="text-xs text-slate-900 font-mono">
                                            COURSE-CSE-4080L
                                        </p>
                                    </div>

                                    {/* Supervision */}
                                    <div className="grid grid-cols-2 gap-6 border-t border-slate-200 pt-6">
                                        <div>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] mb-2 font-bold">Supervisor</p>
                                            <p className="text-slate-900 font-medium text-sm">Sir Zahid Javed</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] mb-2 font-bold">Co-Supervisor</p>
                                            <p className="text-slate-900 font-medium text-sm">Sir Abdul Basit</p>
                                        </div>
                                    </div>

                                    {/* Contact */}
                                    <div className="pt-6 border-t border-slate-200 space-y-3">
                                        <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] mb-1 font-bold">Get In Touch</p>
                                        <div className="flex flex-col gap-3">
                                            <a href="mailto:tasbiha1215@gmail.com"
                                                className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm hover:shadow-md hover:bg-rose-50 transition-all group">
                                                <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-white">
                                                    <Mail className="h-4 w-4 text-slate-400 group-hover:text-rose-500" />
                                                </div>
                                                <span className="text-sm text-slate-600 font-medium">tasbiha1215@gmail.com</span>
                                            </a>
                                            <a href="tel:03367168911"
                                                className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm hover:shadow-md hover:bg-rose-50 transition-all group">
                                                <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-white">
                                                    <Phone className="h-4 w-4 text-slate-400 group-hover:text-rose-500" />
                                                </div>
                                                <span className="text-sm text-slate-600 font-medium">03367168911</span>
                                            </a>

                                        </div>
                                    </div>

                                    {/* Social Links */}
                                    <div className="pt-6 border-t border-slate-200">
                                        <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] mb-3 font-bold">Follow On</p>
                                        <div className="flex gap-4">
                                            <a
                                                href="https://github.com/Tasbiha-15"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center h-10 w-10 bg-slate-900 text-white rounded-lg hover:bg-slate-700 hover:scale-110 transition-all shadow-md"
                                                title="GitHub"
                                            >
                                                <Github className="h-5 w-5" />
                                            </a>
                                            <a
                                                href="https://www.linkedin.com/in/tasbiha-ashraf/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center h-10 w-10 bg-[#0077b5] text-white rounded-lg hover:bg-[#006396] hover:scale-110 transition-all shadow-md"
                                                title="LinkedIn"
                                            >
                                                <Linkedin className="h-5 w-5" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div >
                )
                }
            </AnimatePresence >
        </>
    )
}
