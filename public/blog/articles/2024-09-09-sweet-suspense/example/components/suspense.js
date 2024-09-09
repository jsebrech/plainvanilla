import { ErrorBoundary } from './error-boundary.js';

/**
 * A vanilla version of React's Suspense
 * 
 * Usage:
 * 
 * <x-suspense>
 *     <p slot="fallback">Loading...</p>
 *     <p>
 *         While it loads it shows the fallback:
 *         <x-lazy><x-load-on-demand></x-load-on-demand></x-lazy>
 *     </p>
 * </x-suspense>
 * 
 * @license MIT
 */
export class Suspense extends HTMLElement {

    /**
     * Find the nearest suspense to the sender element and make it wait for the promises to complete.
     * @param {*} sender The element that sends the promise
     * @param {...Promise} promises 
     */
    static waitFor(sender, ...promises) {
        const suspense = sender.closest('x-suspense');
        if (suspense) suspense.addPromises(...promises);
    }

    #fallbackSlot;
    #contentSlot;
    #waitingForPromise;

    set #loading(isLoading) {
        if (!this.#fallbackSlot) return;
        this.#fallbackSlot.style.display = isLoading ? 'contents' : 'none';
        this.#contentSlot.style.display = !isLoading ? 'contents' : 'none';
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.#fallbackSlot = document.createElement('slot');
        this.#fallbackSlot.style.display = 'none';
        this.#fallbackSlot.name = 'fallback';
        this.#contentSlot = document.createElement('slot');
        this.shadowRoot.append(this.#fallbackSlot, this.#contentSlot);
    }

    connectedCallback() {
        this.style.display = 'contents';
    }

    /**
     * Wait for one or more promises to settle, showing fallback content
     * @param  {...Promise} promises 
     */
    addPromises(...promises) {
        if (!promises.length) return;
        this.#loading = true;
        // combine into previous promises if there are any
        const newPromise = this.#waitingForPromise = 
            Promise.allSettled([...promises, this.#waitingForPromise]);
        // wait for all promises to complete
        newPromise.then(settled => {
            // if no more promises were added, we're done
            if (newPromise === this.#waitingForPromise) {
                this.#loading = false;
                // if a promise failed, show an error
                const failed = settled.find(_ => _.status === 'rejected');
                if (failed) ErrorBoundary.showError(this, failed.reason);
            }
        });
    }
}

export const registerSuspense = () => customElements.define('x-suspense', Suspense);
