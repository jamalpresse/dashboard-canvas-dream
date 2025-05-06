
export const isRTL = (txt: string = '') => /[\u0600-\u06FF]/.test(txt);
export const dirFrom = (txt: string) => (isRTL(txt) ? 'rtl' : 'ltr');
export const alignFrom = (txt: string) => (isRTL(txt) ? 'text-right' : 'text-left');

export const checkClipboardSupport = () => {
  return !!navigator.clipboard && typeof navigator.clipboard.writeText === 'function';
};
