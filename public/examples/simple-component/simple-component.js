class HelloWorldComponent extends HTMLElement {
    connectedCallback() {
        this.textContent = 'hello world!';
    }
}
customElements.define('x-hello-world', HelloWorldComponent);
