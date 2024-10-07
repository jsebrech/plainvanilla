customElements.define('my-component', class extends HTMLElement {
    connectedCallback() {
        let theme = 'light'; // default value
        this.dispatchEvent(
            new ContextRequestEvent('theme', t => theme = t)
        );
        // do something with theme
    }
});
