class Html extends String { }

/** 
 * tag a string as html not to be encoded
 * @param {string} str
 * @returns {string}
 */
export const htmlRaw = str => new Html(str);

/** 
 * entity encode a string as html
 * @param {*} value The value to encode
 * @returns {string}
 */
export const htmlEncode = (value) => {
    // avoid double-encoding the same string
    if (value instanceof Html) {
        return value;
    } else {
        // https://stackoverflow.com/a/57448862/20980
        return htmlRaw(
            String(value).replace(/[&<>'"]/g, 
                tag => ({
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    "'": '&#39;',
                    '"': '&quot;'
                }[tag]))
        );
    }
}

/** 
 * html tagged template literal, auto-encodes entities
 */
export const html = (strings, ...values) => 
    htmlRaw(String.raw({ raw: strings }, ...values.map(htmlEncode)));
