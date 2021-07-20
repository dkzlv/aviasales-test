import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ru from './phrases/ru.json';

export const initI18n = () =>
  i18n.use(initReactI18next).init({
    resources: {
      ru: {
        translation: ru,
      },
    },
    lng: 'ru',
    fallbackLng: 'ru',

    interpolation: {
      escapeValue: false,
    },
  });
