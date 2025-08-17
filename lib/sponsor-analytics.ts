'use client'

interface SponsorEvent {
  sponsorId: string
  sponsorName: string
  eventType: 'view' | 'click' | 'close' | 'conversion'
  timestamp: number
  userAddress?: string
  nftTransactionId?: string
  metadata?: Record<string, any>
}

class SponsorAnalytics {
  private events: SponsorEvent[] = []
  private sessionId: string

  constructor() {
    this.sessionId = this.generateSessionId()
    this.loadStoredEvents()
  }

  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  private loadStoredEvents() {
    try {
      const stored = localStorage.getItem('sponsor_events')
      if (stored) {
        this.events = JSON.parse(stored)
      }
    } catch (error) {
      console.warn('Failed to load stored sponsor events:', error)
    }
  }

  private saveEvents() {
    try {
      // Keep only last 100 events to prevent storage bloat
      const recentEvents = this.events.slice(-100)
      localStorage.setItem('sponsor_events', JSON.stringify(recentEvents))
    } catch (error) {
      console.warn('Failed to save sponsor events:', error)
    }
  }

  trackSponsorView(sponsorId: string, sponsorName: string, userAddress?: string) {
    const event: SponsorEvent = {
      sponsorId,
      sponsorName,
      eventType: 'view',
      timestamp: Date.now(),
      userAddress,
      metadata: {
        sessionId: this.sessionId,
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      }
    }

    this.events.push(event)
    this.saveEvents()
    
    console.log('📊 Sponsor View:', sponsorName)
    this.sendToAnalytics(event)
  }

  trackSponsorClick(sponsorId: string, sponsorName: string, userAddress?: string, nftTransactionId?: string) {
    const event: SponsorEvent = {
      sponsorId,
      sponsorName,
      eventType: 'click',
      timestamp: Date.now(),
      userAddress,
      nftTransactionId,
      metadata: {
        sessionId: this.sessionId,
        referrer: document.referrer,
        clickTime: new Date().toISOString()
      }
    }

    this.events.push(event)
    this.saveEvents()
    
    console.log('🎯 Sponsor Click:', sponsorName)
    this.sendToAnalytics(event)
  }

  trackSponsorClose(sponsorId: string, sponsorName: string, timeSpent: number) {
    const event: SponsorEvent = {
      sponsorId,
      sponsorName,
      eventType: 'close',
      timestamp: Date.now(),
      metadata: {
        sessionId: this.sessionId,
        timeSpent,
        dismissalReason: 'user_close'
      }
    }

    this.events.push(event)
    this.saveEvents()
    
    console.log('❌ Sponsor Close:', sponsorName, `(${timeSpent}ms)`)
    this.sendToAnalytics(event)
  }

  trackSponsorConversion(sponsorId: string, sponsorName: string, conversionType: string) {
    const event: SponsorEvent = {
      sponsorId,
      sponsorName,
      eventType: 'conversion',
      timestamp: Date.now(),
      metadata: {
        sessionId: this.sessionId,
        conversionType,
        conversionTime: new Date().toISOString()
      }
    }

    this.events.push(event)
    this.saveEvents()
    
    console.log('💰 Sponsor Conversion:', sponsorName, conversionType)
    this.sendToAnalytics(event)
  }

  private async sendToAnalytics(event: SponsorEvent) {
    // In production, send to your analytics service
    try {
      // Example: Send to Google Analytics, Mixpanel, or custom analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', 'sponsor_interaction', {
          sponsor_id: event.sponsorId,
          sponsor_name: event.sponsorName,
          event_type: event.eventType,
          session_id: this.sessionId
        })
      }

      // Example: Send to custom analytics endpoint
      /*
      await fetch('/api/analytics/sponsor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      })
      */
    } catch (error) {
      console.warn('Failed to send sponsor analytics:', error)
    }
  }

  getAnalyticsSummary() {
    const summary = {
      totalEvents: this.events.length,
      uniqueSponsors: new Set(this.events.map(e => e.sponsorId)).size,
      eventsByType: {} as Record<string, number>,
      topSponsors: {} as Record<string, number>,
      conversionRate: 0
    }

    this.events.forEach(event => {
      // Count by event type
      summary.eventsByType[event.eventType] = (summary.eventsByType[event.eventType] || 0) + 1
      
      // Count by sponsor
      summary.topSponsors[event.sponsorName] = (summary.topSponsors[event.sponsorName] || 0) + 1
    })

    // Calculate conversion rate
    const views = summary.eventsByType.view || 0
    const conversions = summary.eventsByType.conversion || 0
    summary.conversionRate = views > 0 ? (conversions / views) * 100 : 0

    return summary
  }

  // Get events for a specific sponsor
  getSponsorEvents(sponsorId: string): SponsorEvent[] {
    return this.events.filter(event => event.sponsorId === sponsorId)
  }

  // Clear old events (privacy-friendly)
  clearOldEvents(daysOld: number = 30) {
    const cutoffTime = Date.now() - (daysOld * 24 * 60 * 60 * 1000)
    this.events = this.events.filter(event => event.timestamp > cutoffTime)
    this.saveEvents()
  }
}

// Export singleton instance
export const sponsorAnalytics = new SponsorAnalytics()

// Export types for use in components
export type { SponsorEvent }