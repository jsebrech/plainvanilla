let VALUE_MISSING_MESSAGE = 'Please fill out this field.';
(() => {
    const input = document.createElement('input');
    input.required = true;
    input.reportValidity();
    VALUE_MISSING_MESSAGE = input.validationMessage;
})();

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

customElements.define('input-inline', class extends HTMLElement {
    
    #shouldFireChange = false;
    #internals;
    #formDisabled = false;
    #value;
    #customValidityMessage = '';

    set value(v) {
        if (this.#value !== String(v)) {
            this.#value = String(v);
            this.#update();    
        }
    }
    get value() {
        return this.#value ?? this.defaultValue;
    }

    get defaultValue() {
        return this.getAttribute('value') ?? '';
    }
    set defaultValue(value) {
        this.setAttribute('value', String(value));
    }

    set disabled(v) {
        if (v) {
            this.setAttribute('disabled', 'true');
        } else {
            this.removeAttribute('disabled');
        }
    }
    get disabled() {
        return this.hasAttribute('disabled');
    }

    set readOnly(v) {
        if (v) {
            this.setAttribute('readonly', 'true');
        } else {
            this.removeAttribute('readonly');
        }
    }
    get readOnly() {
        return this.hasAttribute('readonly');
    }

    get name() {
        return this.getAttribute('name') ?? '';
    }
    set name(v) {
        this.setAttribute('name', String(v));
    }

    set required(v) {
        if (v) {
            this.setAttribute('required', 'true');
        } else {
            this.removeAttribute('required');
        }
    }
    get required() {
        return this.hasAttribute('required');
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

    static observedAttributes = ['value', 'disabled', 'readonly', 'required'];
    attributeChangedCallback() {
        this.#update();
    }

    #update() {
        this.style.display = 'inline';
        if (cleanTextContent(this.textContent) !== this.value) {
            this.textContent = this.value;
        }
        this.#internals.setFormValue(this.value);

        const isDisabled = this.#formDisabled || this.disabled;
        this.#internals.ariaDisabled = isDisabled;
        this.#internals.ariaReadOnly = this.readOnly;
        this.contentEditable = !this.readOnly && !isDisabled && 'plaintext-only';
        this.tabIndex = isDisabled ? -1 : 0;

        const length = cleanTextContent(this.textContent).length || 0;
        this.style.setProperty('--current-length', `${length}ch`);

        this.#internals.ariaRequired = this.required;
        this.#updateValidity();
    }

    static formAssociated = true;

    formResetCallback() {
        this.#value = undefined;
        this.#update();
    }
    
    formDisabledCallback(disabled) {
        this.#formDisabled = disabled;
        this.#update();
    }
    
    formStateRestoreCallback(state) {
        this.#value = state ?? undefined;
        this.#update();
    }

    #updateValidity() {
        const state = {};
        let message = '';

        // custom validity message overrides all else
        if (this.#customValidityMessage) {
            state.customError = true;
            message = this.#customValidityMessage;
        } else {
            if (this.required && !this.value) {
                state.valueMissing = true;
                message = VALUE_MISSING_MESSAGE;
            }
    
            // add other checks here if needed (e.g., pattern, minLength)
        }

        // safari needs a focusable validation anchor to show the validation message on form submit
        // and it must be a descendant of the input
        let anchor = undefined;
        if (isSafari) {
            anchor = this.querySelector('span[aria-hidden]');
            if (!anchor) {
                anchor = document.createElement('span');
                anchor.ariaHidden = true;
                anchor.tabIndex = 0;
                this.append(anchor);
            }
        }

        this.#internals.setValidity(state, message, anchor);
    }

    checkValidity() {
        this.#updateValidity();
        return this.#internals.checkValidity();
    }

    reportValidity() {
        this.#updateValidity();
        return this.#internals.reportValidity();
    }

    setCustomValidity(message) {
        this.#customValidityMessage = message ?? '';
        this.#updateValidity();
    }

    get validity() {
        return this.#internals.validity;
    }

    get validationMessage() {
        return this.#internals.validationMessage;
    }

    get willValidate() {
        return this.#internals.willValidate;
    }
});

function cleanTextContent(text) {
    return (text ?? '')
        // replace newlines and tabs with spaces
        .replace(/[\n\r\t]+/g, ' ')
        // remove zero width spaces
        .replace(/\u200B/g, '');
}
