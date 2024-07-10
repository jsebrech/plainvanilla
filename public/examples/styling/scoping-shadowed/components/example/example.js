class ExampleComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="${new URL('example.css', import.meta.url)}">
            <p>For example...</p>
            <slot></slot>
        `;
    }
}
export const registerExampleComponent = () => {
    customElements.define('x-example', ExampleComponent);
}
