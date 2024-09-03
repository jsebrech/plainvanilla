export const bind = (template, target) => {
    if (!template.content) {
        const text = template;
        template = document.createElement('template');
        template.innerHTML = text;
    }
    const fragment = template.content.cloneNode(true);
    // iterate over all nodes in the fragment
    const iterator = document.createNodeIterator(
        fragment,
        NodeFilter.SHOW_ELEMENT,
        {
            // reject any node that is not an HTML element
            acceptNode: (node) => {
                if (!(node instanceof HTMLElement))
                    return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            },
        }
    );
    let node;
    while (node = iterator.nextNode()) {
        if (!node) return;
        const elem = node;
        for (const attr of Array(...node.attributes)) {
            // check for event binding directive
            if (attr.name.startsWith('@')) {
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
            // check for property/attribute binding directive
            } else if (attr.name.startsWith(':')) {

                // TODO: bind data ...
                
                elem.removeAttributeNode(attr);
            }
        }
    }
    return fragment;
}
