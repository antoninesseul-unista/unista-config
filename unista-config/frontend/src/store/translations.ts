import { ref } from "vue";

export interface TranslationRow {
  id: string;
  fr: string;
  en: string;
  de: string;
  es: string;
  it: string;
  res1: string;
  res2: string;
}

/**
 * Global state for translations.
 */
export const translationsState = ref<TranslationRow[]>([]);

// Note: You can keep the huge `rawTranslations` string and the `parseTranslations`
// function here to initialize defaults if the disk save is empty.
