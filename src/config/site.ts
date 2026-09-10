/**
 * Site-wide facts and link builders. Everything here is a verified fact
 * from the CV or a client decision; copy lives in src/i18n/*.json.
 */
export type Locale = 'en' | 'ar';

export const site = {
  name: 'Aws Dayoub',
  url: 'https://awsdayoub9.github.io',
  email: 'awsdayoub1@gmail.com',
  /** Digits only, no plus sign: used by wa.me */
  phoneDigits: '963983354124',
  phoneDisplay: '+963 983 354 124',
  phoneHref: 'tel:+963983354124',
  linkedin: 'https://www.linkedin.com/in/aws-dayoub-7bba83257',
  linkedinLabel: 'linkedin.com/in/aws-dayoub-7bba83257',
  github: 'https://github.com/AwsDayoub',
  githubLabel: 'github.com/AwsDayoub',
  /** Public path of the CV and its location on disk (for the byte size). */
  cvHref: '/Aws_Dayoub_CV.pdf',
  cvFile: 'public/Aws_Dayoub_CV.pdf',
  /** FormSubmit needs no key; Aws activates it once by clicking the confirmation email. */
  formAction: 'https://formsubmit.co/awsdayoub1@gmail.com',
  /** Availability indicator: Aws owns this flag. Text comes from i18n site.availability.text. */
  availability: { enabled: true },
  /** Search-engine ownership tokens (Google Search Console 'HTML tag' method, Bing Webmaster Tools 'Meta tag'). Empty = no tag emitted. */
  verification: { google: '', bing: '' },
  themeColor: { light: '#F6F5F1', dark: '#0F1215' },
  locales: ['en', 'ar'] as const,
} as const;

export function whatsappLink(prefill: string): string {
  return `https://wa.me/${site.phoneDigits}?text=${encodeURIComponent(prefill)}`;
}

export function mailtoLink(subject: string): string {
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;
}

export function ogImage(locale: Locale): string {
  return `${site.url}/og/${locale}.png`;
}
