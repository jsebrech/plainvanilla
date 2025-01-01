import { ContextRequestEvent } from "../lib/tiny-context.js";

class PanelComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    #theme = 'light';
    #unsubscribe;

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="${import.meta.resolve('../index.css')}">
            <section>
                <h1></h1>
                <slot></slot>
            </section>
        `;
        this.dispatchEvent(new ContextRequestEvent('theme', (theme, unsubscribe) => {
            this.#theme = theme;
            this.#unsubscribe = unsubscribe;
            this.update();
        }, true));
        this.update();
    }

    disconnectedCallback() {
        this.#unsubscribe?.();
    }

    static get observedAttributes() {
        return ['title'];
    }

    attributeChangedCallback() {
        this.update();
    }

    update() {
        const h1 = this.shadowRoot.querySelector('h1');
        const section = this.shadowRoot.querySelector('section');
        if (section && h1) {
            section.className = 'panel-' + this.#theme;
            h1.textContent = this.getAttribute('title');
        }
    }
}

export const registerPanelComponent = 
    () => customElements.define('x-panel', PanelComponent);
