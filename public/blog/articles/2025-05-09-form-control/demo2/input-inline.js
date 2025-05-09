customElements.define('input-inline', class extends HTMLElement {
    
    #internals;

    get value() {
        return this.getAttribute('value') ?? '';
    }
    set value(value) {
        this.setAttribute('value', String(value));
    }

    get name() {
        return this.getAttribute('name') ?? '';
    }
    set name(v) {
        this.setAttribute('name', String(v));
    }

    constructor() {
        super();
        this.#internals = this.attachInternals();
        this.#internals.role = 'textbox';
    }
    
    connectedCallback() {
        this.#update();
    }

    static observedAttributes = ['value'];
    attributeChangedCallback() {
        this.#update();
    }

    #update() {
        this.style.display = 'inline';
        if (this.textContent !== this.value) {
            this.textContent = this.value;
        }
        this.contentEditable = true;
        this.#internals.setFormValue(this.value);
    }

    static formAssociated = true;
});