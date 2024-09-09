export class ErrorBoundary extends HTMLElement {

    static showError(sender, error) {
        if (!error) throw new Error('ErrorBoundary.showError: expected two arguments but got one');
        const boundary = sender.closest('x-error-boundary');
        if (boundary) {
            boundary.error = error;
        } else {
            console.error('unable to find x-error-boundary to show error');
            console.error(error);
        }
    }

    #error;
    #errorSlot;
    #contentSlot;

    get error() {
        return this.#error;
    }

    set error(error) {
        if (!this.#errorSlot) return;
        this.#error = error;
        this.#errorSlot.style.display = error ? 'contents' : 'none';
        this.#contentSlot.style.display = !error ? 'contents' : 'none';
        if (error) {
            this.#errorSlot.assignedElements().forEach(element => {
                if (Object.hasOwn(element, 'error')) {
                    element.error = error;
                } else {
                    element.setAttribute('error', error?.message || error);
                }
            });
            this.dispatchEvent(new CustomEvent('error', { detail: error }));
        }
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.#errorSlot = document.createElement('slot');
        this.#errorSlot.style.display = 'none';
        this.#errorSlot.name = 'error';
        // default error message
        this.#errorSlot.textContent = 'Something went wrong.';
        this.#contentSlot = document.createElement('slot');
        this.shadowRoot.append(this.#errorSlot, this.#contentSlot);
    }

    reset() {
        this.error = null;
    }

    connectedCallback() {
        this.style.display = 'contents';
    }
}
customElements.define('x-error-boundary', ErrorBoundary);
