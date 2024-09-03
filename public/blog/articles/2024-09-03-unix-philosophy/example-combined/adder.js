import { bind } from './bind.js';
import { signal, computed } from './signals.js';
import { html } from './html.js';

customElements.define('x-adder', class Adder extends HTMLElement {
    a = signal();
    b = signal();
    result = computed(() => 
        html`${+this.a} + ${+this.b} = ${+this.a + +this.b}`, [this.a, this.b]);

    connectedCallback() {
        this.a.value ??= this.getAttribute('a') || 0;
        this.b.value ??= this.getAttribute('b') || 0;
        this.append(bind(html`
            <input type="number" :value="a" @input="a" />
            <input type="number" :value="b" @input="b" />
            <p :html="result"></p>
        `, this));
    }
});
