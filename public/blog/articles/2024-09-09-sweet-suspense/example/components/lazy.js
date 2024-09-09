import { Suspense } from './suspense.js';

/**
 * A vanilla version of React's lazy() function
 * inspired by https://css-tricks.com/an-approach-to-lazy-loading-custom-elements/
 * 
 * Usage: <x-lazy><x-load-on-demand></x-load-on-demand></x-lazy>
 * 
 * Will load default function from ./components/<load-on-demand>/<load-on-demand>.js and execute it.
 * Only direct children are lazy-loaded, and only on initial DOM insert.
 * 
 * Pass the root attribute to modify the path to load relative to the current document.
 * <x-lazy root="./submodule/components/"><x-load-on-demand></x-load-on-demand></x-lazy>
 * 
 * Put the lazy-path attribute on a custom element to specify the path to the JS file to load.
 * 
 * @license MIT
 */
class Lazy extends HTMLElement {
    connectedCallback() {
        this.style.display = 'contents';
        this.#loadLazy();
    }

    /**
     * Find direct child custom elements that need loading, then load them
     */
    #loadLazy() {
        const elements = 
            [...this.children].filter(_ => _.localName.includes('-'));
        const unregistered = 
            elements.filter(_ => !customElements.get(_.localName));
        if (unregistered.length) {
            Suspense.waitFor(this, 
                ...unregistered.map(_ => this.#loadElement(_))
            );    
        }
    }

    /**
     * Load a custom element
     * @param {*} element 
     * @returns {Promise} a promise that settles when loading completes or fails
     */
    #loadElement(element) {
        // does the element advertise its own path?
        let url = element.getAttribute('lazy-path');
        if (!url) {
            // strip leading x- off the name
            const cleanName = element.localName.replace(/^x-/, '').toLowerCase();
            // root directory to load from, relative to current document
            const rootDir = this.getAttribute('root') || './components/';
            // assume component is in its own folder
            url = `${rootDir}${cleanName}/${cleanName}.js`;
        }
        // dynamically import, then register if not yet registered
        return import(new URL(url, document.location)).then(module => 
            !customElements.get(element.localName) && module && module.default());
    }
}

export const registerLazy = () => customElements.define('x-lazy', Lazy);
