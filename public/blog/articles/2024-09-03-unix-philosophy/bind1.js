export const bind = (template) => {
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

                // TODO: bind event ...
                
                elem.removeAttributeNode(attr);
            // check for property/attribute binding directive
            } else if (attr.name.startsWith(':')) {
                
                // TODO: bind data ...
                
                elem.removeAttributeNode(attr);
            }
        }
    }
    return fragment;
}