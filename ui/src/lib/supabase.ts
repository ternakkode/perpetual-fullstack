import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Constants
export const BETA_REGISTRATION_LIMIT = 3000

// Helper function to get registration count
export async function getBetaRegistrationCount() {
  const { count, error } = await supabase
    .from('beta_signups')
    .select('*', { count: 'exact', head: true })
  
  return { count: count || 0, error }
}

// Helper function for secure beta signup submission with limit check
export async function submitBetaSignup(walletAddress: string, twitterHandle: string, tweetUrl: string) {
  // First check if we've hit the limit
  const { count, error: countError } = await getBetaRegistrationCount()
  
  if (countError) {
    return { data: null, error: countError }
  }
  
  if (count >= BETA_REGISTRATION_LIMIT) {
    return { 
      data: null, 
      error: { 
        code: 'REGISTRATION_FULL', 
        message: 'Beta registration is now full. Thanks for your interest!' 
      } 
    }
  }
  
  const { data, error } = await supabase
    .from('beta_signups')
    .insert([
      {
        wallet_address: walletAddress.trim(),
        twitter_handle: twitterHandle.trim(),
        tweet_url: tweetUrl
      }
    ])
    .select()
  
  return { data, error }
}

export type BetaSignup = {
  id: string
  wallet_address: string
  twitter_handle: string
  tweet_url: string
  created_at: string
  updated_at: string
}