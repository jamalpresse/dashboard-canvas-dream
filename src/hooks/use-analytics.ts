
import { supabase } from "@/integrations/supabase/client";
import { useCallback } from "react";

type EventType = "page_view" | "article_view" | "search" | "translation" | "improve";

export const useAnalytics = () => {
  const trackEvent = useCallback(async (eventType: EventType, eventData?: any) => {
    try {
      const { error } = await supabase.functions.invoke('track-analytics', {
        body: { eventType, eventData },
      });
      
      if (error) {
        console.error('Error tracking analytics:', error);
      }
    } catch (err) {
      console.error('Failed to track analytics event:', err);
    }
  }, []);
  
  return { trackEvent };
};
