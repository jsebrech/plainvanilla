export class Suspense extends HTMLElement {
    #fallbackSlot;
    #contentSlot;

    set loading(isLoading) {
        if (!this.#fallbackSlot) return;
        this.#fallbackSlot.style.display = isLoading ? 'contents' : 'none';
        this.#contentSlot.style.display = !isLoading ? 'contents' : 'none';
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.#fallbackSlot = document.createElement('slot');
        this.#fallbackSlot.style.display = 'none';
        this.#fallbackSlot.name = 'fallback';
        this.#contentSlot = document.createElement('slot');
        this.shadowRoot.append(this.#fallbackSlot, this.#contentSlot);
    }

    connectedCallback() {
        this.style.display = 'contents';
    }
}
customElements.define('x-suspense', Suspense);