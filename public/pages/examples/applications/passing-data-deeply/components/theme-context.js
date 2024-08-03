class ThemeContext extends HTMLElement {

    #theme = 'light';

    get theme() { return this.#theme; }
    set theme(value) { 
        if (this.#theme !== value) {
            this.#theme = value;
            this.dispatchEvent(new CustomEvent('themechange'));
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
    }

    constructor() {
        super();
        this.style.display = 'contents';
    }
}

export const registerThemeContext = 
    () => customElements.define('x-theme-context', ThemeContext);
