import React from 'react'
import { X, Check, Crown } from 'lucide-react'

const SubscriptionModal = ({ onClose, onSubscribe }) => {
  const features = [
    'Multi-language support',
    'Real-time emergency alerts',
    'Unlimited incident logging',
    'Shareable incident summaries',
    'Priority customer support',
    'Encrypted cloud backup'
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-xl shadow-modal max-w-md w-full max-h-screen overflow-y-auto">
        <div className="p-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-lg">
            <div className="flex items-center space-x-2">
              <Crown className="h-6 w-6 text-primary" />
              <h2 className="text-heading1">RightGuard Premium</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Pricing */}
          <div className="text-center mb-lg">
            <div className="text-display text-primary">$5</div>
            <div className="text-body text-text-secondary">per month</div>
          </div>

          {/* Features */}
          <div className="space-y-md mb-lg">
            <h3 className="text-heading2">Premium Features</h3>
            <div className="space-y-sm">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-accent flex-shrink-0" />
                  <span className="text-body">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-md">
            <button
              onClick={onSubscribe}
              className="btn-primary w-full"
            >
              Start Premium Subscription
            </button>
            <button
              onClick={onClose}
              className="btn-secondary w-full"
            >
              Maybe Later
            </button>
          </div>

          {/* Footer */}
          <div className="text-center mt-lg">
            <p className="text-caption text-text-secondary">
              Cancel anytime. Your safety is our priority.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionModal