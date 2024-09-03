import { bind } from './bind.js';
import { signal } from './signals.js';

customElements.define('x-example', class Example extends HTMLElement {

    set a(value) { 
        this.setAttribute('a', value);
        this.querySelector('label[for=a] span').textContent = value;
    }
    set b(value) {
        this.setAttribute('b', value);
        this.querySelector('label[for=b] span').textContent = value;
    }
    c = signal('');

    connectedCallback() {
        this.append(bind(`
            <div>
                <input id="a" type="number" @input="onInputA">
                <label for="a">A = <span></span></label>
            </div>
            <div>
                <input id="b" type="number" @input="b">
                <label for="b">B = <span></span></label>
            </div>
            <div>
                <input id="c" type="number" @input="c">
                <label for="c">C = <span></span></label>
            </div>
            <button @click="onClick">Add</button>
            <div>Result: <span id="result"></span></div>
        `, this));
        this.c.effect(() => 
            this.querySelector('label[for=c] span').textContent = this.c);
    }

    onInputA (e) {
        this.a = e.target.value;
    }

    onClick() {
        this.querySelector('#result').textContent =
            +this.getAttribute('a') + +this.getAttribute('b') + +this.c;
    }
});
