class PanelComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="${new URL('../index.css', import.meta.url)}">
            <section>
                <h1></h1>
                <slot></slot>
            </section>
        `;
        this.closest('x-theme-context').addEventListener('themechange', () => this.update());
        this.update();
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
        const themeContext = this.closest('x-theme-context');
        if (section && h1) {
            section.className = 'panel-' + themeContext.theme;
            h1.textContent = this.getAttribute('title');
        }
    }
}

export const registerPanelComponent = 
    () => customElements.define('x-panel', PanelComponent);
