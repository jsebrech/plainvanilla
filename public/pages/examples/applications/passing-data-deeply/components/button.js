import { ContextRequestEvent } from "../lib/tiny-context.js";

class ButtonComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    #theme = 'light';
    #unsubscribe;

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="${new URL('../index.css', import.meta.url)}">
            <button>
                <slot></slot>
            </button>
        `;
        this.dispatchEvent(new ContextRequestEvent('theme', (theme, unsubscribe) => {
            this.#theme = theme;
            this.#unsubscribe = unsubscribe;
            this.update();
        }, true));
        this.dispatchEvent(new ContextRequestEvent('theme-toggle', (toggle) => {
            this.shadowRoot.querySelector('button').onclick = toggle;
        }));
        this.update();
    }

    disconnectedCallback() {
        this.#unsubscribe?.();
    }

    update() {
        const button = this.shadowRoot.querySelector('button');
        if (button) button.className = 'button-' + this.#theme;
    }
}

export const registerButtonComponent = 
    () => customElements.define('x-button', ButtonComponent);
