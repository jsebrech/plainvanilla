function htmlEncode(s) {
    return s.replace(/[&<>'"]/g,
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag]))
}

class MyComponent extends HTMLElement {
    connectedCallback() {
        const btn = `<button>${htmlEncode(this.getAttribute('foo'))}</button>`;
        this.innerHTML = `
            <header><h1>${htmlEncode(this.getAttribute('bar'))}</h1></header>
            <article>
                <p class="${htmlEncode(this.getAttribute('baz'))}">${htmlEncode(this.getAttribute('xyzzy'))}</p>
                ${btn}
            </article>
        `;
    }
}
customElements.define('my-component', MyComponent);