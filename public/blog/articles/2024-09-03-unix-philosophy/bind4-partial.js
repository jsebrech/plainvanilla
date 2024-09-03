// ...
    if (attr.name.startsWith(':')) {
        // extract the name and value of the attribute/property
        let name = attr.name.slice(1);
        const property = getPropertyForAttribute(name, target);
        const setter = property ?
            () => elem[property] = target[attr.value] :
            () => elem.setAttribute(name, target[attr.value]);
        setter();
        // if we're binding to a signal, listen to updates
        if (target[attr.value]?.effect) {
            target[attr.value].effect(setter);
        // if we're binding to a property, listen to the target's updates
        } else if (target.addEventListener) {
            target.addEventListener('change', setter);
        }
        // remove (non-standard) attribute from element
        elem.removeAttributeNode(attr);
    }
// ...

function getPropertyForAttribute(name, obj) {
    switch (name.toLowerCase()) {
        case 'text': case 'textcontent':
            return 'textContent';
        case 'html': case 'innerhtml':
            return 'innerHTML';
        default:
            for (let prop of Object.getOwnPropertyNames(obj)) {
                if (prop.toLowerCase() === name.toLowerCase()) {
                    return prop;
                }
            }   
    }
}