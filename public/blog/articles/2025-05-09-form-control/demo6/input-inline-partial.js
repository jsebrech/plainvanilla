let VALUE_MISSING_MESSAGE = 'Please fill out this field.';
(() => {
    const input = document.createElement('input');
    input.required = true;
    input.reportValidity();
    VALUE_MISSING_MESSAGE = input.validationMessage;
})();

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

customElements.define('input-inline', class extends HTMLElement {
    
    /* ... */

    #customValidityMessage = '';

    /* ... */

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

    /* ... */

    static observedAttributes = ['value', 'disabled', 'readonly', 'required'];
    attributeChangedCallback() {
        this.#update();
    }

    #update() {
        /* ... */

        this.#internals.ariaRequired = this.required;
        this.#updateValidity();
    }

    /* ... */

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

/* ... */