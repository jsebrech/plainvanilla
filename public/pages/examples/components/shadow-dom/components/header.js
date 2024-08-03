const template = document.createElement('template');
template.innerHTML = `
    <link rel="stylesheet" href="${new URL('header.css', import.meta.url)}">
    <header>
        <h1></h1>
        <slot></slot>
    </header>
`;

class HeaderComponent extends HTMLElement {
    constructor() {
        super();
        if (!this.shadowRoot) {
            this.attachShadow({ mode: 'open' });
            this.shadowRoot.append(template.content.cloneNode(true));
        }
        this.update();
    }

    update() {
        this.shadowRoot.querySelector('h1').textContent = this.getAttribute('title');
    }

    static get observedAttributes() {
        return ['title'];
    }

    attributeChangedCallback() {
        this.update();
    }
}

export const registerHeaderComponent = () => customElements.define('x-header', HeaderComponent);
