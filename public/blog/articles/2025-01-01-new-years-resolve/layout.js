class Layout extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="${import.meta.resolve('styles.css')}">
            <section class="dashboard"><slot></slot></section>
        `;
    }
}

export const registerLayoutComponent = 
    () => customElements.define('x-layout', Layout);
