import { useState, useEffect } from 'react'

export const useIncidents = () => {
  const [incidents, setIncidents] = useState([])

  // Load incidents from localStorage on mount
  useEffect(() => {
    const savedIncidents = localStorage.getItem('rightguard-incidents')
    if (savedIncidents) {
      try {
        setIncidents(JSON.parse(savedIncidents))
      } catch (error) {
        console.error('Failed to parse stored incidents:', error)
      }
    }
  }, [])

  // Save incidents to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('rightguard-incidents', JSON.stringify(incidents))
  }, [incidents])

  const addIncident = (incident) => {
    setIncidents(prev => [incident, ...prev])
  }

  const removeIncident = (incidentId) => {
    setIncidents(prev => prev.filter(incident => incident.id !== incidentId))
  }

  const updateIncident = (incidentId, updates) => {
    setIncidents(prev => 
      prev.map(incident => 
        incident.id === incidentId 
          ? { ...incident, ...updates }
          : incident
      )
    )
  }

  return {
    incidents,
    addIncident,
    removeIncident,
    updateIncident
  }
}