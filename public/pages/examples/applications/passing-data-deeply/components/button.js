class ButtonComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="${new URL('../index.css', import.meta.url)}">
            <button>
                <slot></slot>
            </button>
        `;
        const themeContext = this.closest('x-theme-context');
        themeContext.addEventListener('themechange', () => this.update());
        this.shadowRoot.querySelector('button').addEventListener('click', 
            () => themeContext.toggleTheme());
        this.update();
    }

    update() {
        const button = this.shadowRoot.querySelector('button');
        if (button) button.className = 'button-' + this.closest('x-theme-context').theme;
    }
}

export const registerButtonComponent = 
    () => customElements.define('x-button', ButtonComponent);
