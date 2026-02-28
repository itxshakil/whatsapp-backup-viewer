
// Helper for Google Analytics event tracking
export const trackEvent = (eventName: string, params: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    try {
      (window as any).gtag('event', eventName, params);
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  }
};
