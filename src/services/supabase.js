import { createClient } from '@supabase/supabase-js'
import { config } from '../config/env.js'

// Initialize Supabase client
export const supabase = createClient(config.supabase.url, config.supabase.anonKey)

// Database service for RightGuard AI
export class DatabaseService {
  // User management
  static async createUser(userData) {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{
          user_id: userData.userId,
          subscription_status: userData.subscriptionStatus || 'free',
          preferred_languages: userData.preferredLanguages || ['en'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error creating user:', error)
      return { success: false, error: error.message }
    }
  }

  static async getUser(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error fetching user:', error)
      return { success: false, error: error.message }
    }
  }

  static async updateUserSubscription(userId, subscriptionStatus) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ 
          subscription_status: subscriptionStatus,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error updating subscription:', error)
      return { success: false, error: error.message }
    }
  }

  // Incident management
  static async createIncident(incidentData) {
    try {
      const { data, error } = await supabase
        .from('incidents')
        .insert([{
          incident_id: incidentData.incidentId,
          user_id: incidentData.userId,
          timestamp: incidentData.timestamp,
          location: incidentData.location,
          officer_details: incidentData.officerDetails || {},
          user_account: incidentData.userAccount || '',
          interaction_summary: incidentData.interactionSummary || '',
          recording_url: incidentData.recordingUrl || null,
          alert_sent: incidentData.alertSent || false,
          created_at: new Date().toISOString()
        }])
        .select()
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error creating incident:', error)
      return { success: false, error: error.message }
    }
  }

  static async getUserIncidents(userId) {
    try {
      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error fetching incidents:', error)
      return { success: false, error: error.message }
    }
  }

  static async updateIncident(incidentId, updates) {
    try {
      const { data, error } = await supabase
        .from('incidents')
        .update(updates)
        .eq('incident_id', incidentId)
        .select()
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error updating incident:', error)
      return { success: false, error: error.message }
    }
  }

  // State guidelines management
  static async getStateGuidelines(stateCode) {
    try {
      const { data, error } = await supabase
        .from('state_guidelines')
        .select('*')
        .eq('state_code', stateCode)
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error fetching state guidelines:', error)
      return { success: false, error: error.message }
    }
  }

  static async getAllStateGuidelines() {
    try {
      const { data, error } = await supabase
        .from('state_guidelines')
        .select('*')
        .order('state_code')
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error fetching all state guidelines:', error)
      return { success: false, error: error.message }
    }
  }

  // Emergency contacts management
  static async addEmergencyContact(userId, contactData) {
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .insert([{
          user_id: userId,
          name: contactData.name,
          phone: contactData.phone,
          email: contactData.email,
          relationship: contactData.relationship,
          created_at: new Date().toISOString()
        }])
        .select()
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error adding emergency contact:', error)
      return { success: false, error: error.message }
    }
  }

  static async getUserEmergencyContacts(userId) {
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at')
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error fetching emergency contacts:', error)
      return { success: false, error: error.message }
    }
  }
}

// Authentication helpers
export const auth = {
  async signUp(email, password) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error signing up:', error)
      return { success: false, error: error.message }
    }
  },

  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error signing in:', error)
      return { success: false, error: error.message }
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Error signing out:', error)
      return { success: false, error: error.message }
    }
  },

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return { success: true, user }
    } catch (error) {
      console.error('Error getting current user:', error)
      return { success: false, error: error.message }
    }
  }
}
