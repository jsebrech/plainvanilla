const name = signal('Jane');
const surname = signal('Doe');
const fullName = computed(() => `${name} ${surname}`, [name, surname]);
// Logs name every time it changes:
fullName.effect(() => console.log(fullName.value));
// -> Jane Doe

// Updating `name` updates `fullName`, which triggers the effect again:
name.value = 'John';
// -> John Doe
