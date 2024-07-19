import { dayjs, webVitals } from '../lib/imports.js';

class MetricsComponent extends HTMLElement {
    #now = dayjs();
    #ttfb;
    #interval;

    connectedCallback() {
        webVitals.onTTFB(_ => this.#ttfb = Math.round(_.value));
        this.#interval = setInterval(() => this.update(), 500);
    }

    disconnectedCallback() {
        clearInterval(this.#interval);
        this.#interval = null;
    }

    update() {
        this.innerHTML = `
            <p>Page loaded ${this.#now.fromNow()}, TTFB ${this.#ttfb} milliseconds</p>
        `;
    }
}

export const registerMetricsComponent = () => {
    customElements.define('x-metrics', MetricsComponent);
}