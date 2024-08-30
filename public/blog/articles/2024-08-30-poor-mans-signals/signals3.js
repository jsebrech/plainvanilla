class Computed extends Signal {
    constructor (fn, deps) {
        super(fn(...deps));
        for (const dep of deps) {
            if (dep instanceof Signal) 
                dep.addEventListener('change', () => this.value = fn(...deps));
        }
    }
}

const computed = (fn, deps) => new Computed(fn, deps);
