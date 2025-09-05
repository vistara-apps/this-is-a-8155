import React, { useState } from 'react'
import { MapPin, Globe, Lock, ChevronDown } from 'lucide-react'
import GuidelineCard from './GuidelineCard'
import { stateGuidelines } from '../data/stateGuidelines'

const RightsGuide = ({ userState, setUserState, onPremiumFeature }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [showStateSelector, setShowStateSelector] = useState(false)
  
  const guidelines = stateGuidelines[userState] || stateGuidelines['CA']
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' }
  ]

  const handleLanguageChange = (langCode) => {
    if (langCode !== 'en' && !onPremiumFeature()) {
      return
    }
    setSelectedLanguage(langCode)
  }

  const states = [
    'CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI'
  ]

  return (
    <div className="container py-lg space-y-lg">
      {/* Location & Language Selection */}
      <div className="space-y-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-md">
          <div className="relative">
            <button
              onClick={() => setShowStateSelector(!showStateSelector)}
              className="flex items-center space-x-2 bg-surface px-md py-sm rounded-lg shadow-card border border-gray-200"
            >
              <MapPin className="h-5 w-5 text-primary" />
              <span className="text-body">{userState}</span>
              <ChevronDown className="h-4 w-4 text-text-secondary" />
            </button>
            
            {showStateSelector && (
              <div className="absolute top-full mt-1 bg-surface rounded-lg shadow-modal border border-gray-200 z-20 min-w-full">
                {states.map((state) => (
                  <button
                    key={state}
                    onClick={() => {
                      setUserState(state)
                      setShowStateSelector(false)
                    }}
                    className="block w-full text-left px-md py-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {state}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-text-secondary" />
            <select
              value={selectedLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-surface border border-gray-200 rounded-lg px-3 py-2 text-body focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} {lang.code !== 'en' && '(Premium)'}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Emergency Alert */}
      <div className="bg-danger/10 border border-danger/20 rounded-lg p-md">
        <h3 className="text-heading2 text-danger mb-sm">Emergency Situations</h3>
        <p className="text-body text-danger/80">
          If you feel unsafe, call 911. This app is for guidance only and does not replace legal counsel.
        </p>
      </div>

      {/* Your Basic Rights */}
      <div className="space-y-md">
        <h2 className="text-heading1">Your Basic Rights in {userState}</h2>
        <div className="grid gap-md">
          {guidelines.keyRights.map((right, index) => (
            <GuidelineCard
              key={index}
              title={`Right ${index + 1}`}
              content={right}
              variant="default"
            />
          ))}
        </div>
      </div>

      {/* What to Say */}
      <div className="space-y-md">
        <h2 className="text-heading1">What to Say</h2>
        <GuidelineCard
          title="Recommended Phrases"
          content={selectedLanguage === 'en' ? guidelines.whatToSay : guidelines.languages?.[selectedLanguage]?.whatToSay || guidelines.whatToSay}
          variant="highlighted"
        />
      </div>

      {/* What NOT to Say */}
      <div className="space-y-md">
        <h2 className="text-heading1">What NOT to Say</h2>
        <GuidelineCard
          title="Avoid These Phrases"
          content={selectedLanguage === 'en' ? guidelines.doNotSay : guidelines.languages?.[selectedLanguage]?.doNotSay || guidelines.doNotSay}
          variant="default"
        />
      </div>

      {/* Premium Features Teaser */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-md">
        <div className="flex items-start space-x-3">
          <Lock className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-heading2 text-primary mb-sm">Premium Features</h3>
            <ul className="text-body text-text-secondary space-y-1">
              <li>• Multi-language support</li>
              <li>• Real-time emergency alerts</li>
              <li>• Unlimited incident logging</li>
              <li>• Advanced legal resources</li>
            </ul>
            <button
              onClick={onPremiumFeature}
              className="btn-primary mt-md"
            >
              Upgrade to Premium - $5/month
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RightsGuide