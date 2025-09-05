import { useState, useEffect } from 'react'
import { DatabaseService } from '../services/supabase.js'
import { AlertService, alertUtils } from '../services/alerts.js'

export const useEmergencyContacts = (userId) => {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load contacts on mount
  useEffect(() => {
    if (userId) {
      loadContacts()
    } else {
      // Fallback to localStorage for demo mode
      loadLocalContacts()
    }
  }, [userId])

  const loadContacts = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await DatabaseService.getUserEmergencyContacts(userId)
      
      if (result.success) {
        setContacts(result.data || [])
      } else {
        throw new Error(result.error)
      }
    } catch (err) {
      console.error('Error loading emergency contacts:', err)
      setError(err.message)
      // Fallback to localStorage
      loadLocalContacts()
    } finally {
      setLoading(false)
    }
  }

  const loadLocalContacts = () => {
    try {
      const savedContacts = localStorage.getItem('rightguard-emergency-contacts')
      if (savedContacts) {
        setContacts(JSON.parse(savedContacts))
      }
    } catch (error) {
      console.error('Error loading local contacts:', error)
    }
  }

  // Save contacts to localStorage as backup
  useEffect(() => {
    if (contacts.length > 0) {
      localStorage.setItem('rightguard-emergency-contacts', JSON.stringify(contacts))
    }
  }, [contacts])

  const addContact = async (contactData) => {
    setLoading(true)
    setError(null)

    try {
      // Validate contact data
      const validation = validateContact(contactData)
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '))
      }

      const newContact = {
        id: Date.now().toString(),
        name: contactData.name.trim(),
        phone: contactData.phone.trim(),
        email: contactData.email.trim(),
        relationship: contactData.relationship.trim(),
        createdAt: new Date().toISOString(),
        ...contactData
      }

      // Save to database if user is authenticated
      if (userId) {
        const result = await DatabaseService.addEmergencyContact(userId, newContact)
        
        if (!result.success) {
          throw new Error(result.error)
        }
        
        // Use the ID from database
        newContact.id = result.data.id
      }

      // Update local state
      setContacts(prev => [...prev, newContact])

      return { success: true, contact: newContact }
    } catch (err) {
      console.error('Error adding emergency contact:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const updateContact = async (contactId, updates) => {
    setLoading(true)
    setError(null)

    try {
      // Validate updates
      const updatedContact = { ...contacts.find(c => c.id === contactId), ...updates }
      const validation = validateContact(updatedContact)
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '))
      }

      // Update in database if user is authenticated
      if (userId) {
        // Note: You'd need to implement updateEmergencyContact in DatabaseService
        console.log('Would update contact in database:', contactId, updates)
      }

      // Update local state
      setContacts(prev => 
        prev.map(contact => 
          contact.id === contactId 
            ? { ...contact, ...updates, updatedAt: new Date().toISOString() }
            : contact
        )
      )

      return { success: true }
    } catch (err) {
      console.error('Error updating emergency contact:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const removeContact = async (contactId) => {
    setLoading(true)
    setError(null)

    try {
      // Remove from database if user is authenticated
      if (userId) {
        // Note: You'd need to implement removeEmergencyContact in DatabaseService
        console.log('Would remove contact from database:', contactId)
      }

      // Update local state
      setContacts(prev => prev.filter(contact => contact.id !== contactId))

      return { success: true }
    } catch (err) {
      console.error('Error removing emergency contact:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const testAlerts = async () => {
    setLoading(true)
    setError(null)

    try {
      if (contacts.length === 0) {
        throw new Error('No emergency contacts to test')
      }

      const result = await AlertService.sendTestAlert(contacts, userId)
      
      if (!result.success) {
        throw new Error(result.error)
      }

      return {
        success: true,
        results: result.results,
        message: `Test alerts sent to ${contacts.length} contact(s)`
      }
    } catch (err) {
      console.error('Error testing alerts:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const sendEmergencyAlert = async (incidentData) => {
    setLoading(true)
    setError(null)

    try {
      if (contacts.length === 0) {
        throw new Error('No emergency contacts configured')
      }

      const result = await AlertService.sendEmergencyAlert(incidentData, contacts)
      
      if (!result.success) {
        throw new Error(result.error)
      }

      return {
        success: true,
        results: result.results,
        totalContacts: result.totalContacts,
        successfulAlerts: result.successfulAlerts
      }
    } catch (err) {
      console.error('Error sending emergency alert:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const validateContact = (contact) => {
    const errors = []

    if (!contact.name || contact.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long')
    }

    if (!contact.phone || !alertUtils.validatePhoneNumber(contact.phone)) {
      errors.push('Please enter a valid phone number')
    }

    if (!contact.email || !alertUtils.validateEmail(contact.email)) {
      errors.push('Please enter a valid email address')
    }

    if (!contact.relationship || contact.relationship.trim().length < 2) {
      errors.push('Relationship must be specified')
    }

    // Check for duplicate phone numbers
    const existingContact = contacts.find(c => 
      c.id !== contact.id && c.phone === contact.phone
    )
    if (existingContact) {
      errors.push('This phone number is already used by another contact')
    }

    // Check for duplicate email addresses
    const existingEmailContact = contacts.find(c => 
      c.id !== contact.id && c.email === contact.email
    )
    if (existingEmailContact) {
      errors.push('This email address is already used by another contact')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  const getContactStats = () => {
    return {
      total: contacts.length,
      byRelationship: contacts.reduce((acc, contact) => {
        acc[contact.relationship] = (acc[contact.relationship] || 0) + 1
        return acc
      }, {}),
      hasPhone: contacts.filter(c => c.phone).length,
      hasEmail: contacts.filter(c => c.email).length,
      recentlyAdded: contacts.filter(c => {
        const addedDate = new Date(c.createdAt)
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        return addedDate > weekAgo
      }).length
    }
  }

  const formatContactForDisplay = (contact) => {
    return {
      ...contact,
      phoneFormatted: alertUtils.formatPhoneNumber(contact.phone),
      addedAgo: getTimeAgo(contact.createdAt),
      updatedAgo: contact.updatedAt ? getTimeAgo(contact.updatedAt) : null
    }
  }

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  }

  return {
    contacts: contacts.map(formatContactForDisplay),
    loading,
    error,
    addContact,
    updateContact,
    removeContact,
    testAlerts,
    sendEmergencyAlert,
    validateContact,
    getContactStats,
    refreshContacts: loadContacts,
    hasContacts: contacts.length > 0
  }
}
