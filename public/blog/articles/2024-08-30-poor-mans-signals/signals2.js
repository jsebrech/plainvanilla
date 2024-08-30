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

    effect(fn) {
        fn();
        this.addEventListener('change', fn);
        return () => this.removeEventListener('change', fn);
    }

    valueOf () { return this.#value; }
    toString () { return String(this.#value); }
}

const signal = _ => new Signal(_);
