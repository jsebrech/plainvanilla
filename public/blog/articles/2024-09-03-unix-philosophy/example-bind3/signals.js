export class Signal extends EventTarget {
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

export class Computed extends Signal {
    constructor (fn, deps) {
        super(fn(...deps));
        for (const dep of deps) {
            if (dep instanceof Signal) 
                dep.addEventListener('change', () => this.value = fn(...deps));
        }
    }
}

export const signal = _ => new Signal(_);
export const computed = (fn, deps) => new Computed(fn, deps);
