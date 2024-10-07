export class ContextRequestEvent extends Event {
    constructor(context, callback, subscribe) {
        super('context-request', {
            bubbles: true,
            composed: true,
        });
        this.context = context;
        this.callback = callback;
        this.subscribe = subscribe;
    }
}

export class ContextProvider extends EventTarget {
    #value;
    get value() { return this.#value }
    set value(v) { this.#value = v; this.dispatchEvent(new Event('change')); }

    #context;
    get context() { return this.#context }

    constructor(target, context, initialValue = undefined) {
        super();
        this.#context = context;
        this.#value = initialValue;
        this.handle = this.handle.bind(this);
        if (target) this.attach(target);
    }
    
    attach(target) {
        target.addEventListener('context-request', this.handle);
    }

    detach(target) {
        target.removeEventListener('context-request', this.handle);
    }

    /**
     * Handle a context-request event
     * @param {ContextRequestEvent} e 
     */
    handle(e) {
        if (e.context === this.context) {
            if (e.subscribe) {
                const unsubscribe = () => this.removeEventListener('change', update);
                const update = () => e.callback(this.value, unsubscribe);
                this.addEventListener('change', update);
                update();
            } else {
                e.callback(this.value);
            }
            e.stopPropagation();
        }
    }
}
