import React, { useState } from 'react'
import { Plus, Phone, Mail, User, TestTube, AlertTriangle, Check, X } from 'lucide-react'
import CTAButton from './CTAButton'
import { useEmergencyContacts } from '../hooks/useEmergencyContacts'

const EmergencyContacts = ({ userId, onPremiumFeature }) => {
  const {
    contacts,
    loading,
    error,
    addContact,
    updateContact,
    removeContact,
    testAlerts,
    validateContact,
    getContactStats,
    hasContacts
  } = useEmergencyContacts(userId)

  const [showAddForm, setShowAddForm] = useState(false)
  const [editingContact, setEditingContact] = useState(null)
  const [testingAlerts, setTestingAlerts] = useState(false)
  const [testResults, setTestResults] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    relationship: ''
  })

  const [formErrors, setFormErrors] = useState({})

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Check if premium feature is required
    if (contacts.length >= 2 && !onPremiumFeature()) {
      return
    }

    const validation = validateContact(formData)
    if (!validation.isValid) {
      const errors = {}
      validation.errors.forEach(error => {
        if (error.includes('Name')) errors.name = error
        if (error.includes('phone')) errors.phone = error
        if (error.includes('email')) errors.email = error
        if (error.includes('Relationship')) errors.relationship = error
      })
      setFormErrors(errors)
      return
    }

    try {
      let result
      if (editingContact) {
        result = await updateContact(editingContact.id, formData)
      } else {
        result = await addContact(formData)
      }

      if (result.success) {
        setFormData({ name: '', phone: '', email: '', relationship: '' })
        setShowAddForm(false)
        setEditingContact(null)
        setFormErrors({})
      }
    } catch (error) {
      console.error('Error saving contact:', error)
    }
  }

  const handleEdit = (contact) => {
    setEditingContact(contact)
    setFormData({
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      relationship: contact.relationship
    })
    setShowAddForm(true)
  }

  const handleDelete = async (contactId) => {
    if (window.confirm('Are you sure you want to delete this emergency contact?')) {
      await removeContact(contactId)
    }
  }

  const handleTestAlerts = async () => {
    if (!onPremiumFeature()) {
      return
    }

    setTestingAlerts(true)
    setTestResults(null)

    try {
      const result = await testAlerts()
      setTestResults(result)
    } catch (error) {
      console.error('Error testing alerts:', error)
    } finally {
      setTestingAlerts(false)
    }
  }

  const cancelForm = () => {
    setShowAddForm(false)
    setEditingContact(null)
    setFormData({ name: '', phone: '', email: '', relationship: '' })
    setFormErrors({})
  }

  const stats = getContactStats()

  if (loading && !hasContacts) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-heading1 text-text-primary">Emergency Contacts</h2>
          <p className="text-body text-text-secondary mt-1">
            People who will be notified during police interactions
          </p>
        </div>
        
        {hasContacts && (
          <CTAButton
            variant="secondary"
            onClick={handleTestAlerts}
            disabled={testingAlerts}
            className="flex items-center gap-2"
          >
            <TestTube className="w-4 h-4" />
            {testingAlerts ? 'Testing...' : 'Test Alerts'}
          </CTAButton>
        )}
      </div>

      {/* Stats */}
      {hasContacts && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface p-4 rounded-lg border">
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <div className="text-caption text-text-secondary">Total Contacts</div>
          </div>
          <div className="bg-surface p-4 rounded-lg border">
            <div className="text-2xl font-bold text-accent">{stats.hasPhone}</div>
            <div className="text-caption text-text-secondary">With Phone</div>
          </div>
          <div className="bg-surface p-4 rounded-lg border">
            <div className="text-2xl font-bold text-accent">{stats.hasEmail}</div>
            <div className="text-caption text-text-secondary">With Email</div>
          </div>
          <div className="bg-surface p-4 rounded-lg border">
            <div className="text-2xl font-bold text-text-secondary">{stats.recentlyAdded}</div>
            <div className="text-caption text-text-secondary">Added This Week</div>
          </div>
        </div>
      )}

      {/* Test Results */}
      {testResults && (
        <div className={`p-4 rounded-lg border ${
          testResults.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {testResults.success ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <X className="w-5 h-5 text-red-600" />
            )}
            <h3 className="font-semibold">
              {testResults.success ? 'Test Completed' : 'Test Failed'}
            </h3>
          </div>
          <p className="text-sm text-text-secondary">
            {testResults.message || testResults.error}
          </p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Add Contact Form */}
      {showAddForm && (
        <div className="bg-surface border rounded-lg p-6">
          <h3 className="text-heading2 text-text-primary mb-4">
            {editingContact ? 'Edit Contact' : 'Add Emergency Contact'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-caption text-text-primary mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    formErrors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="John Doe"
                />
                {formErrors.name && (
                  <p className="text-sm text-red-600 mt-1">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-caption text-text-primary mb-2">
                  Relationship *
                </label>
                <select
                  value={formData.relationship}
                  onChange={(e) => handleInputChange('relationship', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    formErrors.relationship ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select relationship</option>
                  <option value="Family">Family</option>
                  <option value="Friend">Friend</option>
                  <option value="Partner">Partner</option>
                  <option value="Lawyer">Lawyer</option>
                  <option value="Other">Other</option>
                </select>
                {formErrors.relationship && (
                  <p className="text-sm text-red-600 mt-1">{formErrors.relationship}</p>
                )}
              </div>

              <div>
                <label className="block text-caption text-text-primary mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    formErrors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="+1 (555) 123-4567"
                />
                {formErrors.phone && (
                  <p className="text-sm text-red-600 mt-1">{formErrors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-caption text-text-primary mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    formErrors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="john@example.com"
                />
                {formErrors.email && (
                  <p className="text-sm text-red-600 mt-1">{formErrors.email}</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <CTAButton
                type="submit"
                variant="primary"
                disabled={loading}
              >
                {editingContact ? 'Update Contact' : 'Add Contact'}
              </CTAButton>
              <CTAButton
                type="button"
                variant="secondary"
                onClick={cancelForm}
              >
                Cancel
              </CTAButton>
            </div>
          </form>
        </div>
      )}

      {/* Contacts List */}
      {hasContacts ? (
        <div className="space-y-3">
          {contacts.map((contact) => (
            <div key={contact.id} className="bg-surface border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">{contact.name}</h3>
                    <p className="text-caption text-text-secondary">{contact.relationship}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(contact)}
                    className="px-3 py-1 text-sm text-primary hover:bg-primary/10 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-text-secondary">
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {contact.phoneFormatted}
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {contact.email}
                </div>
              </div>
              
              <div className="mt-2 text-xs text-text-secondary">
                Added {contact.addedAgo}
                {contact.updatedAgo && ` • Updated ${contact.updatedAgo}`}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-text-secondary mx-auto mb-4" />
          <h3 className="text-heading2 text-text-primary mb-2">No Emergency Contacts</h3>
          <p className="text-body text-text-secondary mb-6 max-w-md mx-auto">
            Add trusted contacts who will be notified automatically during police interactions.
          </p>
        </div>
      )}

      {/* Add Contact Button */}
      {!showAddForm && (
        <CTAButton
          variant="primary"
          onClick={() => setShowAddForm(true)}
          className="w-full flex items-center justify-center gap-2"
          disabled={contacts.length >= 2 && !onPremiumFeature()}
        >
          <Plus className="w-5 h-5" />
          Add Emergency Contact
          {contacts.length >= 2 && (
            <span className="text-xs bg-accent text-white px-2 py-1 rounded ml-2">
              Premium
            </span>
          )}
        </CTAButton>
      )}

      {/* Premium Feature Notice */}
      {contacts.length >= 2 && (
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-accent" />
            <p className="text-sm text-accent">
              <strong>Premium Feature:</strong> Add unlimited emergency contacts and test alerts with a premium subscription.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default EmergencyContacts
