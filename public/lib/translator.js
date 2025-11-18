class Translator {
    constructor() {
        this.translations = {};
        this.currentLang = localStorage.getItem('preferredLang') || 'en';
    }

    async loadTranslations(lang) {
        try {
            const response = await fetch(`./locales/${lang}.json`);
            this.translations[lang] = await response.json();
        } catch (error) {
            console.error(`Error loading ${lang} translations:`, error);
        }
    }

    async changeLanguage(lang) {
        if (!this.translations[lang]) {
            await this.loadTranslations(lang);
        }
        
        this.currentLang = lang;
        localStorage.setItem('preferredLang', lang);
        document.documentElement.lang = lang;
        
        this.applyTranslations();
    }

    applyTranslations() {
        const elements = document.querySelectorAll('[data-i18n]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getTranslation(key);
            
            if (translation) {
                if (element.placeholder) {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });
    }

    getTranslation(key) {
        return this.translations[this.currentLang]?.[key] || key;
    }

    async initialize() {
        await this.loadTranslations(this.currentLang);
        this.applyTranslations();
    }
}

const translator = new Translator();

function changeLanguage(lang) {
    translator.changeLanguage(lang);
}

const langSwitch = document.getElementById("languageSwitcher");

langSwitch.addEventListener("change", () => {
    changeLanguage(langSwitch.value);
});

document.addEventListener('DOMContentLoaded', () => {
    translator.initialize();
});
