// html:
<my-hello value="world"></my-hello>
// js:
const myHello = document.querySelector('my-hello');
myHello.value = 42; // setter not called before define
customElements.define('my-hello', /* ... */);
console.log(myHello.getAttribute('value')); // -> "world"
