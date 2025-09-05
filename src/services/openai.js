import OpenAI from 'openai'
import { config } from '../config/env.js'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: config.openai.apiKey,
  dangerouslyAllowBrowser: true // Note: In production, API calls should go through your backend
})

export class AIService {
  // Generate state-specific rights scripts
  static async generateRightsScript(stateCode, language = 'en') {
    try {
      const prompt = `Generate a comprehensive but concise guide for police interactions in ${stateCode} state. 
      Include:
      1. Key rights citizens have during police stops
      2. What TO say during interactions (specific phrases)
      3. What NOT to say during interactions
      4. Important state-specific laws or procedures
      
      Format the response as JSON with the following structure:
      {
        "keyRights": ["right1", "right2", ...],
        "whatToSay": ["phrase1", "phrase2", ...],
        "whatNotToSay": ["phrase1", "phrase2", ...],
        "stateSpecific": ["law1", "law2", ...]
      }
      
      Language: ${language}
      Keep responses practical and legally accurate.`

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a legal expert specializing in civil rights and police interaction law. Provide accurate, practical advice for citizens."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })

      const content = completion.choices[0].message.content
      return {
        success: true,
        data: JSON.parse(content)
      }
    } catch (error) {
      console.error('Error generating rights script:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Generate shareable incident summary
  static async generateIncidentSummary(incidentData, userRights) {
    try {
      const prompt = `Create a concise, shareable summary of a police interaction incident.
      
      Incident Details:
      - Date/Time: ${incidentData.timestamp}
      - Location: ${incidentData.location}
      - Officer Details: ${JSON.stringify(incidentData.officerDetails)}
      - Summary: ${incidentData.interactionSummary}
      
      User Rights Context:
      ${JSON.stringify(userRights)}
      
      Generate a professional summary that:
      1. States the key facts objectively
      2. Highlights any rights that may have been relevant
      3. Is suitable for sharing with legal counsel or support networks
      4. Maintains privacy while being informative
      
      Keep it under 200 words and format for easy sharing.`

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a legal documentation assistant. Create objective, factual summaries of police interactions that protect user privacy while providing essential information."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 300
      })

      return {
        success: true,
        data: completion.choices[0].message.content
      }
    } catch (error) {
      console.error('Error generating incident summary:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Translate text to specified language
  static async translateText(text, targetLanguage) {
    try {
      const prompt = `Translate the following text to ${targetLanguage}. 
      Maintain the legal accuracy and tone. If it's legal advice or rights information, 
      ensure the translation is precise and culturally appropriate.
      
      Text to translate: "${text}"`

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a professional legal translator. Provide accurate translations that maintain legal precision and cultural appropriateness."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 500
      })

      return {
        success: true,
        data: completion.choices[0].message.content
      }
    } catch (error) {
      console.error('Error translating text:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Generate emergency alert message
  static async generateAlertMessage(incidentData, contactName) {
    try {
      const prompt = `Generate a concise emergency alert message for ${contactName}.
      
      Situation:
      - Location: ${incidentData.location}
      - Time: ${incidentData.timestamp}
      - Context: Police interaction in progress
      
      Create a message that:
      1. Clearly states this is an emergency alert
      2. Provides location and time
      3. Requests the contact to be aware of the situation
      4. Is professional but urgent
      5. Includes a request to monitor the situation
      
      Keep it under 160 characters for SMS compatibility.`

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an emergency communication assistant. Create clear, urgent but professional alert messages."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 100
      })

      return {
        success: true,
        data: completion.choices[0].message.content
      }
    } catch (error) {
      console.error('Error generating alert message:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Analyze incident for potential legal concerns
  static async analyzeIncident(incidentData) {
    try {
      const prompt = `Analyze this police interaction incident for potential legal concerns or rights violations.
      
      Incident Details:
      - Location: ${incidentData.location}
      - Officer Details: ${JSON.stringify(incidentData.officerDetails)}
      - Summary: ${incidentData.interactionSummary}
      - Recording Available: ${incidentData.recordingUrl ? 'Yes' : 'No'}
      
      Provide:
      1. Potential legal concerns (if any)
      2. Rights that may have been relevant
      3. Recommended next steps
      4. Documentation suggestions
      
      Be objective and educational. Format as JSON:
      {
        "concerns": ["concern1", "concern2", ...],
        "relevantRights": ["right1", "right2", ...],
        "recommendations": ["rec1", "rec2", ...],
        "documentationNeeds": ["doc1", "doc2", ...]
      }`

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a civil rights legal analyst. Provide educational analysis of police interactions, focusing on rights and proper procedures."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 600
      })

      const content = completion.choices[0].message.content
      return {
        success: true,
        data: JSON.parse(content)
      }
    } catch (error) {
      console.error('Error analyzing incident:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
}

// Utility function to check if OpenAI is properly configured
export const validateOpenAI = () => {
  return !!config.openai.apiKey && config.openai.apiKey !== 'your-openai-key'
}

// Rate limiting helper (simple implementation)
class RateLimiter {
  constructor(maxRequests = 10, windowMs = 60000) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
    this.requests = []
  }

  canMakeRequest() {
    const now = Date.now()
    this.requests = this.requests.filter(time => now - time < this.windowMs)
    
    if (this.requests.length >= this.maxRequests) {
      return false
    }
    
    this.requests.push(now)
    return true
  }

  getTimeUntilReset() {
    if (this.requests.length === 0) return 0
    const oldestRequest = Math.min(...this.requests)
    return Math.max(0, this.windowMs - (Date.now() - oldestRequest))
  }
}

export const aiRateLimiter = new RateLimiter(10, 60000) // 10 requests per minute
