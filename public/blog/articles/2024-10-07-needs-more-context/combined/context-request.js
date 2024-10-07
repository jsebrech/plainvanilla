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
