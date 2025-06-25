export const routerEvents = new EventTarget();

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
        const pageUrl = anchorUrl.pathname + anchorUrl.search + anchorUrl.hash;
        routerEvents.dispatchEvent(new CustomEvent('navigate', { detail: { url: pageUrl, a }}));
    }
}

const handleNavigate = (e) => {
    history.pushState(null, null, e.detail.url);
}
