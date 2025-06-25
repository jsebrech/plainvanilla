import { interceptNavigation } from './view-route.js';

customElements.define('demo-app', class extends HTMLElement {

    constructor() {
        super();
        interceptNavigation(document.body);
    }

    connectedCallback() {
        this.innerHTML = `
        <view-route path="/(?:index.html)?$">
            This is the homepage. <a href="/details">Go to the details page</a>, or
            travel a <a href="/unknown">path of mystery</a>.
        </view-route>
        <view-route path="/details">
            This is the details page. <a href="/">Go to the home page</a>.
        </view-route>
        <view-route path="*">
            The page does not exist. <a href="/">Go to the home page</a>.
        </view-route>
        `
    }
});
