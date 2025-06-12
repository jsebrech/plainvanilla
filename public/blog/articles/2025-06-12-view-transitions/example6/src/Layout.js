import { transitionEvents } from "../lib/view-transition.js";

customElements.define('demo-page', class extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="${import.meta.resolve('./styles.css')}">
            <div class="page">
                <div class="top">
                    <div class="top-nav">
                        <view-transition name="nav">
                            <slot name="heading"></slot>
                        </view-transition>
                    </div>
                </div>
                <div class="bottom">
                    <div class="content"><slot></slot></div>
                </div>
            </div>
        `;
        const viewTransition = this.shadowRoot.querySelector('view-transition');
        transitionEvents.addEventListener('transitionstart', e => {
            const transitionType = e.detail?.transitionType;
            switch (transitionType) {
                case 'nav-back':
                case 'nav-forward':
                    viewTransition.name = transitionType;
                    break;
            }
        });
        transitionEvents.addEventListener('transitionend', e => {
            viewTransition.name = 'nav';
        });
    }
});
