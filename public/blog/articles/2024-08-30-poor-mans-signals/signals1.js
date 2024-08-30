class Signal extends EventTarget {
    #value;
    get value () { return this.#value; }
    set value (value) {
        if (this.#value === value) return;
        this.#value = value;
        this.dispatchEvent(new CustomEvent('change')); 
    }

    constructor (value) {
        super();
        this.#value = value;
    }
}