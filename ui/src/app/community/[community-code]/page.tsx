'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Wallet, CheckCircle2, ExternalLink, UserPlus, Users } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import Script from 'next/script'

// Type definitions for API responses
interface CommunityStats {
  communityCode: string
  name: string
  registrationCount: number
  registrationLimit: number
  isActive: boolean
}

interface RegistrationStats {
  totalRegistrations: number
  publicRegistrations: number
  communityRegistrations: number
  publicLimit: number
}

interface CommunityRegistrationResponse {
  id: string
  walletAddress: string
  registrationType: string
  communityCode?: string
  createdAt: string
}

// Extend Window interface for Twitter widgets
declare global {
  interface Window {
    twttr: {
      widgets: {
        load(): void
      }
    }
  }
}

export default function CommunityBetaSignUp() {
  const router = useRouter()
  const params = useParams()
  const communityCode = params['community-code'] as string
  
  const [isVisible, setIsVisible] = useState(false)
  const [currentStep, setCurrentStep] = useState<'wallet' | 'success'>('wallet')
  const [walletAddress, setWalletAddress] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [attemptedAutoplay, setAttemptedAutoplay] = useState(false)
  
  // Community and registration data
  const [communityStats, setCommunityStats] = useState<CommunityStats | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)

  // Fetch community stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || ''
        const communityResponse = await fetch(`${baseUrl}/beta-registration/community/${communityCode}/stats`)

        if (communityResponse.ok) {
          const communityData = await communityResponse.json()
          setCommunityStats(communityData)
        } else if (communityResponse.status === 404) {
          setErrorMessage('Community not found')
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
        setErrorMessage('Error loading community information')
      } finally {
        setLoadingStats(false)
      }
    }

    if (communityCode) {
      fetchStats()
      // Refresh stats every 30 seconds
      const interval = setInterval(fetchStats, 30000)
      return () => clearInterval(interval)
    }
  }, [communityCode])

  useEffect(() => {
    setIsVisible(true)
    
    // Try to start audio immediately
    const tryAutoplayAudio = async () => {
      if (!attemptedAutoplay) {
        setAttemptedAutoplay(true)
        const audio = document.getElementById('background-music') as HTMLAudioElement
        if (audio) {
          try {
            audio.muted = false
            audio.volume = 0.2
            await audio.play()
            setAudioEnabled(true)
          } catch (error) {
            try {
              audio.muted = true
              await audio.play()
            } catch (mutedError) {
              console.log('All autoplay attempts failed:', mutedError)
            }
          }
        }
      }
    }

    setTimeout(tryAutoplayAudio, 100)
  }, [attemptedAutoplay])

  // Enable audio on first user interaction
  useEffect(() => {
    const enableAudio = () => {
      if (!audioEnabled) {
        setAudioEnabled(true)
        const audio = document.getElementById('background-music') as HTMLAudioElement
        if (audio) {
          audio.muted = false
          audio.volume = 0.2
          audio.play().catch(console.log)
        }
      }
    }

    const events = ['click', 'touchstart', 'keydown']
    events.forEach(event => {
      document.addEventListener(event, enableAudio, { once: true })
    })

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, enableAudio)
      })
    }
  }, [audioEnabled])

  const handleWalletSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!walletAddress.trim() || !communityStats) return
    
    setIsSubmitting(true)
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || ''
      const response = await fetch(`${baseUrl}/beta-registration/community`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: walletAddress.trim(),
          communityCode: communityCode,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 409) {
          setErrorMessage('Your wallet is already registered! No need to submit again - you\'re all set!')
        } else if (response.status === 400 && data.message?.includes('limit')) {
          setErrorMessage('Community registration is now full! Thanks for your interest.')
        } else if (response.status === 404) {
          setErrorMessage('Community not found or is not active.')
        } else {
          setErrorMessage(data.message || 'There was an error submitting your information. Please try again.')
        }
        setIsSubmitting(false)
        return
      }
      
      setIsSubmitting(false)
      setCurrentStep('success')
      
    } catch (error) {
      console.error('Unexpected error:', error)
      setErrorMessage('There was an unexpected error. Please try again.')
      setIsSubmitting(false)
    }
  }

  // Progress bar component for community
  const renderProgressBar = () => {
    if (!communityStats) return null

    const percentage = Math.min((communityStats.registrationCount / communityStats.registrationLimit) * 100, 100)
    const isNearlyFull = percentage >= 90
    const isFull = communityStats.registrationCount >= communityStats.registrationLimit
    
    return (
      <motion.div 
        variants={itemVariants}
        className="w-full max-w-lg mx-auto mb-8"
      >
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Users className="w-5 h-5 text-yellow-400" />
            <span className="text-lg font-bold text-yellow-400 uppercase" style={{ fontFamily: 'RuneScape UF, monospace' }}>
              {communityStats.registrationCount.toLocaleString()} / {communityStats.registrationLimit.toLocaleString()} SPOTS
            </span>
          </div>
          <p className="text-sm text-yellow-400/80 uppercase mb-2" style={{ fontFamily: 'RuneScape UF, monospace' }}>
            {communityStats.name}
          </p>
          <p className="text-sm text-yellow-400/60 uppercase" style={{ fontFamily: 'RuneScape UF, monospace' }}>
            {isFull ? 'REGISTRATION FULL' : isNearlyFull ? 'FILLING UP FAST!' : 'SPOTS AVAILABLE'}
          </p>
        </div>
        
        <div className="relative">
          <div 
            className="w-full h-4 bg-black border-2 border-yellow-400/40"
            style={{ borderRadius: 0 }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full ${isFull ? 'bg-red-500' : isNearlyFull ? 'bg-orange-500' : 'bg-yellow-400'}`}
              style={{ borderRadius: 0 }}
            />
          </div>
          <div className="absolute inset-0 border-2 border-yellow-400/60" style={{ borderRadius: 0 }} />
        </div>
        
        {isFull && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-4 p-4 bg-red-500/10 border-2 border-red-500/40"
            style={{ borderRadius: 0 }}
          >
            <p className="text-red-400 font-bold uppercase" style={{ fontFamily: 'RuneScape UF, monospace' }}>
              COMMUNITY REGISTRATION IS NOW CLOSED
            </p>
          </motion.div>
        )}

      </motion.div>
    )
  }

  // Error modal component
  const renderErrorModal = () => {
    if (!errorMessage) return null

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black border-2 border-red-500 p-8 max-w-md w-full"
          style={{ borderRadius: 0 }}
        >
          <div className="text-center">
            {errorMessage?.includes('already registered') ? (
              <div className="w-16 h-16 bg-yellow-400/10 border-2 border-yellow-400/60 flex items-center justify-center mx-auto mb-4" style={{ borderRadius: 0 }}>
                <CheckCircle2 className="w-8 h-8 text-yellow-400" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-red-500/10 border-2 border-red-500/60 flex items-center justify-center mx-auto mb-4" style={{ borderRadius: 0 }}>
                <ExternalLink className="w-8 h-8 text-red-500 rotate-45" />
              </div>
            )}
            
            <h3 className="text-xl font-bold mb-4 uppercase tracking-wide" style={{ 
              fontFamily: 'RuneScape UF, monospace',
              color: errorMessage?.includes('already registered') ? '#facc15' : '#f87171'
            }}>
              {errorMessage?.includes('already registered') ? 'ALREADY REGISTERED' : 'ERROR'}
            </h3>
            <p className="mb-6" style={{ 
              fontFamily: 'RuneScape UF, monospace',
              color: errorMessage?.includes('already registered') ? '#fbbf24' : '#fca5a5'
            }}>
              {errorMessage?.toUpperCase()}
            </p>
            <motion.button
              onClick={() => setErrorMessage(null)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-6 py-3 font-semibold uppercase border-2 border-transparent transition-all duration-200 ${
                errorMessage?.includes('already registered') 
                  ? 'bg-yellow-400/80 hover:bg-yellow-400 text-black hover:border-yellow-400/50' 
                  : 'bg-red-500/80 hover:bg-red-500 text-white hover:border-red-400/50'
              }`}
              style={{ borderRadius: 0, fontFamily: 'RuneScape UF, monospace', boxShadow: 'inset 0 -4px 0 rgba(0, 0, 0, 0.3)' }}
            >
              GOT IT
            </motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100
      }
    }
  }

  const renderWalletStep = () => {
    if (loadingStats) {
      return (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-lg mx-auto text-center"
        >
          <div className="w-16 h-16 bg-yellow-400/10 border-2 border-yellow-400/60 flex items-center justify-center mx-auto mb-4" style={{ borderRadius: 0 }}>
            <div className="w-6 h-6 border-2 border-yellow-400/30 border-t-yellow-400 animate-spin" style={{ borderRadius: '50%' }} />
          </div>
          <p className="text-yellow-400/60" style={{ fontFamily: 'RuneScape UF, monospace' }}>
            LOADING COMMUNITY INFORMATION...
          </p>
        </motion.div>
      )
    }

    if (!communityStats) {
      return (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-lg mx-auto text-center"
        >
          <div className="w-16 h-16 bg-red-500/10 border-2 border-red-500/60 flex items-center justify-center mx-auto mb-4" style={{ borderRadius: 0 }}>
            <ExternalLink className="w-8 h-8 text-red-500 rotate-45" />
          </div>
          <p className="text-red-400 font-bold uppercase mb-4" style={{ fontFamily: 'RuneScape UF, monospace' }}>
            COMMUNITY NOT FOUND
          </p>
          <motion.button
            onClick={() => router.push('/')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-yellow-400/80 hover:bg-yellow-400 text-black font-semibold uppercase border-2 border-transparent hover:border-yellow-400/50 transition-all duration-200"
            style={{ borderRadius: 0, fontFamily: 'RuneScape UF, monospace', boxShadow: 'inset 0 -4px 0 rgba(0, 0, 0, 0.3)' }}
          >
            TRY PUBLIC ACCESS
          </motion.button>
        </motion.div>
      )
    }

    if (!communityStats.isActive || communityStats.registrationCount >= communityStats.registrationLimit) {
      return (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-lg mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-8">
            <div className="w-16 h-16 bg-red-500/10 border-2 border-red-500/60 flex items-center justify-center mx-auto mb-4" style={{ borderRadius: 0 }}>
              <Users className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-red-400 uppercase tracking-wide" style={{ fontFamily: 'RuneScape UF, monospace' }}>
              REGISTRATION CLOSED
            </h2>
            <p className="text-red-400/80" style={{ fontFamily: 'RuneScape UF, monospace' }}>
              {!communityStats.isActive ? 'THIS COMMUNITY IS NOT ACTIVE' : 'THIS COMMUNITY HAS REACHED ITS REGISTRATION LIMIT'}
            </p>
          </motion.div>

          {renderProgressBar()}

          <motion.div variants={itemVariants} className="text-center">
            <motion.button
              onClick={() => router.push('/')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-yellow-400/80 hover:bg-yellow-400 text-black font-semibold uppercase border-2 border-transparent hover:border-yellow-400/50 transition-all duration-200"
              style={{ borderRadius: 0, fontFamily: 'RuneScape UF, monospace', boxShadow: 'inset 0 -4px 0 rgba(0, 0, 0, 0.3)' }}
            >
              TRY PUBLIC ACCESS
            </motion.button>
          </motion.div>
        </motion.div>
      )
    }

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-lg mx-auto"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="w-16 h-16 bg-yellow-400/10 border-2 border-yellow-400/60 flex items-center justify-center mx-auto mb-4" style={{ borderRadius: 0 }}>
            <Wallet className="w-8 h-8 text-yellow-400" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-yellow-400 uppercase tracking-wide" style={{ fontFamily: 'RuneScape UF, monospace' }}>
            JOIN BROTHER TERMINAL THROUGH {communityStats.name.toUpperCase()}
          </h2>
          <p className="text-yellow-400/60" style={{ fontFamily: 'RuneScape UF, monospace' }}>
            SUBMIT YOUR WALLET TO ACCESS BROTHER TERMINAL AS PART OF {communityStats.name.toUpperCase()}
          </p>
        </motion.div>

        {renderProgressBar()}

        <motion.form variants={itemVariants} onSubmit={handleWalletSubmit} className="space-y-6">
          <div>
            <label htmlFor="wallet" className="block text-sm font-medium mb-2 text-yellow-400/80 uppercase" style={{ fontFamily: 'RuneScape UF, monospace' }}>
              WALLET ADDRESS
            </label>
            <input
              id="wallet"
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="0X..."
              className="w-full px-4 py-3 bg-black border-2 border-yellow-400/40 text-yellow-400 focus:border-yellow-400 transition-all duration-200 uppercase"
              style={{ borderRadius: 0, fontFamily: 'RuneScape UF, monospace' }}
              required
            />
          </div>
          
          <motion.button
            type="submit"
            disabled={!walletAddress.trim() || isSubmitting}
            whileHover={{ scale: !walletAddress.trim() || isSubmitting ? 1 : 1.02, boxShadow: !walletAddress.trim() || isSubmitting ? "none" : "0 0 15px rgba(240, 255, 0, 0.3)" }}
            whileTap={{ scale: !walletAddress.trim() || isSubmitting ? 1 : 0.98 }}
            className="w-full bg-yellow-400/80 hover:bg-yellow-400 disabled:bg-yellow-400/30 text-black px-6 py-3 font-semibold transition-all duration-200 flex items-center justify-center uppercase border-2 border-transparent hover:border-yellow-400/50"
            style={{ borderRadius: 0, fontFamily: 'RuneScape UF, monospace', boxShadow: 'inset 0 -4px 0 rgba(0, 0, 0, 0.3)' }}
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-black/30 border-t-black animate-spin" style={{ borderRadius: '50%' }} />
            ) : (
              <>
                <Wallet className="w-4 h-4 mr-2" />
                JOIN BROTHER TERMINAL
              </>
            )}
          </motion.button>
        </motion.form>
      </motion.div>
    )
  }

  const renderSuccessStep = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-md mx-auto text-center"
    >
      <motion.div variants={itemVariants}>
        <div className="w-16 h-16 bg-yellow-400/10 border-2 border-yellow-400/60 flex items-center justify-center mx-auto mb-4" style={{ borderRadius: 0 }}>
          <CheckCircle2 className="w-8 h-8 text-yellow-400" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-yellow-400 uppercase tracking-wide" style={{ fontFamily: 'RuneScape UF, monospace' }}>
          WELCOME TO BROTHER TERMINAL!
        </h2>
        <p className="text-yellow-400/60" style={{ fontFamily: 'RuneScape UF, monospace' }}>
          YOUR REGISTRATION THROUGH {communityStats?.name.toUpperCase()} IS COMPLETE. WE'LL BE IN TOUCH SOON!
        </p>
      </motion.div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-black text-yellow-400 relative overflow-hidden">
      {/* RuneScape UF Font Import */}
      <link href="https://fonts.cdnfonts.com/css/runescape-uf" rel="stylesheet" />
      
      {/* Background Music */}
      <audio 
        id="background-music"
        loop
        preload="auto"
        className="hidden"
      >
        <source src="/audio/background-music.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      
      {/* Video Background */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-20"
        >
          <source src="/videos/beta_background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl">
          {currentStep === 'wallet' && renderWalletStep()}
          {currentStep === 'success' && renderSuccessStep()}
        </div>
      </div>

      {/* Error Modal */}
      {renderErrorModal()}
    </div>
  )
}