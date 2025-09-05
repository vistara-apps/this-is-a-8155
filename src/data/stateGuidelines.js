export const stateGuidelines = {
  CA: {
    stateCode: 'CA',
    guidelineTitle: 'California Police Interaction Rights',
    keyRights: [
      'You have the right to remain silent and not answer questions',
      'You have the right to refuse searches of your person, car, or home',
      'You have the right to leave if you are not under arrest',
      'You have the right to an attorney if arrested',
      'You have the right to record police interactions in public'
    ],
    whatToSay: `• "I am exercising my right to remain silent."
• "I do not consent to any search."
• "Am I free to leave?"
• "I want to speak to an attorney."
• "I am recording this interaction for my safety."`,
    doNotSay: `• Don't argue or resist physically
• Don't say "I know my rights" aggressively
• Don't volunteer information about where you're going/coming from
• Don't consent to searches even if you have nothing to hide
• Don't lie or provide false identification`,
    languages: {
      es: {
        whatToSay: `• "Estoy ejerciendo mi derecho a permanecer en silencio."
• "No doy mi consentimiento para ningún registro."
• "¿Soy libre de irme?"
• "Quiero hablar con un abogado."
• "Estoy grabando esta interacción por mi seguridad."`,
        doNotSay: `• No discuta o se resista físicamente
• No diga "conozco mis derechos" de manera agresiva
• No ofrezca información sobre a dónde va o de dónde viene
• No dé consentimiento para registros aunque no tenga nada que ocultar
• No mienta o proporcione identificación falsa`
      }
    }
  },
  NY: {
    stateCode: 'NY',
    guidelineTitle: 'New York Police Interaction Rights',
    keyRights: [
      'You have the right to remain silent during any police interaction',
      'You can refuse to consent to searches without a warrant',
      'You have the right to ask if you are free to leave',
      'You have the right to legal representation if detained',
      'You can record police interactions in public spaces'
    ],
    whatToSay: `• "I choose to exercise my Fifth Amendment right to remain silent."
• "I do not consent to any search of my person or property."
• "Officer, am I being detained or am I free to go?"
• "I would like to speak with an attorney before answering questions."
• "I am peacefully recording this interaction."`,
    doNotSay: `• Don't physically resist or interfere with police
• Don't make sudden movements or reach for items
• Don't discuss your destination or activities
• Don't consent to vehicle or property searches
• Don't provide false information or fake documents`
  },
  TX: {
    stateCode: 'TX',
    guidelineTitle: 'Texas Police Interaction Rights',
    keyRights: [
      'You have constitutional rights during all police encounters',
      'You can decline to answer questions beyond providing ID when required',
      'You have the right to refuse consent for searches',
      'You can ask if you are under arrest or free to leave',
      'You have the right to record police in public'
    ],
    whatToSay: `• "I am invoking my right to remain silent."
• "I do not give consent for any search."
• "Am I under arrest or am I free to leave?"
• "I want to speak to my lawyer."
• "I am exercising my right to record."`,
    doNotSay: `• Don't escalate the situation with aggressive language
• Don't flee or make sudden movements
• Don't volunteer details about your activities
• Don't agree to searches to "speed things up"
• Don't provide false or misleading information`
  }
}