    #loadElement(element) {
        // strip leading x- off the name
        const cleanName = element.localName.replace(/^x-/, '').toLowerCase();
        // assume component is in its own folder
        const url = `./components/${cleanName}/${cleanName}.js`;
        // dynamically import, then register if not yet registered
        return import(new URL(url, document.location)).then(module => 
            !customElements.get(element.localName) && module && module.default());
    }