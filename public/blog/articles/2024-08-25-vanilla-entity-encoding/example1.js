class MyComponent extends HTMLElement {
    connectedCallback() {
        const btn = `<button>${this.getAttribute('foo')}</button>`;
        this.innerHTML = `
            <header><h1>${this.getAttribute('bar')}</h1></header>
            <article>
                <p class="${this.getAttribute('baz')}">${this.getAttribute('xyzzy')}</p>
                ${btn}
            </article>
        `;
    }
}
customElements.define('my-component', MyComponent);