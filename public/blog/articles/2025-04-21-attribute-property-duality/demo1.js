customElements.define('my-hello', class extends HTMLElement {
    connectedCallback() {
        this.textContent = `Hello, ${ this.value || 'null' }!`;
    }
});
