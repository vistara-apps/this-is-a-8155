import React from 'react'
import { Shield, Mic, FileText, Crown } from 'lucide-react'

const AppShell = ({ children, activeTab, setActiveTab, subscriptionStatus }) => {
  const tabs = [
    { id: 'rights', label: 'Your Rights', icon: Shield },
    { id: 'record', label: 'Record', icon: Mic },
    { id: 'incidents', label: 'Log', icon: FileText }
  ]

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header */}
      <header className="bg-surface shadow-card sticky top-0 z-10">
        <div className="container py-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-heading2 font-bold text-primary">RightGuard AI</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              {subscriptionStatus === 'premium' && (
                <div className="flex items-center space-x-1 bg-accent/10 text-accent px-2 py-1 rounded-md text-caption">
                  <Crown className="h-4 w-4" />
                  <span>Premium</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-surface border-t border-gray-200 sticky bottom-0">
        <div className="container">
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex flex-col items-center py-sm space-y-1 transition-colors duration-200 ${
                    isActive 
                      ? 'text-primary' 
                      : 'text-text-secondary hover:text-primary'
                  }`}
                >
                  <Icon className={`h-6 w-6 ${isActive ? 'text-primary' : 'text-text-secondary'}`} />
                  <span className={`text-caption ${isActive ? 'text-primary font-medium' : 'text-text-secondary'}`}>
                    {tab.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>
    </div>
  )
}

export default AppShell