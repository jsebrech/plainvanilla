const name = signal('Jane');
name.effect(() => console.log(name.value));
// Logs: Jane
name.value = 'John';
// Logs: John