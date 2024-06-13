import i18n from 'i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import {initReactI18next} from 'react-i18next'

const options = {
    order: ['localStorage', 'htmlTag'],
    lookupQuerystring: 'lng',
    lookupCookie: 'i18next',
    lookupLocalStorage: 'i18nextLng',
    lookupSessionStorage: 'i18nextLng',
    lookupFromPathIndex: 0,
    lookupFromSubdomainIndex: 0,
    caches: ['localStorage', 'cookie'],
    cookieMinutes: 10,
    cookieDomain: 'myDomain',
    htmlTag: document.documentElement,
    cookieOptions: {path: '/', sameSite: 'strict'}
}

i18n.use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        detection: options,
        backend: {
            loadPath: '/assets/i18n/{{ns}}/{{lng}}.json'
        },
        fallbackLng: 'lot',
        debug: false,
        ns: ['common'],
        interpolation: {
            escapeValue: false
        }
    })

export default i18n