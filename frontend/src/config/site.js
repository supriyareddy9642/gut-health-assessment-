/**
 * Hospital branding – configurable until the client supplies final assets.
 * Name/subtitle taken from the hospital's questionnaire document (confirm with client).
 * To use a real logo: put the file in /frontend/public and set logoUrl, e.g. '/logo.png'.
 */
export const SITE = {
  hospitalName: 'SRI RAMAKRISHNA SPECIALITY HOSPITAL',
  hospitalSubtitle: 'THILLAI NAGAR',
  logoUrl: null, // null => placeholder icon is shown
  siteUrl: import.meta.env.VITE_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : ''),
};
