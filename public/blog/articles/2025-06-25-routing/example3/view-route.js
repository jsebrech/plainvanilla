export const routerEvents = new EventTarget();

// all routes will be relative to the document's base path
const baseURL = new URL(window.originalHref || document.URL);
const basePath = baseURL.pathname.slice(0, baseURL.pathname.lastIndexOf('/'));

export const interceptNavigation = (root) => {
    // convert link clicks to navigate events
    root.addEventListener('click', handleLinkClick);
    // convert navigate events to pushState() calls
    routerEvents.addEventListener('navigate', handleNavigate);
}

const handleLinkClick = (e) => {
    const a = e.target.closest('a');
    if (a && a.href) {
        e.preventDefault();
        const anchorUrl = new URL(a.href);
        const pageUrl = basePath + anchorUrl.pathname + anchorUrl.search + anchorUrl.hash;
        routerEvents.dispatchEvent(new CustomEvent('navigate', { detail: { url: pageUrl, a }}));
    }
}

const handleNavigate = (e) => {
    history.pushState(null, null, e.detail.url);
    routerEvents.dispatchEvent(new PopStateEvent('popstate'));
}

// update routes on popstate (browser back/forward)
export const handlePopState = (e) => {
    routerEvents.dispatchEvent(new PopStateEvent('popstate', { state: e.state }));
}
window.addEventListener('popstate', handlePopState);

// returns an array of regex matches for matched routes, or null
export const matchesRoute = (path) => {
    const fullPath = path.startsWith('/') ? basePath + '(' + path + ')' : '(' + path + ')';
    const regex = new RegExp(`^${fullPath.replaceAll('/', '\\/')}`, 'gi');
    const relativeUrl = location.pathname;
    return regex.exec(relativeUrl);
}

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
