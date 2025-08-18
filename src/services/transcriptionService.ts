const SUPABASE_PROJECT_URL = "https://jajkfzwzmogpkwzclisv.supabase.co";

interface TranscriptionResponse {
  ok: boolean;
  status: number;
  data?: any;
  body?: string;
  error?: string;
}

export async function submitTranscription(
  file: File, 
  extraFields?: Record<string, string>
): Promise<TranscriptionResponse> {
  try {
    // Create FormData
    const formData = new FormData();
    formData.append('image', file);
    
    // Add any extra fields
    if (extraFields) {
      Object.entries(extraFields).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    console.log('Submitting transcription request...');
    
    const response = await fetch(`${SUPABASE_PROJECT_URL}/functions/v1/transcription-proxy`, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type - let browser set it with boundary for FormData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Transcription result:', result);
    
    return result;
  } catch (error) {
    console.error('Transcription service error:', error);
    return {
      ok: false,
      status: 0,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}