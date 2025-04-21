customElements.define('my-hello', class extends HTMLElement {
    get value() {
        return this.getAttribute('value');
    }
    set value(v) {
        this.setAttribute('value', String(v));
    }

    get glam() {
        return this.hasAttribute('glam');
    }
    set glam(v) {
        if (v) {
            this.setAttribute('glam', 'true');
        } else {
            this.removeAttribute('glam');
        }
    }
    
    static observedAttributes = ['value', 'glam'];
    attributeChangedCallback() {
        this.textContent = 
            `Hello, ${ this.value || 'null' }!` +
            (this.glam ? '!!@#!' : '');
    }
});
