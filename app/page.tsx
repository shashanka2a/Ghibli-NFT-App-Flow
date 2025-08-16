'use client'

import { motion } from 'framer-motion'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { ImageWithFallback } from '../components/ImageWithFallback'
import { Upload, Sparkles, Coins, ArrowRight, Star, Zap } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white relative overflow-hidden">
      {/* Header Section */}
      <header className="relative z-10 p-6">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-slate-900" />
            </div>
            <span className="text-2xl font-semibold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Mintari
            </span>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Link href="/create">
              <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white border-0 rounded-2xl">
                Get Started
              </Button>
            </Link>
          </motion.div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Badge className="mb-6 bg-pink-500/20 text-pink-300 border border-pink-500/30 rounded-full px-6 py-2">
            <Zap className="w-4 h-4 mr-2" /> Powered by AI Magic
          </Badge>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-6xl md:text-8xl mb-6 bg-gradient-to-r from-emerald-300 via-cyan-300 to-purple-300 bg-clip-text text-transparent font-bold">
          Transform Art into <br /> <span className="text-pink-300">Magical NFTs</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
          Upload your image, let our AI reimagine it in Ghibli-style, and mint it as a Flow blockchain NFT.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/create">
            <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white border-0 rounded-2xl px-8 py-6 text-lg group">
              Start Creating Magic <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 rounded-2xl px-8 py-6 text-lg">
            View Gallery
          </Button>
        </motion.div>
      </section>

      {/* Additional sections like feature cards, sample gallery, powered by, and final CTA */}
      {/* Keep these sections as you had them, cleanly organized and animated */}

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto text-center text-slate-400">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-slate-900" />
            </div>
            <span className="text-xl bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Mintari</span>
          </div>
          <p>© 2024 Mintari. Powered by AI & Flow Blockchain.</p>
        </div>
      </footer>
    </div>
  )
}
