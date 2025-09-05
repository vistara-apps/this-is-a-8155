import { useState, useEffect } from 'react'
import { auth, DatabaseService } from '../services/supabase.js'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check for existing session on mount
    checkUser()

    // Listen for auth state changes
    const { data: { subscription } } = auth.supabase?.auth?.onAuthStateChange?.(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await handleUserSignIn(session.user)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }
      }
    ) || { data: { subscription: null } }

    return () => {
      subscription?.unsubscribe?.()
    }
  }, [])

  const checkUser = async () => {
    try {
      const result = await auth.getCurrentUser()
      
      if (result.success && result.user) {
        await handleUserSignIn(result.user)
      }
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUserSignIn = async (authUser) => {
    try {
      // Get or create user profile
      let userResult = await DatabaseService.getUser(authUser.id)
      
      if (!userResult.success) {
        // Create new user profile
        const createResult = await DatabaseService.createUser({
          userId: authUser.id,
          subscriptionStatus: 'free',
          preferredLanguages: ['en']
        })
        
        if (createResult.success) {
          userResult = createResult
        }
      }

      setUser({
        id: authUser.id,
        email: authUser.email,
        profile: userResult.data || {
          subscription_status: 'free',
          preferred_languages: ['en']
        }
      })
    } catch (error) {
      console.error('Error handling user sign in:', error)
      setError(error.message)
    }
  }

  const signUp = async (email, password) => {
    setLoading(true)
    setError(null)

    try {
      const result = await auth.signUp(email, password)
      
      if (!result.success) {
        throw new Error(result.error)
      }

      return { success: true, data: result.data }
    } catch (err) {
      console.error('Error signing up:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    setLoading(true)
    setError(null)

    try {
      const result = await auth.signIn(email, password)
      
      if (!result.success) {
        throw new Error(result.error)
      }

      return { success: true, data: result.data }
    } catch (err) {
      console.error('Error signing in:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await auth.signOut()
      
      if (!result.success) {
        throw new Error(result.error)
      }

      setUser(null)
      return { success: true }
    } catch (err) {
      console.error('Error signing out:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates) => {
    if (!user) {
      return { success: false, error: 'No user logged in' }
    }

    setLoading(true)
    setError(null)

    try {
      const result = await DatabaseService.updateUserSubscription(
        user.id, 
        updates.subscriptionStatus || user.profile.subscription_status
      )
      
      if (!result.success) {
        throw new Error(result.error)
      }

      // Update local user state
      setUser(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          ...updates
        }
      }))

      return { success: true, data: result.data }
    } catch (err) {
      console.error('Error updating profile:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const updateSubscription = async (subscriptionStatus) => {
    return updateProfile({ subscription_status: subscriptionStatus })
  }

  const updateLanguagePreferences = async (languages) => {
    return updateProfile({ preferred_languages: languages })
  }

  // Demo mode functions for when user is not authenticated
  const enterDemoMode = () => {
    setUser({
      id: 'demo-user',
      email: 'demo@rightguard.ai',
      profile: {
        subscription_status: 'free',
        preferred_languages: ['en']
      },
      isDemo: true
    })
  }

  const exitDemoMode = () => {
    setUser(null)
  }

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    updateProfile,
    updateSubscription,
    updateLanguagePreferences,
    enterDemoMode,
    exitDemoMode,
    isAuthenticated: !!user && !user.isDemo,
    isDemoMode: !!user?.isDemo
  }
}
