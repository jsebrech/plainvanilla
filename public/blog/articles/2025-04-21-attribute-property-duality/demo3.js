customElements.define('my-hello', class extends HTMLElement {
    get value() {
        return this.getAttribute('value');
    }
    set value(v) {
        this.setAttribute('value', String(v));
    }
    
    static observedAttributes = ['value'];
    attributeChangedCallback() {
        this.textContent = `Hello, ${ this.value || 'null' }!`;
    }
});
