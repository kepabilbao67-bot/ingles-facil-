import type { LanguageCode } from '@/types/learning';

export interface LanguageOption {
  readonly code: LanguageCode;
  readonly label: string;
  readonly flag: string;
}

export const LANGUAGE_OPTIONS: readonly LanguageOption[] = [
  { code: 'en', label: 'Inglés', flag: '🇬🇧' },
  { code: 'fr', label: 'Francés', flag: '🇫🇷' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'de', label: 'Alemán', flag: '🇩🇪' },
  { code: 'pt', label: 'Portugués', flag: '🇵🇹' },
] as const;

const LANGUAGE_NAMES: Readonly<Record<LanguageCode, string>> = {
  en: 'inglés',
  es: 'español',
  fr: 'francés',
  it: 'italiano',
  de: 'alemán',
  pt: 'portugués',
};

const SPEECH_LOCALES: Readonly<Record<LanguageCode, string>> = {
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  it: 'it-IT',
  de: 'de-DE',
  pt: 'pt-PT',
};

export function getLanguageName(code: LanguageCode): string {
  return LANGUAGE_NAMES[code];
}

export function getSpeechLocale(code: LanguageCode): string {
  return SPEECH_LOCALES[code];
}
