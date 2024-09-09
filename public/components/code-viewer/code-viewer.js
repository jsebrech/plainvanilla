import { highlightElement } from "../../lib/speed-highlight/index.js";

/**
 * Code Viewer component
 * 
 * Usage:
 * <x-code-viewer src="path/to/code.js"></x-code-viewer> - show code with label "code.js"
 * <x-code-viewer src="path/to/code.js" name="My Code"></x-code-viewer> - show code with label "My Code"
 */
class CodeViewer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <label></label>
            <code></code>
        `;
        // load code (and name) from src attribute
        const src = this.getAttribute('src');
        if (src) {
            if (!this.hasAttribute('name')) {
                this.setAttribute('name', src.split('/').pop());
            }
            this.classList.add('loading');
            fetch(src).then(res => res.text()).then(text => {
                this.setAttribute('code', text);
            }).catch((e) => this.setAttribute('code', e.message))
              .finally(() => this.classList.remove('loading'));
        }
        this.update();
    }

    static get observedAttributes() {
        return ['code', 'name'];
    }

    attributeChangedCallback() {
        this.update();
    }

    update() {
        const label = this.querySelector('label');
        const code = this.querySelector('code');
        if (label && code) {
            label.textContent = this.getAttribute('name');
            code.textContent = this.getAttribute('code');
            // should we syntax highlight?
            const src = this.getAttribute('src') || '';
            const lang = src.split('.').pop();
            if (['html', 'js', 'css'].includes(lang)) {
                code.className = 'shj-lang-' + lang;
            } else {
                code.className = 'shj-lang-plain';
            }
            highlightElement(code);
        }
    }
}

export const registerCodeViewerComponent = 
    () => customElements.define('x-code-viewer', CodeViewer);
