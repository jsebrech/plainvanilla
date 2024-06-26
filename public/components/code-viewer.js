class CodeViewer extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <label></label>
            <code class="microlight"></code>
        `;
        this.update();
        // load code (and name) from src attribute
        const src = this.getAttribute('src');
        if (src) {
            fetch(src).then(res => res.text()).then(text => {
                this.setAttribute('code', text);
                if (!this.getAttribute('name')) {
                    this.setAttribute('name', src.split('/').pop());
                }
            }).catch((e) => this.setAttribute('code', e.message));
        }
    }

    static get observedAttributes() {
        return ['code', 'name'];
    }

    attributeChangedCallback() {
        this.update();
    }

    update() {
        const label = this.querySelector('label');
        label.textContent = this.getAttribute('name');
        const code = this.querySelector('code');
        code.textContent = this.getAttribute('code');
        // microlight does a poor job with html and css
        const highlight = !/\.(html|css)$/.test(this.getAttribute('name'));
        code.classList.toggle('microlight', highlight);
    }
}

export const registerCodeViewerComponent = 
    () => {
        customElements.define('x-code-viewer', CodeViewer);
        // load microlight if not yet loaded
        if (!document.querySelector('script#microlight')) {
            const script = document.createElement('script');
            script.src = new URL('../lib/microlight/microlight.js', import.meta.url);
            script.id = 'microlight';
            document.head.appendChild(script);
        }
    }
