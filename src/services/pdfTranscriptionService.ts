import { supabase } from '@/integrations/supabase/client';

interface PdfTranscriptionResponse {
  ok: boolean;
  status: number;
  data?: any;
  body?: string;
  error?: string;
}

export const submitPdfTranscription = async (
  file: File,
  extraFields?: Record<string, string>
): Promise<PdfTranscriptionResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    // Add any extra fields if provided
    if (extraFields) {
      Object.entries(extraFields).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const { data, error } = await supabase.functions.invoke('pdf-transcription-proxy', {
      body: formData,
    });

    if (error) {
      console.error('PDF transcription service error:', error);
      return {
        ok: false,
        status: 500,
        error: error.message || 'Service error'
      };
    }

    return data as PdfTranscriptionResponse;
  } catch (error) {
    console.error('PDF transcription submission error:', error);
    return {
      ok: false,
      status: 500,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};