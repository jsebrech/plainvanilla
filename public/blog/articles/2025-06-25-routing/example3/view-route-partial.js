// ...

customElements.define('view-route', class extends HTMLElement {

    #matches = [];

    get isActive() {
        return !!this.#matches?.length;
    }

    get matches() {
        return this.#matches;
    }

    set matches(v) {
        this.#matches = v;
        this.style.display = this.isActive ? 'contents' : 'none';
        if (this.isActive) {
            this.dispatchEvent(new CustomEvent('routechange', { detail: v, bubbles: true }));
        }
    }

    connectedCallback() {
        routerEvents.addEventListener('popstate', this);
        this.update();
    }

    disconnectedCallback() {
        routerEvents.removeEventListener('popstate', this);
    }

    handleEvent(e) {
        this.update();
    }

    static get observedAttributes() {
        return ['path'];
    }

    attributeChangedCallback() {
        this.update();
    }

    update() {
        const path = this.getAttribute('path') || '/';
        this.matches = this.matchesRoute(path) || [];
    }

    matchesRoute(path) {
        // '*' triggers fallback route if no other route on the same DOM level matches
        if (path === '*') {
            const activeRoutes = 
                Array.from(this.parentNode.getElementsByTagName('view-route')).filter(_ => _.isActive);
            if (!activeRoutes.length) return [location.pathname, '*'];
        // normal routes
        } else {
            return matchesRoute(path);
        }
        return null;
    }
});
