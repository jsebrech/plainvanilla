customElements.define('input-inline', class extends HTMLElement {
    
    #shouldFireChange = false;
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
        // add event listeners
        this.addEventListener('input', this);
        this.addEventListener('keydown', this);
        this.addEventListener('paste', this);
        this.addEventListener('focusout', this);
    }

    handleEvent(e) {
        switch (e.type) {
            // respond to user input (typing, drag-and-drop, paste)
            case 'input':
                this.value = cleanTextContent(this.textContent);
                this.#shouldFireChange = true;
                break;
            // enter key should submit form instead of adding a new line
            case 'keydown':
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.#internals.form?.requestSubmit();
                }
                break;
            // prevent pasting rich text (firefox), or newlines (all browsers)
            case 'paste':
                e.preventDefault();
                const text = e.clipboardData.getData('text/plain')
                    // replace newlines and tabs with spaces
                    .replace(/[\n\r\t]+/g, ' ')
                    // limit length of pasted text to something reasonable
                    .substring(0, 1000);
                // shadowRoot.getSelection is non-standard, fallback to document in firefox
                // https://stackoverflow.com/a/70523247
                let selection = this.getRootNode()?.getSelection?.() || document.getSelection();
                let range = selection.getRangeAt(0);
                range.deleteContents();
                range.insertNode(document.createTextNode(text));
                // manually trigger input event to restore default behavior
                this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
                break;
            // fire change event on blur
            case 'focusout':
                if (this.#shouldFireChange) {
                    this.#shouldFireChange = false;
                    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
                }
                break;
        }
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
        if (cleanTextContent(this.textContent) !== this.value) {
            this.textContent = this.value;
        }
        this.contentEditable = true;
        this.#internals.setFormValue(this.value);
    }

    static formAssociated = true;
});

function cleanTextContent(text) {
    return (text ?? '')
        // replace newlines and tabs with spaces
        .replace(/[\n\r\t]+/g, ' ')
        // remove zero width spaces
        .replace(/\u200B/g, '');
}
