import { ContextRequestEvent } from "./context-request.js";
import "./theme-provider.js"; // global provider on body
import "./theme-context.js"; // element with local provider

customElements.define('theme-demo', class extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <theme-panel id="first">
                <theme-toggle></theme-toggle>
            </theme-panel>
            <theme-context>
                <theme-panel id="second">
                </theme-panel>
            </theme-context>
            <button>Reparent toggle</button>
        `;
        this.querySelector('button').onclick = reparent;
    }
});

customElements.define('theme-panel', class extends HTMLElement {
    #unsubscribe;

    connectedCallback() {
        this.dispatchEvent(new ContextRequestEvent('theme', (theme, unsubscribe) => {
            this.className = 'panel-' + theme;
            this.#unsubscribe = unsubscribe;
        }, true));
    }

    disconnectedCallback() {
        this.#unsubscribe?.();
    }
});

customElements.define('theme-toggle', class extends HTMLElement {
    #unsubscribe;

    connectedCallback() {
        this.innerHTML = '<button>Toggle</button>';
        this.dispatchEvent(new ContextRequestEvent('theme-toggle', (toggle) => {
            this.querySelector('button').onclick = toggle;
        }));
        this.dispatchEvent(new ContextRequestEvent('theme', (theme, unsubscribe) => {
            this.querySelector('button').className = 'button-' + theme;
            this.#unsubscribe = unsubscribe;
        }, true));
    }

    disconnectedCallback() {
        this.#unsubscribe?.();
    }
});

function reparent() {
    const toggle = document.querySelector('theme-toggle');
    const first = document.querySelector('theme-panel#first');
    const second = document.querySelector('theme-panel#second');
    if (toggle.parentNode === second) {
        first.append(toggle);
    } else {
        second.append(toggle);
    }
}