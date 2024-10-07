customElements.define('theme-context', class extends HTMLElement {
    themeProvider = new ContextProvider(this, 'theme', 'light');
    toggleProvider = new ContextProvider(this, 'theme-toggle', () => {
        this.themeProvider.value = this.themeProvider.value === 'light' ? 'dark' : 'light';
    });
    connectedCallback() {
        this.style.display = 'contents';
    }
});
