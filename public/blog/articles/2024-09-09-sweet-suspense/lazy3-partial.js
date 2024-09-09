    #loadLazy() {
        const elements = 
            [...this.children].filter(_ => _.localName.includes('-'));
        const unregistered = 
            elements.filter(_ => !customElements.get(_.localName));
        if (unregistered.length) {
            Suspense.waitFor(this, 
                ...unregistered.map(_ => this.#loadElement(_))
            );
        }
    }