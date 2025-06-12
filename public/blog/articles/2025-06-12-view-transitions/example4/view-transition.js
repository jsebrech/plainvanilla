export const startTransition = (updateCallback) => {
    if (document.startViewTransition) {
        document.startViewTransition(updateCallback);
    } else {
        const done = Promise.try(updateCallback);
        return {
            updateCallbackDone: done,
            ready: done,
            finished: done,
            skipTransition: () => {}
        };
    }
}
