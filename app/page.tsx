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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white dark relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-slate-900" />
            </div>
            <span className="text-2xl font-semibold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Mintari
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link href="/create">
              <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white border-0 rounded-2xl">
                Get Started
              </Button>
            </Link>
          </motion.div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 border-pink-500/30 rounded-full px-6 py-2">
              <Zap className="w-4 h-4 mr-2" />
              Powered by AI Magic
            </Badge>
          </motion.div>

          <motion.h1
            className="text-6xl md:text-8xl mb-8 bg-gradient-to-r from-emerald-300 via-cyan-300 to-purple-300 bg-clip-text text-transparent leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Transform Art into<br />
            <span className="text-pink-300">Magical NFTs</span>
          </motion.h1>

          <motion.p
            className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Upload any image and watch as our AI transforms it into enchanting Ghibli-style artwork, then mint it as an NFT on the Flow blockchain. Create magical art in minutes.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link href="/create">
              <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white border-0 rounded-2xl px-8 py-6 text-lg group">
                Start Creating Magic
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 rounded-2xl px-8 py-6 text-lg">
              View Gallery
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl mb-6 bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              Three Simple Steps
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Transform your images into magical NFTs with our streamlined process
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Upload,
                title: "Upload",
                description: "Upload any image from your device. We support JPG, PNG, and more.",
                color: "from-pink-400 to-rose-400",
                delay: 0
              },
              {
                icon: Sparkles,
                title: "Transform",
                description: "Our AI applies Ghibli-inspired magic to create stunning, unique artwork.",
                color: "from-emerald-400 to-cyan-400",
                delay: 0.2
              },
              {
                icon: Coins,
                title: "Mint",
                description: "Mint your transformed artwork as an NFT on the Flow blockchain instantly.",
                color: "from-purple-400 to-pink-400",
                delay: 0.4
              }
            ].map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: step.delay }}
              >
                <Card className="p-8 bg-slate-900/50 backdrop-blur-sm border-slate-700 rounded-3xl hover:border-slate-600 transition-all duration-300 group hover:scale-105">
                  <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl mb-4 text-white">{step.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{step.description}</p>
                  <div className="flex items-center mt-6 text-slate-500 group-hover:text-emerald-400 transition-colors">
                    <span className="text-lg mr-2">0{index + 1}</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-slate-700 to-transparent" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Gallery */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl mb-6 font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
              Magical Transformations
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              See how ordinary images become extraordinary Ghibli-style masterpieces
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              "https://images.unsplash.com/photo-1605014409302-0233cb7884db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGZvcmVzdCUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NTUzNDAyMzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
              "https://images.unsplash.com/photo-1719498482206-661df940253d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWdpY2FsJTIwZ2FyZGVuJTIwaWxsdXN0cmF0aW9ufGVufDF8fHx8MTc1NTM0MDIzMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
              "https://images.unsplash.com/photo-1630870085043-ae88fe510404?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxteXN0aWNhbCUyMG5hdHVyZSUyMGFydHxlbnwxfHx8fDE3NTUzNDAyMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
              "https://images.unsplash.com/photo-1559828004-e4da0410010a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmVhbXklMjBsYW5kc2NhcGUlMjBwYWludGluZ3xlbnwxfHx8fDE3NTUzNDAyMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            ].map((src, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-3xl aspect-square">
                  <ImageWithFallback
                    src={src}
                    alt={`Ghibli-style artwork ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between">
                        <Star className="w-5 h-5 text-yellow-400" />
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                          Transformed
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Powered By Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl mb-6 text-slate-300">Powered by Industry Leaders</h2>
            <p className="text-slate-400">Built on the most trusted and innovative platforms</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap justify-center items-center gap-12"
          >
            {[
              { name: "Flow", color: "from-green-400 to-emerald-500" },
              { name: "Walrus", color: "from-blue-400 to-cyan-500" },
              { name: "Lit", color: "from-orange-400 to-red-500" }
            ].map((partner) => (
              <div key={partner.name} className="group">
                <div className={`p-6 bg-gradient-to-r ${partner.color} rounded-2xl group-hover:scale-110 transition-transform`}>
                  <span className="text-2xl text-white font-semibold">{partner.name}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 px-6 py-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-3xl blur opacity-25"></div>
            <Card className="relative p-16 bg-slate-900/80 backdrop-blur-sm border-slate-700 rounded-3xl">
              <h2 className="text-5xl md:text-6xl mb-8 bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                Ready to Create Magic?
              </h2>
              <p className="text-2xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                Join thousands of creators who are transforming their art into magical NFTs on Flow
              </p>
              <Link href="/create">
                <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white border-0 rounded-2xl px-12 py-8 text-xl group">
                  Start Your Journey
                  <Sparkles className="ml-3 group-hover:rotate-12 transition-transform" />
                </Button>
              </Link>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto text-center text-slate-400">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-slate-900" />
            </div>
            <span className="text-xl bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Mintari
            </span>
          </div>
          <p>© 2024 Mintari. Transform your world with AI-powered NFT magic.</p>
        </div>
      </footer>
    </div>
  )
}