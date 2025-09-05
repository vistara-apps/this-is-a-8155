import React, { useState, useRef } from 'react'
import { Mic, MicOff, Video, VideoOff, MapPin, Users, AlertTriangle } from 'lucide-react'
import CTAButton from './CTAButton'

const RecordingInterface = ({ onIncidentLogged, onPremiumFeature, location, requestLocation }) => {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingType, setRecordingType] = useState('audio')
  const [alertSent, setAlertSent] = useState(false)
  const [incidentDetails, setIncidentDetails] = useState({
    officerDetails: '',
    summary: '',
    location: ''
  })
  
  const mediaRecorderRef = useRef(null)
  const streamRef = useRef(null)

  const startRecording = async () => {
    try {
      const constraints = recordingType === 'video' 
        ? { video: true, audio: true }
        : { audio: true }
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream
      
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      
      mediaRecorder.start()
      setIsRecording(true)
      
      // Auto-send alert if premium user
      if (onPremiumFeature()) {
        sendEmergencyAlert()
      }
    } catch (error) {
      console.error('Failed to start recording:', error)
      alert('Unable to access camera/microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && streamRef.current) {
      mediaRecorderRef.current.stop()
      streamRef.current.getTracks().forEach(track => track.stop())
      setIsRecording(false)
    }
  }

  const sendEmergencyAlert = () => {
    if (!onPremiumFeature()) return
    
    // Mock emergency alert
    setAlertSent(true)
    setTimeout(() => setAlertSent(false), 5000)
  }

  const logIncident = () => {
    const incident = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      location: location ? `${location.latitude}, ${location.longitude}` : incidentDetails.location,
      officerDetails: incidentDetails.officerDetails,
      interactionSummary: incidentDetails.summary,
      recordingUrl: null,
      alertSent
    }
    
    onIncidentLogged(incident)
    
    // Reset form
    setIncidentDetails({
      officerDetails: '',
      summary: '',
      location: ''
    })
    
    alert('Incident logged successfully')
  }

  return (
    <div className="container py-lg space-y-lg">
      {/* Emergency Recording */}
      <div className="space-y-md">
        <h1 className="text-heading1">Record Interaction</h1>
        
        <div className="card bg-danger/5 border border-danger/20">
          <div className="flex items-center space-x-3 mb-md">
            <AlertTriangle className="h-6 w-6 text-danger" />
            <h3 className="text-heading2 text-danger">Quick Record</h3>
          </div>
          
          <div className="space-y-md">
            <div className="flex space-x-md">
              <button
                onClick={() => setRecordingType('audio')}
                className={`flex-1 py-2 px-4 rounded-lg border ${
                  recordingType === 'audio' 
                    ? 'bg-primary text-white border-primary' 
                    : 'bg-surface border-gray-200'
                }`}
              >
                Audio Only
              </button>
              <button
                onClick={() => setRecordingType('video')}
                className={`flex-1 py-2 px-4 rounded-lg border ${
                  recordingType === 'video' 
                    ? 'bg-primary text-white border-primary' 
                    : 'bg-surface border-gray-200'
                }`}
              >
                Video + Audio
              </button>
            </div>
            
            <CTAButton
              variant={isRecording ? 'danger' : 'primary'}
              onClick={isRecording ? stopRecording : startRecording}
              className="w-full"
            >
              {isRecording ? (
                <>
                  {recordingType === 'video' ? <VideoOff className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
                  Stop Recording
                </>
              ) : (
                <>
                  {recordingType === 'video' ? <Video className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                  Start Recording
                </>
              )}
            </CTAButton>
            
            {isRecording && (
              <div className="flex items-center justify-center space-x-2 text-danger animate-pulse">
                <div className="w-3 h-3 bg-danger rounded-full"></div>
                <span className="text-caption font-medium">Recording in progress...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Emergency Alert */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-md">
          <Users className="h-6 w-6 text-primary" />
          <h3 className="text-heading2">Emergency Alert</h3>
        </div>
        
        <p className="text-body text-text-secondary mb-md">
          Send your location to trusted contacts immediately.
        </p>
        
        <CTAButton
          variant="secondary"
          onClick={() => {
            if (onPremiumFeature()) {
              sendEmergencyAlert()
            }
          }}
          className="w-full"
        >
          Send Emergency Alert {!onPremiumFeature() && '(Premium)'}
        </CTAButton>
        
        {alertSent && (
          <div className="mt-md p-3 bg-accent/10 border border-accent/20 rounded-lg">
            <p className="text-caption text-accent font-medium">
              ✓ Alert sent to your emergency contacts
            </p>
          </div>
        )}
      </div>

      {/* Location */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-md">
          <MapPin className="h-6 w-6 text-primary" />
          <h3 className="text-heading2">Location</h3>
        </div>
        
        {location ? (
          <p className="text-body text-accent">
            📍 Location detected: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </p>
        ) : (
          <div className="space-y-md">
            <p className="text-body text-text-secondary">
              Location access helps with emergency alerts and incident logging.
            </p>
            <button
              onClick={requestLocation}
              className="btn-secondary"
            >
              Enable Location Access
            </button>
          </div>
        )}
      </div>

      {/* Incident Logging */}
      <div className="card">
        <h3 className="text-heading2 mb-md">Log Incident Details</h3>
        
        <div className="space-y-md">
          <div>
            <label className="block text-caption text-text-secondary mb-2">
              Officer Details (Badge #, Name, etc.)
            </label>
            <input
              type="text"
              value={incidentDetails.officerDetails}
              onChange={(e) => setIncidentDetails(prev => ({
                ...prev,
                officerDetails: e.target.value
              }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Badge #123, Officer Smith..."
            />
          </div>
          
          <div>
            <label className="block text-caption text-text-secondary mb-2">
              Interaction Summary
            </label>
            <textarea
              value={incidentDetails.summary}
              onChange={(e) => setIncidentDetails(prev => ({
                ...prev,
                summary: e.target.value
              }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Brief description of what happened..."
            />
          </div>
          
          {!location && (
            <div>
              <label className="block text-caption text-text-secondary mb-2">
                Location (if location access not enabled)
              </label>
              <input
                type="text"
                value={incidentDetails.location}
                onChange={(e) => setIncidentDetails(prev => ({
                  ...prev,
                  location: e.target.value
                }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Street address or general area..."
              />
            </div>
          )}
          
          <CTAButton
            variant="primary"
            onClick={logIncident}
            className="w-full"
            disabled={!incidentDetails.summary.trim()}
          >
            Save Incident Log
          </CTAButton>
        </div>
      </div>
    </div>
  )
}

export default RecordingInterface