import React from 'react'
import { Calendar, MapPin, User, Share2, AlertCircle } from 'lucide-react'

const IncidentLogEntry = ({ incident, onShare, canShare }) => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString()
    }
  }

  const { date, time } = formatDate(incident.timestamp)

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="space-y-md">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <div>
              <div className="text-body font-medium">{date}</div>
              <div className="text-caption text-text-secondary">{time}</div>
            </div>
          </div>
          
          {incident.alertSent && (
            <div className="flex items-center space-x-1 bg-accent/10 text-accent px-2 py-1 rounded-md">
              <AlertCircle className="h-4 w-4" />
              <span className="text-caption">Alert Sent</span>
            </div>
          )}
        </div>

        {/* Location */}
        {incident.location && (
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-text-secondary" />
            <span className="text-body text-text-secondary">{incident.location}</span>
          </div>
        )}

        {/* Officer Details */}
        {incident.officerDetails && (
          <div className="flex items-start space-x-2">
            <User className="h-5 w-5 text-text-secondary mt-0.5" />
            <div>
              <div className="text-caption text-text-secondary">Officer Details</div>
              <div className="text-body">{incident.officerDetails}</div>
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="space-y-1">
          <div className="text-caption text-text-secondary">Summary</div>
          <div className="text-body">{incident.interactionSummary}</div>
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <button
            onClick={onShare}
            disabled={!canShare}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-caption transition-colors ${
              canShare
                ? 'bg-primary text-white hover:opacity-90'
                : 'bg-gray-100 text-text-secondary cursor-not-allowed'
            }`}
          >
            <Share2 className="h-4 w-4" />
            <span>Share Summary {!canShare && '(Premium)'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default IncidentLogEntry