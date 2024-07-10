class ExampleComponent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = '<p>For example...</p>';
    }
}
export const registerExampleComponent = () => {
    customElements.define('x-example', ExampleComponent);
}
