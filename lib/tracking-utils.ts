/**
 * Comprehensive tracking utilities for lead capture
 * Captures Facebook, Google, TikTok, LinkedIn, and UTM parameters
 */

export interface TrackingData {
  // Facebook Pixel
  fbclid: string | null
  fbp: string | null
  fbc: string | null
  
  // UTM Parameters
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_content: string | null
  utm_term: string | null
  
  // Ad Platform IDs
  ad_id: string | null
  adset_id: string | null
  campaign_id: string | null
  
  // Google Ads
  gclid: string | null
  
  // TikTok
  ttclid: string | null
  
  // LinkedIn
  li_fat_id: string | null
  
  // Session tracking
  browser_id: string
  session_id: string
  gtm_event_id: string | null  // GTM {{JS - Event ID}} - written by GTM
  
  // Additional context
  landing_page: string | null
  referrer: string | null
  user_agent: string | null
  timestamp: string
}

/**
 * Get a cookie value by name
 */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null
  }
  return null
}

/**
 * Get URL parameter from current URL or stored value
 */
function getUrlParam(param: string): string | null {
  if (typeof window === 'undefined') return null
  
  // First check current URL
  const urlParams = new URLSearchParams(window.location.search)
  const currentValue = urlParams.get(param)
  if (currentValue) {
    // Store for later (in case user navigates)
    try {
      sessionStorage.setItem(`_track_${param}`, currentValue)
    } catch {
      // Ignore storage errors
    }
    return currentValue
  }
  
  // Check sessionStorage for previously captured value
  try {
    return sessionStorage.getItem(`_track_${param}`)
  } catch {
    return null
  }
}

/**
 * Generate a unique browser ID (persisted in localStorage)
 */
function getBrowserId(): string {
  if (typeof window === 'undefined') return 'server'
  
  try {
    let browserId = localStorage.getItem('_browser_id')
    if (!browserId) {
      browserId = 'bid_' + crypto.randomUUID()
      localStorage.setItem('_browser_id', browserId)
    }
    return browserId
  } catch {
    return 'bid_' + Math.random().toString(36).substring(2, 15)
  }
}

/**
 * Generate a session ID (persisted in sessionStorage)
 */
function getSessionId(): string {
  if (typeof window === 'undefined') return 'server'
  
  try {
    let sessionId = sessionStorage.getItem('_session_id')
    if (!sessionId) {
      sessionId = 'sid_' + crypto.randomUUID()
      sessionStorage.setItem('_session_id', sessionId)
    }
    return sessionId
  } catch {
    return 'sid_' + Math.random().toString(36).substring(2, 15)
  }
}

/**
 * Get Facebook _fbp cookie (browser ID)
 */
function getFbp(): string | null {
  return getCookie('_fbp')
}

/**
 * Get Facebook _fbc cookie (click ID) or construct from fbclid
 */
function getFbc(): string | null {
  const fbc = getCookie('_fbc')
  if (fbc) return fbc
  
  // Construct from fbclid if available
  const fbclid = getUrlParam('fbclid')
  if (fbclid && typeof window !== 'undefined') {
    const timestamp = Math.floor(Date.now() / 1000)
    return `fb.1.${timestamp}.${fbclid}`
  }
  return null
}

/**
 * Get Google Analytics client ID from _ga cookie
 */
function getGaClientId(): string | null {
  const ga = getCookie('_ga')
  if (ga) {
    // _ga cookie format: GA1.2.XXXXXXXX.XXXXXXXX
    const parts = ga.split('.')
    if (parts.length >= 4) {
      return `${parts[2]}.${parts[3]}`
    }
  }
  return null
}

/**
 * Get GTM Event ID from hidden field or dataLayer
 * GTM writes this value via {{JS - Event ID}} variable
 */
