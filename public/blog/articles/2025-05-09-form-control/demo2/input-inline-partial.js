customElements.define('input-inline', class extends HTMLElement {
    
    #internals;

    /* ... */

    constructor() {
        super();
        this.#internals = this.attachInternals();
        this.#internals.role = 'textbox';
    }
    
    /* ... */

    #update() {
        /* ... */
        this.#internals.setFormValue(this.value);
    }

    static formAssociated = true;
});