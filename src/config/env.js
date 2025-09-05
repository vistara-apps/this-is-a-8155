// Environment configuration for RightGuard AI
export const config = {
  // Supabase configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'
  },
  
  // OpenAI configuration
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'your-openai-key'
  },
  
  // Stripe configuration
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your-key'
  },
  
  // App configuration
  app: {
    name: 'RightGuard AI',
    version: '1.0.0',
    environment: import.meta.env.MODE || 'development'
  }
}

// Validation function to check if required environment variables are set
export const validateConfig = () => {
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_OPENAI_API_KEY',
    'VITE_STRIPE_PUBLISHABLE_KEY'
  ]
  
  const missing = requiredVars.filter(varName => !import.meta.env[varName])
  
  if (missing.length > 0 && import.meta.env.MODE === 'production') {
    console.warn('Missing required environment variables:', missing)
  }
  
  return missing.length === 0
}
