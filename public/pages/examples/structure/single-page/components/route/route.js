/**
 * Usage:
 * <x-route path="/" exact><p>hello</p><x-route> = only match #/ (or no hash) and show the text "hello"
 * <x-route path="/"> = match every route below / (e.g. for site navigation)
 * <x-route path="/about" exact> = only match #/about exactly
 * <x-route path="/todos/([\w]+)"> = match #/todos/:id and pass id to routeChangedCallback
 * <x-route path="/notebooks/([\w]+)(?:/([\w]+))?"> = match #/notebooks/:id and /notebooks/:id/:note and pass id and note to routeChangedCallback
 * <x-route path="*"> = match if no other route matches within the same parent node
 */
export class RouteComponent extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(document.createElement('slot'));
        this.update = this.update.bind(this);
    }

    #isActive = false;

    get isActive() {
        return this.#isActive;
    }

    connectedCallback() {
        this.classList.toggle('route', true);
        window.addEventListener('hashchange', this.update);
        this.update();
    }

    disconnectedCallback() {
        window.removeEventListener('hashchange', this.update);        
    }

    static get observedAttributes() {
        return ['path', 'exact'];
    }

    attributeChangedCallback() {
        this.update();
    }

    update() {
        const path = this.getAttribute('path') || '';
        const exact = this.hasAttribute('exact');
        const matches = this.#matchesRoute(path, exact);
        this.#isActive = !!matches;
        this.setIsActive(this.#isActive);
        this.routeChangedCallback.apply(this, matches ? matches.slice() : []);
    }

    // can be overridden in subclasses to change show/hide method
    setIsActive(active) {
        this.style.display = active ? 'block' : 'none';
    }

    // for overriding in subclasses to detect parameters
    routeChangedCallback(...matches) {}

    #matchesRoute(path, exact) {
        let matches;
        // '*' triggers fallback route if no other route matches
        if (path === '*') {
            const activeRoutes = 
                Array.from(this.parentNode.querySelectorAll('.route')).filter(_ => _.isActive);
            if (!activeRoutes.length) matches = ['*'];
        // normal routes
        } else {
            const regex = new RegExp(`^#${path.replaceAll('/', '\/')}${exact ? '$' : ''}`, 'gi');
            const currentPath = window.location.hash || '#/';
            matches = regex.exec(currentPath);
        }
        return matches;
    }
}

export const registerRouteComponent = () => customElements.define('x-route', RouteComponent);
