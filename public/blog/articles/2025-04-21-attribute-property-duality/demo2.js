customElements.define('my-hello', class extends HTMLElement {
    connectedCallback() {
        this.textContent = `Hello, ${ this.getAttribute('value') || 'null' }!`;
    }
});
