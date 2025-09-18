'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Wallet, CheckCircle2, ExternalLink, UserPlus, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'
// Types for API responses
interface RegistrationStats {
  totalRegistrations: number
  publicRegistrations: number
  communityRegistrations: number
  publicLimit: number
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

export default function SignUp() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [currentStep, setCurrentStep] = useState<'social' | 'wallet' | 'success'>('social')
  const [walletAddress, setWalletAddress] = useState('')
  const [twitterHandle, setTwitterHandle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tweetLoaded, setTweetLoaded] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [attemptedAutoplay, setAttemptedAutoplay] = useState(false)
  
  // Update this URL when the tweet goes live
  const TWEET_URL = "https://x.com/baldbrothers_/status/1966487979746115722"
  const TWEET_ID = "1958866158477590663"


  useEffect(() => {
    setIsVisible(true)
    
    // Try to start audio immediately
    const tryAutoplayAudio = async () => {
      if (!attemptedAutoplay) {
        setAttemptedAutoplay(true)
        const audio = document.getElementById('background-music') as HTMLAudioElement
        if (audio) {
          try {
            // First try with sound
            audio.muted = false
            audio.volume = 0.2
            await audio.play()
            setAudioEnabled(true)
            console.log('Audio autoplay successful')
          } catch (error) {
            console.log('Autoplay with sound blocked, trying muted autoplay')
            try {
              // If that fails, try muted
              audio.muted = true
              await audio.play()
              console.log('Muted autoplay successful')
            } catch (mutedError) {
              console.log('All autoplay attempts failed:', mutedError)
            }
          }
        }
      }
    }

    // Small delay to ensure audio element is ready
    setTimeout(tryAutoplayAudio, 100)
  }, [])

  // Load Twitter widgets script
  useEffect(() => {
    if (typeof window !== 'undefined' && window.twttr?.widgets) {
      window.twttr.widgets.load()
      setTweetLoaded(true)
    }
  }, [currentStep])


  // Enable audio on first user interaction
  useEffect(() => {
    const enableAudio = () => {
      if (!audioEnabled) {
        setAudioEnabled(true)
        const audio = document.getElementById('background-music') as HTMLAudioElement
        if (audio) {
          audio.muted = false
          audio.volume = 0.2 // Set volume to 20%
          audio.play().catch(console.log)
        }
      }
    }

    // Listen for any user interaction
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
    if (!walletAddress.trim()) return
    
    setIsSubmitting(true)
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || ''
      const response = await fetch(`${baseUrl}/beta-registration/public`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: walletAddress.trim(),
          twitterHandle: twitterHandle,
          tweetUrl: TWEET_URL,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Error submitting registration:', data)
        
        if (response.status === 409) {
          setErrorMessage('Your wallet is already recorded! No need to submit again - you\'re all set!')
        } else {
          setErrorMessage(data.message || 'There was an error submitting your information. Please try again.')
        }
        
        setIsSubmitting(false)
        return
      }
      
      console.log('Successfully submitted:', data)
      setIsSubmitting(false)
      setCurrentStep('success')
      
    } catch (error) {
      console.error('Unexpected error:', error)
      setErrorMessage('There was an unexpected error. Please try again.')
      setIsSubmitting(false)
    }
  }

  const handleTwitterAction = () => {
    // Open Twitter in new tab
    window.open(TWEET_URL, '_blank')
    
    // Move to wallet step after Twitter action
    setTimeout(() => {
      setCurrentStep('wallet')
    }, 2000)
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
            {/* Show different icon and color for duplicate vs error */}
            {errorMessage?.includes('already recorded') ? (
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
              color: errorMessage?.includes('already recorded') ? '#facc15' : '#f87171'
            }}>
              {errorMessage?.includes('already recorded') ? 'ALREADY REGISTERED' : 'ERROR'}
            </h3>
            <p className="mb-6" style={{ 
              fontFamily: 'RuneScape UF, monospace',
              color: errorMessage?.includes('already recorded') ? '#fbbf24' : '#fca5a5'
            }}>
              {errorMessage?.toUpperCase()}
            </p>
            <motion.button
              onClick={() => setErrorMessage(null)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-6 py-3 font-semibold uppercase border-2 border-transparent transition-all duration-200 ${
                errorMessage?.includes('already recorded') 
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

  const renderWalletStep = () => (
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
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-yellow-400 uppercase tracking-wide" style={{ fontFamily: 'RuneScape UF, monospace' }}>SUBMIT YOUR WALLET</h2>
        <p className="text-yellow-400/60" style={{ fontFamily: 'RuneScape UF, monospace' }}>
          NOW SUBMIT YOUR WALLET ADDRESS TO COMPLETE YOUR REGISTRATION
        </p>
      </motion.div>


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
              SUBMIT WALLET
            </>
          )}
        </motion.button>
      </motion.form>
    </motion.div>
  )

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
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-yellow-400 uppercase tracking-wide" style={{ fontFamily: 'RuneScape UF, monospace' }}>WELCOME TO BROTHER TERMINAL!</h2>
        <p className="text-yellow-400/60" style={{ fontFamily: 'RuneScape UF, monospace' }}>
          YOUR REGISTRATION IS COMPLETE. WE'LL BE IN TOUCH SOON!
        </p>
      </motion.div>
    </motion.div>
  )

