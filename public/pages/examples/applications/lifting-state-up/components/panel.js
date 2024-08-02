class Panel extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <section className="panel">
                <h3></h3>
                <slot></slot>
                <button>Show</button>
            </section>
        `;
        this.shadowRoot.querySelector('button').onclick = 
            () => this.dispatchEvent(new CustomEvent('show'));
        this.update();
    }

    static get observedAttributes() { return ['title', 'active']; }

    attributeChangedCallback() {
        this.update();
    }

    update() {
        const heading = this.shadowRoot.querySelector('h3');
        const slot = this.shadowRoot.querySelector('slot');
        const button = this.shadowRoot.querySelector('button');
        if (heading && slot && button) {
            heading.textContent = this.title;
            slot.style.display = this.getAttribute('active') === 'true' ? 'block' : 'none';
            button.style.display = this.getAttribute('active') === 'true' ? 'none' : 'inline';    
        }
    }
}

export const registerPanelComponent =
    () => customElements.define('x-panel', Panel);
