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