  const renderSocialStep = () => {
    // No limits for public registration
    
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-lg mx-auto"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="w-16 h-16 bg-yellow-400/10 border-2 border-yellow-400/60 flex items-center justify-center mx-auto mb-4" style={{ borderRadius: 0 }}>
            <UserPlus className="w-8 h-8 text-yellow-400" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-yellow-400 uppercase tracking-wide" style={{ fontFamily: 'RuneScape UF, monospace' }}>
            JOIN BROTHER TERMINAL
          </h2>
          <p className="text-yellow-400/60" style={{ fontFamily: 'RuneScape UF, monospace' }}>
            FIRST, RETWEET AND COMMENT ON OUR ANNOUNCEMENT TO SECURE YOUR SPOT
          </p>
        </motion.div>


        <motion.div variants={itemVariants} className="space-y-4">
        <div>
          <label htmlFor="twitter" className="block text-sm font-medium mb-2 text-yellow-400/80 uppercase" style={{ fontFamily: 'RuneScape UF, monospace' }}>
            YOUR TWITTER HANDLE
          </label>
          <input
            id="twitter"
            type="text"
            value={twitterHandle}
            onChange={(e) => setTwitterHandle(e.target.value)}
            placeholder="@YOURUSERNAME"
            className="w-full px-4 py-3 bg-black border-2 border-yellow-400/40 text-yellow-400 focus:border-yellow-400 transition-all duration-200 uppercase"
            style={{ borderRadius: 0, fontFamily: 'RuneScape UF, monospace' }}
            required
          />
        </div>

        <motion.button
          onClick={handleTwitterAction}
          disabled={!twitterHandle.trim()}
          whileHover={{ scale: !twitterHandle.trim() ? 1 : 1.02, boxShadow: !twitterHandle.trim() ? "none" : "0 0 15px rgba(240, 255, 0, 0.3)" }}
          whileTap={{ scale: !twitterHandle.trim() ? 1 : 0.98 }}
          className="w-full bg-yellow-400/80 hover:bg-yellow-400 disabled:bg-yellow-400/30 disabled:cursor-not-allowed text-black px-6 py-3 font-semibold transition-all duration-200 flex items-center justify-center uppercase border-2 border-transparent hover:border-yellow-400/50"
          style={{ borderRadius: 0, fontFamily: 'RuneScape UF, monospace', boxShadow: 'inset 0 -4px 0 rgba(0, 0, 0, 0.3)' }}
        >
          RETWEET & COMMENT
          <ExternalLink className="w-4 h-4 ml-2" />
        </motion.button>

        <motion.button
          onClick={() => setCurrentStep('wallet')}
          disabled={!twitterHandle.trim()}
          whileHover={{ scale: !twitterHandle.trim() ? 1 : 1.02 }}
          whileTap={{ scale: !twitterHandle.trim() ? 1 : 0.98 }}
          className="w-full bg-black hover:bg-gray-900 disabled:bg-black/50 disabled:cursor-not-allowed text-yellow-400 px-6 py-3 font-medium transition-all duration-200 border-2 border-yellow-400/40 hover:border-yellow-400/60 uppercase"
          style={{ borderRadius: 0, fontFamily: 'RuneScape UF, monospace' }}
        >
          I'VE RETWEETED - NEXT STEP
        </motion.button>
        </motion.div>
      </motion.div>
    )
  }

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
        onLoadedData={() => {
          // Try to autoplay when audio data is loaded
          const audio = document.getElementById('background-music') as HTMLAudioElement
          if (audio && !attemptedAutoplay) {
            setAttemptedAutoplay(true)
            audio.volume = 0.2
            audio.muted = false
            audio.play().catch((error) => {
              console.log('Autoplay failed:', error)
              // Try muted as fallback
              audio.muted = true
              audio.play().catch(console.log)
            })
          }
        }}
      >
        <source src="/audio/background-music.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      
      {/* Twitter Widgets Script */}
      <Script
        src="https://platform.twitter.com/widgets.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (typeof window !== 'undefined' && window.twttr?.widgets) {
            window.twttr.widgets.load()
            setTweetLoaded(true)
          }
        }}
      />
      
      {/* Video Background */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-20"
        >
          {/* Update with your video URL */}
          <source src="/videos/beta_background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" />
      </div>


      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl">
          {currentStep === 'social' && renderSocialStep()}
          {currentStep === 'wallet' && renderWalletStep()}
          {currentStep === 'success' && renderSuccessStep()}
        </div>
      </div>

      {/* Error Modal */}
      {renderErrorModal()}

    </div>
  )
}