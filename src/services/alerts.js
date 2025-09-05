import { AIService } from './openai.js'
import { DatabaseService } from './supabase.js'

export class AlertService {
  // Send emergency alert to contacts
  static async sendEmergencyAlert(incidentData, emergencyContacts) {
    const results = []
    
    for (const contact of emergencyContacts) {
      try {
        // Generate personalized alert message
        const messageResult = await AIService.generateAlertMessage(incidentData, contact.name)
        
        if (!messageResult.success) {
          throw new Error('Failed to generate alert message')
        }

        const alertMessage = messageResult.data

        // Send via multiple channels
        const alertResults = await Promise.allSettled([
          this.sendSMSAlert(contact.phone, alertMessage, incidentData),
          this.sendEmailAlert(contact.email, alertMessage, incidentData),
          this.sendPushNotification(contact, alertMessage, incidentData)
        ])

        results.push({
          contact: contact.name,
          phone: contact.phone,
          email: contact.email,
          sms: alertResults[0],
          email: alertResults[1],
          push: alertResults[2],
          message: alertMessage
        })

      } catch (error) {
        console.error(`Error sending alert to ${contact.name}:`, error)
        results.push({
          contact: contact.name,
          error: error.message
        })
      }
    }

    // Log alert activity
    await this.logAlertActivity(incidentData.incidentId, results)

    return {
      success: true,
      results,
      totalContacts: emergencyContacts.length,
      successfulAlerts: results.filter(r => !r.error).length
    }
  }

