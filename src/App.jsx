import React, { useState, useEffect } from 'react'
import AppShell from './components/AppShell'
import RightsGuide from './components/RightsGuide'
import RecordingInterface from './components/RecordingInterface'
import IncidentLog from './components/IncidentLog'
import SubscriptionModal from './components/SubscriptionModal'
import { useLocation } from './hooks/useLocation'
import { useIncidents } from './hooks/useIncidents'

function App() {
  const [activeTab, setActiveTab] = useState('rights')
  const [userState, setUserState] = useState('CA')
  const [subscriptionStatus, setSubscriptionStatus] = useState('free')
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  
  const { location, requestLocation } = useLocation()
  const { incidents, addIncident } = useIncidents()

  useEffect(() => {
    // Auto-detect state from location if available
    if (location) {
      // Mock state detection - in real app, would use reverse geocoding
      setUserState('CA')
    }
  }, [location])

  const handlePremiumFeature = () => {
    if (subscriptionStatus === 'free') {
      setShowSubscriptionModal(true)
    }
    return subscriptionStatus === 'premium'
  }

  const handleSubscribe = () => {
    setSubscriptionStatus('premium')
    setShowSubscriptionModal(false)
  }

  return (
    <AppShell 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      subscriptionStatus={subscriptionStatus}
    >
      {activeTab === 'rights' && (
        <RightsGuide 
          userState={userState}
          setUserState={setUserState}
          onPremiumFeature={handlePremiumFeature}
        />
      )}
      
      {activeTab === 'record' && (
        <RecordingInterface 
          onIncidentLogged={addIncident}
          onPremiumFeature={handlePremiumFeature}
          location={location}
          requestLocation={requestLocation}
        />
      )}
      
      {activeTab === 'incidents' && (
        <IncidentLog 
          incidents={incidents}
          onPremiumFeature={handlePremiumFeature}
        />
      )}

      {showSubscriptionModal && (
        <SubscriptionModal 
          onClose={() => setShowSubscriptionModal(false)}
          onSubscribe={handleSubscribe}
        />
      )}
    </AppShell>
  )
}

export default App