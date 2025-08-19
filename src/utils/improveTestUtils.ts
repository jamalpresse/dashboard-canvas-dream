/**
 * Test utilities for the Improve functionality
 * Use these in browser console for debugging
 */

export const testImproveEndpoint = async () => {
  console.log('🧪 Testing improve-proxy endpoint...');
  
  const testText = "Ceci est un texte de test pour vérifier le fonctionnement du webhook n8n.";
  
  try {
    // Test direct API call
    const response = await fetch('/api/supabase/functions/improve-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: testText })
    });
    
    const data = await response.json();
    console.log('✅ Raw response:', data);
    console.log('🔧 Debug version:', data.debugVersion || 'unknown');
    
    if (data.attemptedUrls) {
      console.log('📊 Attempts made:');
      data.attemptedUrls.forEach((attempt: any, i: number) => {
        console.log(`  ${i + 1}. ${attempt.method} ${attempt.url} -> ${attempt.status}`);
      });
    }
    
    console.log('🎯 Method used:', data.attemptUsed || 'none');
    
    return data;
  } catch (error) {
    console.error('❌ Test failed:', error);
    return null;
  }
};

export const debugN8nWebhook = () => {
  console.log(`
🔧 N8N Webhook Configuration Checklist:

1. ✅ URL: https://automate.ihata.ma/webhook/d2e6c8f7-13aa-4bf7-b714-7f32cf5b0fe5
2. ✅ Method: POST  
3. ✅ Headers: Content-Type: application/json
4. ✅ Body example: {"text": "your text here"}

Expected Response Format:
{
  "rewrittenText": "Improved text...",
  "seoTitles": ["Title 1", "Title 2"],
  "keywords": ["tag1", "tag2"],
  "hashtags": ["#hash1", "#hash2"],
  "shortTitle": "Short version"
}

🚀 Test in browser console:
import { testImproveEndpoint } from '/src/utils/improveTestUtils.ts'
testImproveEndpoint()
  `);
};

// Make functions available globally for console testing
if (typeof window !== 'undefined') {
  (window as any).testImproveEndpoint = testImproveEndpoint;
  (window as any).debugN8nWebhook = debugN8nWebhook;
}