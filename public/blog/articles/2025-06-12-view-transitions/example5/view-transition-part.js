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

// ...