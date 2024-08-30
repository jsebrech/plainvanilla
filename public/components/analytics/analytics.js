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
        }
    }
}

export const registerAnalyticsComponent = () => {
    customElements.define('x-analytics', AnalyticsComponent);
}