const template = document.createElement('template');
template.innerHTML = `
    <link rel="stylesheet" href="${new URL('badge.css', import.meta.url)}">
    <slot></slot>
    <span></span>
`;

class BadgeComponent extends HTMLElement {
    constructor() {
        super();
        if (!this.shadowRoot) {
            this.attachShadow({ mode: 'open' });
            this.shadowRoot.append(template.content.cloneNode(true));
        }
        this.update();
    }

    update() {
        this.shadowRoot.querySelector('span').innerText = this.getAttribute('content');
    }

    static get observedAttributes() {
        return ['content'];
    }

    attributeChangedCallback() {
        this.update();
    }

    set content(value) {
        if (this.getAttribute('content') !== value) {
            this.setAttribute('content', value);
        }
    }

    get content() {
        return this.getAttribute('content');
    }
}

export const registerBadgeComponent = () => customElements.define('x-badge', BadgeComponent);
