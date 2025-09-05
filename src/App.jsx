import React, { useState, useEffect } from 'react'
import AppShell from './components/AppShell'
import RightsGuide from './components/RightsGuide'
import RecordingInterface from './components/RecordingInterface'
import IncidentLog from './components/IncidentLog'
import EmergencyContacts from './components/EmergencyContacts'
import SubscriptionModal from './components/SubscriptionModal'
import { useLocation } from './hooks/useLocation'
import { useIncidents } from './hooks/useIncidents'
import { useAuth } from './hooks/useAuth'
import { useEmergencyContacts } from './hooks/useEmergencyContacts'
import { config, validateConfig } from './config/env'

function App() {
  const [activeTab, setActiveTab] = useState('rights')
  const [userState, setUserState] = useState('CA')
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  
  // Authentication
  const { 
    user, 
    loading: authLoading, 
    signIn, 
    signUp, 
    signOut, 
    enterDemoMode,
    isAuthenticated,
    isDemoMode 
  } = useAuth()
  
  // Location services
  const { location, requestLocation } = useLocation()
  
  // Incidents management with user context
  const { 
    incidents, 
    addIncident, 
    loading: incidentsLoading,
    error: incidentsError 
  } = useIncidents(user?.id)
  
  // Emergency contacts with user context
  const { 
    contacts: emergencyContacts,
    sendEmergencyAlert 
  } = useEmergencyContacts(user?.id)

  // Validate configuration on app start
  useEffect(() => {
    const isConfigValid = validateConfig()
    if (!isConfigValid && config.app.environment === 'production') {
      console.warn('Some environment variables are missing. App may not function correctly.')
    }
  }, [])

  // Auto-detect state from location if available
  useEffect(() => {
    if (location) {
      // Mock state detection - in real app, would use reverse geocoding
      setUserState('CA')
    }
  }, [location])

  const handlePremiumFeature = () => {
    const subscriptionStatus = user?.profile?.subscription_status || 'free'
    
    if (subscriptionStatus === 'free') {
      setShowSubscriptionModal(true)
      return false
    }
    return true
  }

  const handleSubscribe = async () => {
    // In a real app, this would integrate with Stripe
    // For demo purposes, we'll just update the user's subscription status
    if (user && !isDemoMode) {
      // Update user subscription status
      console.log('Subscription upgrade initiated')
    }
    setShowSubscriptionModal(false)
  }

  const handleIncidentLogged = async (incidentData) => {
    try {
      // Add incident with emergency contacts for alerts
      const result = await addIncident(incidentData, emergencyContacts)
      
      if (result.success) {
        console.log('Incident logged successfully:', result.incident)
        
        // Send emergency alerts if premium user and contacts exist
        if (handlePremiumFeature() && emergencyContacts.length > 0) {
          await sendEmergencyAlert(result.incident)
        }
      }
      
      return result
    } catch (error) {
      console.error('Error logging incident:', error)
      return { success: false, error: error.message }
    }
  }

  // Show loading screen while authenticating
  if (authLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading RightGuard AI...</p>
        </div>
      </div>
    )
  }

  // Show demo mode prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-surface rounded-lg shadow-card p-6 text-center">
          <h1 className="text-heading1 text-text-primary mb-4">Welcome to RightGuard AI</h1>
          <p className="text-body text-text-secondary mb-6">
            Know your rights, anytime, anywhere. Get instant legal guidance during police interactions.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={enterDemoMode}
              className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Try Demo Mode
            </button>
            
            <div className="text-sm text-text-secondary">
              <p>Demo mode lets you explore all features without creating an account.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <AppShell 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      user={user}
      onSignOut={signOut}
      isDemoMode={isDemoMode}
    >
      {activeTab === 'rights' && (
        <RightsGuide 
          userState={userState}
          setUserState={setUserState}
          onPremiumFeature={handlePremiumFeature}
          user={user}
        />
      )}
      
      {activeTab === 'record' && (
        <RecordingInterface 
          onIncidentLogged={handleIncidentLogged}
          onPremiumFeature={handlePremiumFeature}
          location={location}
          requestLocation={requestLocation}
          user={user}
          emergencyContacts={emergencyContacts}
        />
      )}
      
      {activeTab === 'incidents' && (
        <IncidentLog 
          incidents={incidents}
          onPremiumFeature={handlePremiumFeature}
          loading={incidentsLoading}
          error={incidentsError}
          user={user}
        />
      )}

      {activeTab === 'contacts' && (
        <EmergencyContacts
          userId={user?.id}
          onPremiumFeature={handlePremiumFeature}
        />
      )}

      {showSubscriptionModal && (
        <SubscriptionModal 
          onClose={() => setShowSubscriptionModal(false)}
          onSubscribe={handleSubscribe}
          user={user}
          isDemoMode={isDemoMode}
        />
      )}
    </AppShell>
  )
}

export default App
