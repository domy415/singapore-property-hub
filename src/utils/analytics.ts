// Google Analytics utility functions for event tracking

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// Track page views
export const trackPageView = (url: string, title: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      page_path: url,
      page_title: title,
    });
  }
}

// Track lead form submissions
export const trackLeadSubmission = (formType: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'generate_lead', {
      event_category: 'engagement',
      event_label: formType,
      value: 1
    });
  }
}

// Track article views
export const trackArticleView = (articleTitle: string, category: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'view_item', {
      event_category: 'content',
      event_label: 'article_view',
      item_name: articleTitle,
      item_category: category
    });
  }
}

// Track property enquiries
export const trackPropertyEnquiry = (propertyId: string, propertyType: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'view_item', {
      event_category: 'property',
      event_label: 'property_enquiry',
      item_id: propertyId,
      item_category: propertyType
    });
  }
}

// Track newsletter signups
export const trackNewsletterSignup = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'sign_up', {
      event_category: 'engagement',
      event_label: 'newsletter_signup',
      method: 'email'
    });
  }
}

// Track search usage
export const trackSearch = (searchTerm: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'search', {
      event_category: 'engagement',
      search_term: searchTerm
    });
  }
}

// Track outbound clicks
export const trackOutboundClick = (url: string, linkText: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'click', {
      event_category: 'outbound',
      event_label: linkText,
      transport_type: 'beacon',
      event_callback: () => {
        window.open(url, '_blank');
      }
    });
  }
}

// Track file downloads
export const trackDownload = (fileName: string, fileType: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'file_download', {
      event_category: 'engagement',
      event_label: fileName,
      file_extension: fileType
    });
  }
}