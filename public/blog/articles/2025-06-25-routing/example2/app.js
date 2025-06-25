import { routerEvents, interceptNavigation, matchesRoute } from './view-route.js';

customElements.define('demo-app', class extends HTMLElement {

    #route = '/';

    constructor() {
        super();
        interceptNavigation(document.body);
        routerEvents.addEventListener('popstate', (e) => {
            const matches =
                matchesRoute('/details') || 
                matchesRoute('/');
            this.#route = matches?.[1];
            this.update();
        });
    }

    connectedCallback() {
        this.update();
    }

    update() {
        if (this.#route === '/') {
            this.innerHTML = 'This is the homepage. <a href="/details">Go to the details page</a>.';
        } else if (this.#route === '/details') {
            this.innerHTML = 'This is the details page. <a href="/">Go to the home page</a>.';
        } else {
            this.innerHTML = `The page ${this.#route} does not exist. <a href="/">Go to the home page</a>.`;
        }
        this.innerHTML += `<br>Current route: ${this.#route}`;
    }
});