  // Send SMS alert (mock implementation - would use Twilio/similar in production)
  static async sendSMSAlert(phoneNumber, message, incidentData) {
    try {
      // Mock SMS service - in production, use Twilio, AWS SNS, etc.
      const smsData = {
        to: phoneNumber,
        body: `🚨 EMERGENCY ALERT 🚨\n${message}\n\nLocation: ${incidentData.location}\nTime: ${new Date(incidentData.timestamp).toLocaleString()}\n\nThis is an automated alert from RightGuard AI.`,
        from: '+1234567890' // Your Twilio number
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // In production:
      // const response = await twilioClient.messages.create(smsData)
      
      console.log('SMS Alert sent:', smsData)
      
      return {
        success: true,
        messageId: 'sms_' + Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('SMS Alert failed:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Send email alert (mock implementation)
  static async sendEmailAlert(email, message, incidentData) {
    try {
      const emailData = {
        to: email,
        subject: '🚨 Emergency Alert - Police Interaction in Progress',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #dc2626; color: white; padding: 20px; text-align: center;">
              <h1>🚨 EMERGENCY ALERT</h1>
            </div>
            <div style="padding: 20px; background: #f9fafb;">
              <p><strong>Alert Message:</strong></p>
              <p style="background: white; padding: 15px; border-left: 4px solid #dc2626;">${message}</p>
              
              <h3>Incident Details:</h3>
              <ul>
                <li><strong>Location:</strong> ${incidentData.location}</li>
                <li><strong>Time:</strong> ${new Date(incidentData.timestamp).toLocaleString()}</li>
                <li><strong>Status:</strong> Police interaction in progress</li>
              </ul>
              
              <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p><strong>What you can do:</strong></p>
                <ul>
                  <li>Be aware of the situation</li>
                  <li>Consider monitoring the location if safe to do so</li>
                  <li>Be available for contact</li>
                  <li>Document this alert for reference</li>
                </ul>
              </div>
              
              <p style="font-size: 12px; color: #6b7280; margin-top: 30px;">
                This is an automated alert from RightGuard AI. If this is a false alarm, please disregard.
              </p>
            </div>
          </div>
        `
      }

      // Simulate email service
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // In production, use SendGrid, AWS SES, etc.
      console.log('Email Alert sent:', emailData)
      
      return {
        success: true,
        messageId: 'email_' + Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Email Alert failed:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Send push notification (mock implementation)
  static async sendPushNotification(contact, message, incidentData) {
    try {
      // Mock push notification - in production, use Firebase, OneSignal, etc.
      const pushData = {
        title: '🚨 Emergency Alert',
        body: message,
        data: {
          type: 'emergency_alert',
          incidentId: incidentData.incidentId,
          location: incidentData.location,
          timestamp: incidentData.timestamp
        },
        badge: 1,
        sound: 'emergency.wav'
      }

      // Simulate push service
      await new Promise(resolve => setTimeout(resolve, 200))
      
      console.log('Push Notification sent:', pushData)
      
      return {
        success: true,
        messageId: 'push_' + Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Push Notification failed:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Log alert activity to database
  static async logAlertActivity(incidentId, alertResults) {
    try {
      const logData = {
        incident_id: incidentId,
        alert_timestamp: new Date().toISOString(),
        contacts_notified: alertResults.length,
        successful_alerts: alertResults.filter(r => !r.error).length,
        alert_details: alertResults,
        created_at: new Date().toISOString()
      }

      // In production, save to database
      console.log('Alert activity logged:', logData)
      
      return { success: true, data: logData }
    } catch (error) {
      console.error('Error logging alert activity:', error)
      return { success: false, error: error.message }
    }
  }

  // Test alert system (for user to verify contacts)
  static async sendTestAlert(emergencyContacts, userId) {
    const testMessage = "This is a test alert from RightGuard AI. Your emergency contact is working correctly. No action needed."
    
    const results = []
    
    for (const contact of emergencyContacts) {
      try {
        const testResults = await Promise.allSettled([
          this.sendSMSAlert(contact.phone, testMessage, {
            location: 'Test Location',
            timestamp: new Date().toISOString(),
            incidentId: 'test_' + Date.now()
          }),
          this.sendEmailAlert(contact.email, testMessage, {
            location: 'Test Location',
            timestamp: new Date().toISOString(),
            incidentId: 'test_' + Date.now()
          })
        ])

        results.push({
          contact: contact.name,
          sms: testResults[0],
          email: testResults[1]
        })
      } catch (error) {
        results.push({
          contact: contact.name,
          error: error.message
        })
      }
    }

    return {
      success: true,
      results,
      message: 'Test alerts sent successfully'
    }
  }

  // Get alert history for user
  static async getAlertHistory(userId) {
    try {
      // In production, fetch from database
      const mockHistory = [
        {
          id: 1,
          incident_id: 'inc_123',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          contacts_notified: 3,
          successful_alerts: 3,
          status: 'completed'
        },
        {
          id: 2,
          incident_id: 'inc_124',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          contacts_notified: 2,
          successful_alerts: 1,
          status: 'partial_failure'
        }
      ]

      return {
        success: true,
        data: mockHistory
      }
    } catch (error) {
      console.error('Error fetching alert history:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Cancel ongoing alerts (if possible)
  static async cancelAlerts(incidentId) {
    try {
      // In production, attempt to cancel pending notifications
      console.log(`Attempting to cancel alerts for incident: ${incidentId}`)
      
      // Mock cancellation
      await new Promise(resolve => setTimeout(resolve, 500))
      
      return {
        success: true,
        message: 'Alert cancellation attempted',
        cancelled: Math.floor(Math.random() * 3) // Mock number of cancelled alerts
      }
    } catch (error) {
      console.error('Error cancelling alerts:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
}

// Utility functions for alert management
export const alertUtils = {
  // Validate phone number format
  validatePhoneNumber(phone) {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
    return phoneRegex.test(phone)
  },

  // Validate email format
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  // Format phone number for display
  formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
    }
    return phone
  },

  // Get alert priority based on incident type
  getAlertPriority(incidentData) {
    // High priority indicators
    const highPriorityKeywords = ['arrest', 'detained', 'handcuffs', 'weapon', 'force']
    const summary = incidentData.interactionSummary?.toLowerCase() || ''
    
    const hasHighPriorityKeyword = highPriorityKeywords.some(keyword => 
      summary.includes(keyword)
    )

    if (hasHighPriorityKeyword) {
      return 'high'
    }

    // Medium priority for any police interaction
    return 'medium'
  }
}
