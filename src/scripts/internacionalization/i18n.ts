import { createI18n } from "vue-i18n";
import EN from "./en.json";
import PT from "./pt.json";

const options = {
  locale: localStorage.lang || 'pt',
  fallbackLocale: localStorage.lang || 'pt',
  messages: {
    en: EN,
    pt: PT,
  }
};

const element = createI18n(options);

export default { element, options };