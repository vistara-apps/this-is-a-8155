import React, { useState } from 'react'
import { X, Share2, Copy, Mail, MessageSquare, Download, ExternalLink } from 'lucide-react'
import CTAButton from './CTAButton'

const ShareSheet = ({ isOpen, onClose, content, title = "Incident Summary" }) => {
  const [copied, setCopied] = useState(false)
  const [sharing, setSharing] = useState(false)

  if (!isOpen) return null

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = content
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`${title} - RightGuard AI`)
    const body = encodeURIComponent(content)
    const mailtoUrl = `mailto:?subject=${subject}&body=${body}`
    window.open(mailtoUrl, '_blank')
  }

  const handleSMSShare = () => {
    const body = encodeURIComponent(content)
    const smsUrl = `sms:?body=${body}`
    window.open(smsUrl, '_blank')
  }

  const handleNativeShare = async () => {
    if (!navigator.share) {
      handleCopyToClipboard()
      return
    }

    setSharing(true)
    try {
      await navigator.share({
        title: title,
        text: content,
        url: window.location.href
      })
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error sharing:', error)
        handleCopyToClipboard()
      }
    } finally {
      setSharing(false)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleSocialShare = (platform) => {
    const encodedContent = encodeURIComponent(content)
    const encodedTitle = encodeURIComponent(title)
    const currentUrl = encodeURIComponent(window.location.href)
    
    let shareUrl = ''
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedContent}&url=${currentUrl}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}&quote=${encodedContent}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}&title=${encodedTitle}&summary=${encodedContent}`
        break
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedContent}%20${currentUrl}`
        break
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${currentUrl}&text=${encodedContent}`
        break
      default:
        return
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4">
      <div className="bg-surface rounded-t-xl w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-heading2 text-text-primary">Share {title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {/* Content Preview */}
        <div className="p-4 border-b bg-gray-50 max-h-40 overflow-y-auto">
          <p className="text-sm text-text-secondary whitespace-pre-wrap">
            {content.length > 200 ? `${content.substring(0, 200)}...` : content}
          </p>
        </div>

        {/* Share Options */}
        <div className="p-4 space-y-4">
          {/* Primary Actions */}
          <div className="grid grid-cols-2 gap-3">
            <CTAButton
              variant="primary"
              onClick={handleNativeShare}
              disabled={sharing}
              className="flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              {sharing ? 'Sharing...' : 'Share'}
            </CTAButton>
            
            <CTAButton
              variant="secondary"
              onClick={handleCopyToClipboard}
              className="flex items-center justify-center gap-2"
            >
              <Copy className="w-4 h-4" />
              {copied ? 'Copied!' : 'Copy'}
            </CTAButton>
          </div>

          {/* Communication Apps */}
          <div>
            <h4 className="text-caption text-text-primary mb-3">Send via</h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleEmailShare}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Mail className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium">Email</span>
              </button>
              
              <button
                onClick={handleSMSShare}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <MessageSquare className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">SMS</span>
              </button>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-caption text-text-primary mb-3">Social Media</h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSocialShare('whatsapp')}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">W</span>
                </div>
                <span className="text-sm font-medium">WhatsApp</span>
              </button>
              
              <button
                onClick={() => handleSocialShare('telegram')}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">T</span>
                </div>
                <span className="text-sm font-medium">Telegram</span>
              </button>
              
              <button
                onClick={() => handleSocialShare('twitter')}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-5 h-5 bg-blue-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">X</span>
                </div>
                <span className="text-sm font-medium">Twitter</span>
              </button>
              
              <button
                onClick={() => handleSocialShare('facebook')}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">f</span>
                </div>
                <span className="text-sm font-medium">Facebook</span>
              </button>
            </div>
          </div>

          {/* Other Actions */}
          <div>
            <h4 className="text-caption text-text-primary mb-3">Other Options</h4>
            <div className="space-y-2">
              <button
                onClick={handleDownload}
                className="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-5 h-5 text-text-secondary" />
                <span className="text-sm font-medium">Download as Text File</span>
              </button>
              
              <button
                onClick={() => {
                  const printWindow = window.open('', '_blank')
                  printWindow.document.write(`
                    <html>
                      <head>
                        <title>${title}</title>
                        <style>
                          body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
                          h1 { color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px; }
                          .content { white-space: pre-wrap; }
                          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; }
                        </style>
                      </head>
                      <body>
                        <h1>${title}</h1>
                        <div class="content">${content}</div>
                        <div class="footer">
                          Generated by RightGuard AI on ${new Date().toLocaleDateString()}
                        </div>
                      </body>
                    </html>
                  `)
                  printWindow.document.close()
                  printWindow.print()
                }}
                className="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ExternalLink className="w-5 h-5 text-text-secondary" />
                <span className="text-sm font-medium">Print</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <p className="text-xs text-text-secondary text-center">
            This summary was generated by RightGuard AI to help document your police interaction.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ShareSheet
