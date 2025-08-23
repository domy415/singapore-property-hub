'use client'

import { useEffect, useState } from 'react'
import SidebarWidget from './SidebarWidget'
import InArticleForm from './InArticleForm'
import ExitIntentPopup from './ExitIntentPopup'

interface FormPositionManagerProps {
  // Sidebar Widget Settings
  enableSidebar?: boolean
  sidebarDelay?: number
  
  // In-Article Form Settings  
  enableInArticle?: boolean
  articleScrollThreshold?: number
  inArticleTitle?: string
  inArticleSubtitle?: string
  
  // Exit Intent Settings
  enableExitIntent?: boolean
  
  // Global Settings
  className?: string
}

export default function FormPositionManager({
  enableSidebar = true,
  sidebarDelay = 10000,
  enableInArticle = true,
  articleScrollThreshold = 0.3,
  inArticleTitle,
  inArticleSubtitle,
  enableExitIntent = true,
  className = ""
}: FormPositionManagerProps) {
  const [isClient, setIsClient] = useState(false)

  // Ensure components only render on client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <div className={className}>
      {/* Sidebar Widget - Desktop Only */}
      {enableSidebar && (
        <SidebarWidget delayMs={sidebarDelay} />
      )}

      {/* In-Article Form - Shows after scroll threshold */}
      {enableInArticle && (
        <InArticleForm 
          scrollThreshold={articleScrollThreshold}
          title={inArticleTitle}
          subtitle={inArticleSubtitle}
        />
      )}

      {/* Exit Intent Popup - Shows on mouse leave */}
      {enableExitIntent && (
        <ExitIntentPopup />
      )}
    </div>
  )
}