// the currently animating view transition
let currentTransition = null;
// the next transition to run (after currentTransition completes)
let nextTransition = null;

/** start a view transition or queue it for later if one is already animating */
export const startTransition = (updateCallback) => {
    if (!updateCallback) updateCallback = () => {};
    // a transition is active
    if (currentTransition && !currentTransition.isFinished) {
        // it is running callbacks, but not yet animating
        if (!currentTransition.isReady) {
            currentTransition.addCallback(updateCallback);
            return currentTransition;
        // it is already animating, queue callback in the next transition
        } else {
            if (!nextTransition) {
                nextTransition = new QueueingViewTransition();
            }
            return nextTransition.addCallback(updateCallback);
        }
    // if no transition is active, start animating the new transition
    } else {
        currentTransition = new QueueingViewTransition();
        currentTransition.addCallback(updateCallback);
        currentTransition.run();
        // after it's done, execute any queued transition
        const doNext = () => {
            if (nextTransition) {
                currentTransition = nextTransition;
                nextTransition = null;
                currentTransition.run();
                currentTransition.finished.finally(doNext);
            } else {
                currentTransition = null;
            }
        }
        currentTransition.finished.finally(doNext);
        return currentTransition;
    }
}

const doViewTransition = (updateCallback) => {
    let transition;
    if (document.startViewTransition) {
        transition = document.startViewTransition(updateCallback);
    } else {
        // fake view transition in firefox
        const done = promiseTry(updateCallback);
        transition = {
            updateCallbackDone: done,
            ready: done,
            finished: done,
            skipTransition: () => {}
        };
    }
    return transition;
}

let nextQueueId = 0;

class QueueingViewTransition {
    #id = nextQueueId++;
    #updateCallbackDone = Promise.withResolvers();
    #ready = Promise.withResolvers();
    #finished = Promise.withResolvers();
    #callbacks = [];
    #activeViewTransition = null;

    get id() { return this.#id; }

    // transition is running
    isRunning = false;
    // callbacks are complete, animation will start
    isReady = false;
    // animation is complete
    isFinished = false;

    constructor() {
        this.ready.finally(() => this.isReady = true);
        this.finished.finally(() => {
            this.isFinished = true;
        });
    }

    addCallback(updateCallback) {
        if (typeof updateCallback !== 'function') throw new Error('updateCallback must be a function');
        if (this.isReady) throw new Error('view transition already started');
        this.#callbacks.push(updateCallback);
        return this;
    }

    run(skipTransition = false) {
        // already running
        if (this.isRunning) return;
        this.isRunning = true;

        // execute callbacks in order in case later ones depend on DOM changes of earlier ones
        // but do it async to allow callbacks to be added until animation starts
        const doNext = () => {
            if (this.#callbacks.length) {
                const callback = this.#callbacks.shift();
                return promiseTry(callback).then(doNext);
            }
        };

        const callback = () => {
            return doNext().then(this.#updateCallbackDone.resolve, this.#updateCallbackDone.reject);
        };

        // jump to the end
        if (skipTransition) {
            callback()
                .then(this.#ready.resolve, this.#ready.reject)
                .then(this.#finished.resolve, this.#finished.reject);
        // start animating
        } else {
            this.#activeViewTransition = doViewTransition(callback);
            this.#activeViewTransition.ready.then(this.#ready.resolve, this.#ready.reject);
            this.#activeViewTransition.finished.then(this.#finished.resolve, this.#finished.reject);
        }
    }

    // callbacks have fulfilled their promise
    get updateCallbackDone() { return this.#updateCallbackDone.promise }
    // animation is about to start
    get ready() { return this.#ready.promise }
    // animation has completed
    get finished() { return this.#finished.promise }

    skipTransition() {
        if (this.#activeViewTransition) {
            this.#activeViewTransition.skipTransition();
        } else {
            this.run(true);
        }
    }
}

// polyfill
function promiseTry(fn) {
    if (Promise.try) return Promise.try(fn);
	return new Promise(function(resolve) {
		resolve(fn());
	});
}
