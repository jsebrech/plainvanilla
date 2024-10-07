customElements.define('my-component', class extends HTMLElement {
    connectedCallback() {
        let theme = 'light';
        this.dispatchEvent(
            new ContextRequestEvent('theme', (t, unsubscribe) => {
                theme = t;
                unsubscribe?.();
            })
        );
        // do something with theme
    }
});
