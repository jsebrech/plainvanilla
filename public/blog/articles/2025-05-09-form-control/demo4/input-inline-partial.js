customElements.define('input-inline', class extends HTMLElement {
    
    /* ... */

    #formDisabled = false;
    #value;

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

    /* ... */

    static observedAttributes = ['value', 'disabled', 'readonly'];
    attributeChangedCallback() {
        this.#update();
    }

    #update() {
        this.style.display = 'inline';
        this.textContent = this.value;
        this.#internals.setFormValue(this.value);

        const isDisabled = this.#formDisabled || this.disabled;
        this.#internals.ariaDisabled = isDisabled;
        this.#internals.ariaReadOnly = this.readOnly;
        this.contentEditable = !this.readOnly && !isDisabled && 'plaintext-only';
        this.tabIndex = isDisabled ? -1 : 0;
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
});

/* ... */