customElements.define('x-lazy', class extends HTMLElement {
    connectedCallback() {
        this.style.display = 'contents';
        this.#loadLazy();
    }

    #loadLazy() {
        const elements = 
            [...this.children].filter(_ => _.localName.includes('-'));
        const unregistered = 
            elements.filter(_ => !customElements.get(_.localName));
        unregistered.forEach(_ => this.#loadElement(_));
    }

    #loadElement(element) {
        // TODO: load the custom element
    }
});
