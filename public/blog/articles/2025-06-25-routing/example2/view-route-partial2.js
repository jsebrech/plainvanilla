// ...

// all routes will be relative to the document's base path
const baseURL = new URL(window.originalHref || document.URL);
const basePath = baseURL.pathname.slice(0, baseURL.pathname.lastIndexOf('/'));

// returns an array of regex matches for matched routes, or null
export const matchesRoute = (path) => {
    const fullPath = basePath + '(' + path + ')';
    const regex = new RegExp(`^${fullPath.replaceAll('/', '\\/')}`, 'gi');
    const relativeUrl = location.pathname;
    return regex.exec(relativeUrl);
}
