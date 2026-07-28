import { computed, Injectable, signal } from '@angular/core';

import { STORAGE_KEYS } from '../constants/storage-keys';
import { LanguageCode, LANGUAGE_CODES } from './language.model';
import { TextKey } from './text-keys';
import { TRANSLATIONS } from './translations';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly languageState = signal<LanguageCode>(this.readLanguage());

  readonly currentLanguage = this.languageState.asReadonly();
  readonly isSpanish = computed(() => this.currentLanguage() === 'es');

  setLanguage(language: LanguageCode): void {
    this.languageState.set(language);
    localStorage.setItem(STORAGE_KEYS.language, language);
    document.documentElement.lang = language;
  }

  translate(key: TextKey): string {
    return TRANSLATIONS[this.currentLanguage()][key];
  }

  private readLanguage(): LanguageCode {
    const storedLanguage = localStorage.getItem(STORAGE_KEYS.language);
    const language = LANGUAGE_CODES.find((item) => item === storedLanguage) ?? 'es';

    document.documentElement.lang = language;

    return language;
  }
}
