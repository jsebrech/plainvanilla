import { signal, computed } from './signals.js';

customElements.define('x-adder', class extends HTMLElement {
    a = signal(1);
    b = signal(2);
    result = computed((a, b) => `${a} + ${b} = ${+a + +b}`, [this.a, this.b]);

    connectedCallback() {
        if (this.querySelector('input')) return;

        this.innerHTML = `
            <input type="number" name="a" value="${this.a}">
            <input type="number" name="b" value="${this.b}">
            <p></p>
        `;
        this.result.effect(
            () => this.querySelector('p').textContent = this.result);
        this.addEventListener('input', 
            e => this[e.target.name].value = e.target.value);
    }
});
