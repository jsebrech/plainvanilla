class AnalyticsComponent extends HTMLElement {

    #template;

    constructor() {
        super();
        fetch(new URL('../../analytics.template', import.meta.url))
            .then(res => res.ok && res.text())
            .then(template => {
                this.#template = template;
                this.update();
            })
            .catch(e => console.error(e));
    }

    connectedCallback() {
        this.update();
    }

    update() {
        if (this.isConnected && this.#template) {
            this.innerHTML = this.#template;
            // replace scripts by executable versions
            const scripts = this.getElementsByTagName('script');
            for (const script of scripts) {
                const newScript = document.createElement('script');
                for (const attr of script.attributes) {
                    newScript.setAttribute(attr.name, attr.value);
                }
                newScript.innerHTML = script.innerHTML;
                script.replaceWith(newScript);
            }
        }
    }
}

export const registerAnalyticsComponent = () => {
    customElements.define('x-analytics', AnalyticsComponent);
}