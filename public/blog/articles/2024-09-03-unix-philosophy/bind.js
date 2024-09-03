/**
* Render a template (element or string) to an html fragment 
* while connecting it up to data using Vue-style shorthand binding syntax.
*
* - `@click="handleClick"` -> `click` event and `target.handleClick` method
* - `@change="mySignal"` -> `change` event will set `target.mySignal.value` to e.target.value
* - `@change="myProp"` -> `change` event will set `target.myProp` to e.target.value
* - `:textContent="text"` -> elem `textContent` property is set to `this.text` property once
*   (also supports special shorthand `:text` for textContent and `:html` for innerHTML)
* - `:value="mySignal"` -> elem `value` attribute is bound to the signal `target.mySignal`'s value
*
* @param {*} template The template to be bound to an object
* @param {*} target The object being targeted for binding
* @returns fragment
*/
export const bind = (template, target) => {
    if (!template.content) {
        const text = template;
        template = document.createElement('template');
        template.innerHTML = text;
    }
    const fragment = template.content.cloneNode(true);
    // iterate over all nodes in the fragment and bind them
    // based on https://hawkticehurst.com/2024/05/bring-your-own-base-class/
    const iterator = document.createNodeIterator(
        fragment,
        NodeFilter.SHOW_ELEMENT,
        {
            // Reject any node that is not an HTML element
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
        // list of all properties
        // const properties = getAllProperties(elem);
        // copy NamedNodeMap because we're about to change it
        for (const attr of Array(...node.attributes)) {
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
            // check for custom property/attribute binding attributes
            } else if (attr.name.startsWith(':')) {
                // extract the name and value of the attribute/property
                let name = attr.name.slice(1);
                const property = getPropertyForAttribute(name, target); // properties.values().find(k => k.toLowerCase() === name.toLowerCase());
                const setter = property ?
                    () => elem[property] = target[attr.value] :
                    () => elem.setAttribute(name, target[attr.value]);
                setter();
                // if we're binding to a signal, listen to updates
                target[attr.value].effect?.(setter);
                // remove (non-standard) attribute from element
                elem.removeAttributeNode(attr);
            }
        }
    }
    return fragment;
}

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