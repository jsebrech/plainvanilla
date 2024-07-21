const { expect } = window.chai;
const { getByText, queries, within, waitFor, fireEvent } = window.TestingLibraryDom;

let rootContainer;
let screen;

beforeEach(() => {
    // the hidden div where the test can render elements
    rootContainer = document.createElement("div");
    rootContainer.style.position = 'absolute';
    rootContainer.style.left = '-10000px';
    document.body.appendChild(rootContainer);
    // pre-bind @testing-library/dom helpers to rootContainer
    screen = Object.keys(queries).reduce((helpers, key) => {
        const fn = queries[key]
        helpers[key] = fn.bind(null, rootContainer)
        return helpers
    }, {});
});

afterEach(() => {
    document.body.removeChild(rootContainer);
    rootContainer = null;
});

function render(el) {
    rootContainer.appendChild(el);
}

export { 
    rootContainer, 
    expect, 
    render, 
    getByText, screen, within, waitFor, fireEvent
};
