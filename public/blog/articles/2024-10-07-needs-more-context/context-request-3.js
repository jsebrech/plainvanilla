customElements.define('my-component', class extends HTMLElement {
    #unsubscribe;
    connectedCallback() {
        this.dispatchEvent(
            new ContextRequestEvent('theme', (theme, unsubscribe) => {
                this.#unsubscribe = unsubscribe;
                // do something with theme
            }, true)
        );
    }
    disconnectedCallback() {
        this.#unsubscribe?.();
    }
});
