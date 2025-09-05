import React from 'react'
import { CheckCircle, AlertTriangle } from 'lucide-react'

const GuidelineCard = ({ title, content, variant = 'default' }) => {
  const isHighlighted = variant === 'highlighted'
  
  return (
    <div className={`card ${isHighlighted ? 'bg-accent/5 border border-accent/20' : ''}`}>
      <div className="flex items-start space-x-3">
        {isHighlighted ? (
          <CheckCircle className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
        ) : (
          <AlertTriangle className="h-6 w-6 text-text-secondary flex-shrink-0 mt-1" />
        )}
        <div className="flex-1">
          <h3 className="text-heading2 mb-sm">{title}</h3>
          <div className="text-body text-text-secondary whitespace-pre-line">
            {content}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuidelineCard