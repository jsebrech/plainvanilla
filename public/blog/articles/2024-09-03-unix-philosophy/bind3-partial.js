// check for custom event listener attributes
if (attr.name.startsWith('@')) {
    const event = attr.name.slice(1);
    const property = attr.value;
    let listener;
    // if we're binding the event to a function, call it directly
    if (typeof target[property] === 'function') {
        listener = target[property].bind(target);
    // if we're binding to a signal, set the signal's value
    } else if (typeof target[property] === 'object' && 
                typeof target[property].value !== 'undefined') {
        listener = e => target[property].value = e.target.value;
    // fallback: assume we're binding to a property, set the property's value
    } else {
        listener = e => target[property] = e.target.value;
    }
    elem.addEventListener(event, listener);
    // remove (non-standard) attribute from element
    elem.removeAttributeNode(attr);
}