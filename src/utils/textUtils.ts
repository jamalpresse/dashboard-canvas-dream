
export const isRTL = (txt: string = '') => /[\u0600-\u06FF]/.test(txt);
export const dirFrom = (txt: string) => (isRTL(txt) ? 'rtl' : 'ltr');
export const alignFrom = (txt: string) => (isRTL(txt) ? 'text-right' : 'text-left');

export const checkClipboardSupport = () => {
  return !!navigator.clipboard && typeof navigator.clipboard.writeText === 'function';
};

export const formatResponseData = (data: any) => {
  // Handle different response formats
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch (e) {
      return { body: data };
    }
  }
  
  // If it's already an object
  return data;
};
