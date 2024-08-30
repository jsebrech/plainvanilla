const name = new Signal('Jane');
name.addEventListener('change', () => console.log(name.value));
name.value = 'John';
// Logs: John