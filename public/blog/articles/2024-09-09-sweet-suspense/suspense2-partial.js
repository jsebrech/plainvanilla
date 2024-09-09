    static waitFor(sender, ...promises) {
        const suspense = sender.closest('x-suspense');
        if (suspense) suspense.addPromises(...promises);
    }

    addPromises(...promises) {
        if (!promises.length) return;
        this.loading = true;
        // combine into previous promises if there are any
        const newPromise = this.#waitingForPromise = 
            Promise.allSettled([...promises, this.#waitingForPromise]);
        // wait for all promises to complete
        newPromise.then(_ => {
            // if no newer promises were added, we're done
            if (newPromise === this.#waitingForPromise) {
                this.loading = false;
            }
        });
    }