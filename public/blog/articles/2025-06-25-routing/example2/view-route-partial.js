const handleNavigate = (e) => {
    history.pushState(null, null, e.detail.url);
    routerEvents.dispatchEvent(new PopStateEvent('popstate'));
}

// update routes on popstate (browser back/forward)
export const handlePopState = (e) => {
    routerEvents.dispatchEvent(new PopStateEvent('popstate', { state: e.state }));
}
window.addEventListener('popstate', handlePopState);
