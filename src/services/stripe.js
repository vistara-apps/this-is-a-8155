import { loadStripe } from '@stripe/stripe-js'
import { config } from '../config/env.js'

// Initialize Stripe
let stripePromise
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(config.stripe.publishableKey)
  }
  return stripePromise
}

export class PaymentService {
  // Create subscription checkout session
  static async createSubscriptionCheckout(userId, priceId = 'price_rightguard_premium') {
    try {
      // In a real app, this would call your backend API
      // For demo purposes, we'll simulate the flow
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          priceId,
          mode: 'subscription',
          successUrl: `${window.location.origin}/subscription-success`,
          cancelUrl: `${window.location.origin}/subscription-cancelled`
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { sessionId } = await response.json()
      
      const stripe = await getStripe()
      const { error } = await stripe.redirectToCheckout({ sessionId })
      
      if (error) {
        throw error
      }

      return { success: true }
    } catch (error) {
      console.error('Error creating subscription checkout:', error)
      return { success: false, error: error.message }
    }
  }

  // Create one-time payment for state guide
  static async createStateGuidePayment(userId, stateCode, amount = 299) {
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          amount, // in cents
          currency: 'usd',
          description: `State Guide for ${stateCode}`,
          metadata: {
            type: 'state_guide',
            stateCode,
            userId
          }
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create payment intent')
      }

      const { clientSecret } = await response.json()
      
      return { 
        success: true, 
        clientSecret,
        amount: amount / 100 // Convert back to dollars for display
      }
    } catch (error) {
      console.error('Error creating state guide payment:', error)
      return { success: false, error: error.message }
    }
  }

  // Confirm payment with Stripe Elements
  static async confirmPayment(clientSecret, paymentMethod) {
    try {
      const stripe = await getStripe()
      
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod
      })

      if (error) {
        throw error
      }

      return { 
        success: true, 
        paymentIntent,
        status: paymentIntent.status
      }
    } catch (error) {
      console.error('Error confirming payment:', error)
      return { success: false, error: error.message }
    }
  }

  // Get subscription status
  static async getSubscriptionStatus(userId) {
    try {
      const response = await fetch(`/api/subscription-status/${userId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch subscription status')
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error('Error fetching subscription status:', error)
      return { success: false, error: error.message }
    }
  }

  // Cancel subscription
  static async cancelSubscription(subscriptionId) {
    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId })
      })

      if (!response.ok) {
        throw new Error('Failed to cancel subscription')
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error('Error cancelling subscription:', error)
      return { success: false, error: error.message }
    }
  }

  // Update payment method
  static async updatePaymentMethod(customerId, paymentMethodId) {
    try {
      const response = await fetch('/api/update-payment-method', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          customerId, 
          paymentMethodId 
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update payment method')
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error('Error updating payment method:', error)
      return { success: false, error: error.message }
    }
  }
}

// Pricing configuration
export const PRICING = {
  premium: {
    monthly: {
      priceId: 'price_rightguard_premium_monthly',
      amount: 5.00,
      currency: 'USD',
      interval: 'month'
    },
    yearly: {
      priceId: 'price_rightguard_premium_yearly',
      amount: 50.00,
      currency: 'USD',
      interval: 'year'
    }
  },
  stateGuide: {
    priceId: 'price_rightguard_state_guide',
    amount: 2.99,
    currency: 'USD',
    type: 'one_time'
  },
  alertFeature: {
    priceId: 'price_rightguard_alert_feature',
    amount: 0.99,
    currency: 'USD',
    type: 'per_use'
  }
}

// Feature access control
export const checkFeatureAccess = (subscriptionStatus, feature) => {
  const freeFeatures = [
    'basic_rights_guide',
    'state_selection',
    'basic_recording'
  ]

  const premiumFeatures = [
    'real_time_alerts',
    'unlimited_logging',
    'multi_language_support',
    'ai_summaries',
    'emergency_contacts',
    'advanced_recording'
  ]

  if (freeFeatures.includes(feature)) {
    return true
  }

  if (premiumFeatures.includes(feature)) {
    return subscriptionStatus === 'premium' || subscriptionStatus === 'active'
  }

  return false
}

// Utility function to format currency
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

// Validate Stripe configuration
export const validateStripe = () => {
  return !!config.stripe.publishableKey && 
         config.stripe.publishableKey !== 'pk_test_your-key' &&
         config.stripe.publishableKey.startsWith('pk_')
}

// Mock backend API endpoints for development
// In production, these would be actual backend endpoints
export const mockStripeBackend = {
  async createCheckoutSession(data) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Return mock session ID
    return {
      sessionId: 'cs_test_' + Math.random().toString(36).substr(2, 9)
    }
  },

  async createPaymentIntent(data) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      clientSecret: 'pi_test_' + Math.random().toString(36).substr(2, 9) + '_secret_test'
    }
  },

  async getSubscriptionStatus(userId) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Mock subscription data
    return {
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      cancelAtPeriodEnd: false,
      plan: 'premium_monthly'
    }
  }
}
