class BadgeComponent extends HTMLElement {
    #span;

    connectedCallback() {
        if (!this.#span) {
            this.#span = document.createElement('span');
            this.#span.className = 'x-badge-label';                
        }
        this.insertBefore(this.#span, this.firstChild);
        this.update();
    }

    update() {
        if (this.#span) this.#span.textContent = this.getAttribute('content');
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
