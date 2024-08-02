class Counter extends HTMLElement {
    #count = 0;

    increment() {
        this.#count++;
        this.update();
    }

    connectedCallback() {
        this.update();
    }

    update() {
        this.textContent = this.#count;
    }
}

export const registerCounterComponent =
    () => customElements.define('x-counter', Counter);
