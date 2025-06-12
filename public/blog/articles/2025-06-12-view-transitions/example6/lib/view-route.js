export const routerEvents = new EventTarget();

// update routes on popstate (browser back/forward)
export const handlePopState = (e) => {
    routerEvents.dispatchEvent(new PopStateEvent('popstate', { state: e.state }));
}
window.addEventListener('popstate', handlePopState);

const baseURL = new URL(window.originalHref || document.URL);
const basePath = baseURL.pathname.slice(0, baseURL.pathname.lastIndexOf('/'));

/**
 * Usage:
 * <view-route path="/(?:index.html)?" exact><p>hello</p><view-route> = only match / or /index.html and show the text "hello"
 * <view-route path="/"> = match every route below / (e.g. for site navigation)
 * <view-route path="/todos/([\w]+)"> = match #/todos/:id
 * <view-route path="*"> = match if no other route matches within the same parent node
 * 
 * routechange event contains detail.matches, the array of matched parts of the regex
 */
customElements.define('view-route', class extends HTMLElement {

    #matches = [];

    /** is this route currently active */
    get isActive() {
        return !!this.#matches?.length;
    }

    /** array of matched parts of the regex */
    get matches() {
        return this.#matches;
    }

    connectedCallback() {
        this.style.display = 'contents';
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
        return ['path', 'exact'];
    }

    attributeChangedCallback() {
        this.update();
    }

    update() {
        let path = this.getAttribute('path') || '/';
        // prepend absolute paths with the base path of the document (SPA behavior)
        if (path.startsWith('/')) path = basePath + path;
        const exact = this.hasAttribute('exact');
        this.setMatches(this.matchesRoute(path, exact) || []);
        if (this.isActive) {
            this.dispatchEvent(new CustomEvent('routechange', { detail: this.matches, bubbles: true }));
        }
    }

    setMatches(matches) {
        this.#matches = matches;
        this.style.display = this.isActive ? 'contents' : 'none';
    }

    matchesRoute(path, exact) {
        let matches;
        // '*' triggers fallback route if no other route matches
        if (path === '*') {
            const activeRoutes = Array.from(
                this.parentNode.getElementsByTagName('view-route')
                ).filter(_ => _.isActive);
            if (!activeRoutes.length) matches = ['*'];
        // normal routes
        } else {
            const regex = new RegExp(`^${path.replaceAll('/', '\\/')}${exact ? '$' : ''}`, 'gi');
            const relativeUrl = location.pathname + location.search + location.hash;
            matches = regex.exec(relativeUrl);
        }
        return matches;
    }
});

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
    pushState(null, null, e.detail.url);
}

/** 
 * intercept link navigation for all links inside root, 
 * and do single-page navigation using pushState instead.
 * @param {HTMLElement} root
 */
export const interceptNavigation = (root) => {
    root.addEventListener('click', handleLinkClick);
    // by default, navigate events cause pushState() calls
    // add capturing listener to routerEvents before interceptNavigation() to prevent
    routerEvents.addEventListener('navigate', handleNavigate);
}

/**
 * Navigate to a new state and update routes
 * @param {*} state 
 * @param {*} unused 
 * @param {*} url 
 */
export const pushState = (state, unused, url) => {
    history.pushState(state, unused, url);
    routerEvents.dispatchEvent(new PopStateEvent('popstate', { state }));
}
