import { Suspense } from '../suspense.js';
import { later } from './later.js';

class HelloWorldComponent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <p>Hello world!</p>
            <button id="load">Load</button>
            <button id="error">Load with error</button>
        `;
        const btnLoad = this.querySelector('button#load');
        btnLoad.onclick = () => {
            // simulate loading of data
            Suspense.waitFor(this, later(1000));
        };
        const btnError = this.querySelector('button#error');
        btnError.onclick = () => {
            // simulate loading of data that ends in an error
            Suspense.waitFor(this, later(1000).then(() => { throw new Error('An error, as expected.'); }));
        }
    }
}

export default function register() {
    customElements.define('x-hello-world', HelloWorldComponent);
}
