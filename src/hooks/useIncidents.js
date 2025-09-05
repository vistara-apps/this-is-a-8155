import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { DatabaseService } from '../services/supabase.js'
import { AlertService } from '../services/alerts.js'
import { AIService } from '../services/openai.js'

export const useIncidents = (userId) => {
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load incidents from database on mount
  useEffect(() => {
    if (userId) {
      loadIncidents()
    } else {
      // Fallback to localStorage for demo mode
      loadLocalIncidents()
    }
  }, [userId])

  const loadIncidents = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await DatabaseService.getUserIncidents(userId)
      
      if (result.success) {
        setIncidents(result.data || [])
      } else {
        throw new Error(result.error)
      }
    } catch (err) {
      console.error('Error loading incidents:', err)
      setError(err.message)
      // Fallback to localStorage
      loadLocalIncidents()
    } finally {
      setLoading(false)
    }
  }

  const loadLocalIncidents = () => {
    try {
      const savedIncidents = localStorage.getItem('rightguard-incidents')
      if (savedIncidents) {
        setIncidents(JSON.parse(savedIncidents))
      }
    } catch (error) {
      console.error('Error loading local incidents:', error)
    }
  }

  // Save incidents to localStorage as backup
  useEffect(() => {
    if (incidents.length > 0) {
      localStorage.setItem('rightguard-incidents', JSON.stringify(incidents))
    }
  }, [incidents])

  const addIncident = async (incidentData, emergencyContacts = []) => {
    setLoading(true)
    setError(null)

    try {
      const incidentId = uuidv4()
      const timestamp = new Date().toISOString()
      
      const newIncident = {
        incidentId,
        userId: userId || 'demo-user',
        timestamp,
        location: incidentData.location || 'Unknown location',
        officerDetails: incidentData.officerDetails || {},
        userAccount: incidentData.userAccount || '',
        interactionSummary: incidentData.interactionSummary || '',
        recordingUrl: incidentData.recordingUrl || null,
        alertSent: false,
        ...incidentData
      }

      // Save to database if user is authenticated
      if (userId) {
        const result = await DatabaseService.createIncident(newIncident)
        
        if (!result.success) {
          throw new Error(result.error)
        }
        
        // Send emergency alerts if contacts provided
        if (emergencyContacts.length > 0) {
          const alertResult = await AlertService.sendEmergencyAlert(newIncident, emergencyContacts)
          
          if (alertResult.success) {
            newIncident.alertSent = true
            newIncident.alertResults = alertResult.results
            
            // Update incident with alert status
            await DatabaseService.updateIncident(incidentId, {
              alert_sent: true,
              alert_results: alertResult.results
            })
          }
        }
      }

      // Update local state
      setIncidents(prev => [newIncident, ...prev])
      
      return {
        success: true,
        incident: newIncident
      }
    } catch (err) {
      console.error('Error adding incident:', err)
      setError(err.message)
      
      // Still add to local state as fallback
      const fallbackIncident = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...incidentData
      }
      setIncidents(prev => [fallbackIncident, ...prev])
      
      return {
        success: false,
        error: err.message,
        incident: fallbackIncident
      }
    } finally {
      setLoading(false)
    }
  }

  const updateIncident = async (incidentId, updates) => {
    setLoading(true)
    setError(null)

    try {
      // Update in database if user is authenticated
      if (userId) {
        const result = await DatabaseService.updateIncident(incidentId, updates)
        
        if (!result.success) {
          throw new Error(result.error)
        }
      }

      // Update local state
      setIncidents(prev => 
        prev.map(incident => 
          (incident.incidentId || incident.id) === incidentId 
            ? { ...incident, ...updates } 
            : incident
        )
      )

      return { success: true }
    } catch (err) {
      console.error('Error updating incident:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const removeIncident = async (incidentId) => {
    setLoading(true)
    setError(null)

    try {
      // In production, you might want to soft delete or archive
      // For now, we'll just remove from local state
      setIncidents(prev => 
        prev.filter(incident => 
          (incident.incidentId || incident.id) !== incidentId
        )
      )

      return { success: true }
    } catch (err) {
      console.error('Error deleting incident:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const generateIncidentSummary = async (incidentId, userRights) => {
    setLoading(true)
    setError(null)

    try {
      const incident = incidents.find(inc => 
        (inc.incidentId || inc.id) === incidentId
      )
      
      if (!incident) {
        throw new Error('Incident not found')
      }

      const result = await AIService.generateIncidentSummary(incident, userRights)
      
      if (!result.success) {
        throw new Error(result.error)
      }

      // Update incident with generated summary
      await updateIncident(incidentId, {
        aiSummary: result.data,
        summaryGeneratedAt: new Date().toISOString()
      })

      return {
        success: true,
        summary: result.data
      }
    } catch (err) {
      console.error('Error generating incident summary:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const analyzeIncident = async (incidentId) => {
    setLoading(true)
    setError(null)

    try {
      const incident = incidents.find(inc => 
        (inc.incidentId || inc.id) === incidentId
      )
      
      if (!incident) {
        throw new Error('Incident not found')
      }

      const result = await AIService.analyzeIncident(incident)
      
      if (!result.success) {
        throw new Error(result.error)
      }

      // Update incident with analysis
      await updateIncident(incidentId, {
        aiAnalysis: result.data,
        analysisGeneratedAt: new Date().toISOString()
      })

      return {
        success: true,
        analysis: result.data
      }
    } catch (err) {
      console.error('Error analyzing incident:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  return {
    incidents,
    loading,
    error,
    addIncident,
    updateIncident,
    removeIncident,
    generateIncidentSummary,
    analyzeIncident,
    refreshIncidents: loadIncidents
  }
}
