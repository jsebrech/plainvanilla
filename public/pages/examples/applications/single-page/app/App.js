class App extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <h1>Basic Example</h1>

        <p>
            This example demonstrates how the features of React Router
            can be approximated using web components and a vanilla hash router.
        </p>
        <p>
            Check out the original <a href="https://github.com/remix-run/react-router/tree/dev/examples/basic" target="_blank">React Router basic example</a> for comparison.
        </p>

        <!-- Routes can be nested, but the path must always be fully specified. -->
        <x-route path="/">
            <x-app-layout></x-app-layout>
            <x-route path="/" exact>
                <h2>Home</h2>
            </x-route>
            <x-route path="/about" exact>
                <h2>About</h2>
            </x-route>
            <x-route path="/dashboard" exact>
                <h2>Dashboard</h2>
            </x-route>
            <x-route path="*">
                <h2>Nothing to see here</h2>
                <a href="#/">Go to the home page</a>
            </x-route>
        </x-route>
        `;
    }
}

class AppLayout extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <nav>
            <ul>
                <li><a href="#/">Home</a></li>
                <li><a href="#/about">About</a></li>
                <li><a href="#/dashboard">Dashboard</a></li>
                <li><a href="#/nothing-here">Nothing Here</a></li>
            </ul>
        </nav>
        <hr />
        `;
    }
}

export const registerApp = () => {
    customElements.define('x-app', App);
    customElements.define('x-app-layout', AppLayout);
}