function getGtmEventId(): string | null {
  if (typeof window === 'undefined') return null
  
  // First check hidden field (GTM writes here)
  const hiddenField = document.getElementById('gtm_event_id') as HTMLInputElement | null
  if (hiddenField?.value) {
    return hiddenField.value
  }
  
  // Fallback: check dataLayer for event_id
  const dataLayer = (window as unknown as { dataLayer?: Array<Record<string, unknown>> }).dataLayer
  if (dataLayer && Array.isArray(dataLayer)) {
    // Find the most recent event_id in dataLayer
    for (let i = dataLayer.length - 1; i >= 0; i--) {
      const entry = dataLayer[i]
      if (entry && typeof entry === 'object' && 'event_id' in entry) {
        return String(entry.event_id)
      }
    }
  }
  
  // Fallback: check sessionStorage (GTM can also store there)
  try {
    return sessionStorage.getItem('gtm_event_id')
  } catch {
    return null
  }
}

/**
 * Set GTM Event ID - can be called by GTM via custom HTML tag
 */
export function setGtmEventId(eventId: string): void {
  if (typeof window === 'undefined') return
  
  // Set in hidden field
  const hiddenField = document.getElementById('gtm_event_id') as HTMLInputElement | null
  if (hiddenField) {
    hiddenField.value = eventId
  }
  
  // Also store in sessionStorage as backup
  try {
    sessionStorage.setItem('gtm_event_id', eventId)
  } catch {
    // Ignore storage errors
  }
}

// Expose setGtmEventId globally for GTM to call
if (typeof window !== 'undefined') {
  (window as unknown as { setGtmEventId?: typeof setGtmEventId }).setGtmEventId = setGtmEventId
}

/**
 * Capture the landing page URL on first visit
 */
function getLandingPage(): string | null {
  if (typeof window === 'undefined') return null
  
  try {
    let landingPage = sessionStorage.getItem('_landing_page')
    if (!landingPage) {
      landingPage = window.location.href
      sessionStorage.setItem('_landing_page', landingPage)
    }
    return landingPage
  } catch {
    return window.location.href
  }
}

/**
 * Capture the referrer on first visit
 */
function getReferrer(): string | null {
  if (typeof document === 'undefined') return null
  
  try {
    let referrer = sessionStorage.getItem('_referrer')
    if (!referrer && document.referrer) {
      referrer = document.referrer
      sessionStorage.setItem('_referrer', referrer)
    }
    return referrer
  } catch {
    return document.referrer || null
  }
}

/**
 * Collect all tracking data in one call
 * Call this once when the modal opens to capture everything
 */
export function collectTrackingData(): TrackingData {
  return {
    // Facebook
    fbclid: getUrlParam('fbclid'),
    fbp: getFbp(),
    fbc: getFbc(),
    
    // UTM Parameters
    utm_source: getUrlParam('utm_source'),
    utm_medium: getUrlParam('utm_medium'),
    utm_campaign: getUrlParam('utm_campaign'),
    utm_content: getUrlParam('utm_content'),
    utm_term: getUrlParam('utm_term'),
    
    // Ad Platform IDs
    ad_id: getUrlParam('ad_id'),
    adset_id: getUrlParam('adset_id'),
    campaign_id: getUrlParam('campaign_id'),
    
    // Google Ads
    gclid: getUrlParam('gclid'),
    
    // TikTok
    ttclid: getUrlParam('ttclid'),
    
    // LinkedIn
    li_fat_id: getUrlParam('li_fat_id') || getCookie('li_fat_id'),
    
    // Session tracking
    browser_id: getBrowserId(),
    session_id: getSessionId(),
    gtm_event_id: getGtmEventId(),
    
    // Additional context
    landing_page: getLandingPage(),
    referrer: getReferrer(),
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    timestamp: new Date().toISOString(),
  }
}

/**
 * Initialize tracking on page load
 * Call this in _app.tsx or layout.tsx to capture landing page data immediately
 */
export function initializeTracking(): void {
  if (typeof window === 'undefined') return
  
  // Capture all URL params on page load
  const params = ['fbclid', 'gclid', 'ttclid', 'li_fat_id', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'ad_id', 'adset_id', 'campaign_id']
  params.forEach(param => getUrlParam(param))
  
  // Initialize browser and session IDs
  getBrowserId()
  getSessionId()
  
  // Capture landing page and referrer
  getLandingPage()
  getReferrer()
}

/**
 * Get GA client ID for enhanced conversions
 */
export function getGoogleAnalyticsClientId(): string | null {
  return getGaClientId()
}
