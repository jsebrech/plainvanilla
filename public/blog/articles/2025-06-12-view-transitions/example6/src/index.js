import { interceptNavigation, routerEvents, handlePopState, pushState } from '../lib/view-route.js';
import { startTransition } from '../lib/view-transition.js';
import './App.js';

const app = () => {
    // intercept default router behavior to make it animate view transitions
    routerEvents.addEventListener('navigate', (e) => {
        e.stopImmediatePropagation();
        const { url, a } = e.detail;
        const isBackNav = a?.classList?.contains('back');
        const transitionType = isBackNav ? 'nav-back' : 'nav-forward';
        startTransition(
            () => {
                pushState(transitionType, null, url);
                // give routes time to render before snapshotting
                return new Promise(resolve => setTimeout(resolve, 10));
            }, 
            transitionType);
    }, { capture: true });
    // intercept popstate to animate back/forward page navigation
    window.removeEventListener('popstate', handlePopState);
    window.addEventListener('popstate', (e) => {
        startTransition(() => handlePopState(e), e.state);
    });

    const root = document.getElementById('root');
    root.innerHTML = `<demo-app></demo-app>`;
    interceptNavigation(root);
}

document.addEventListener('DOMContentLoaded', app);
