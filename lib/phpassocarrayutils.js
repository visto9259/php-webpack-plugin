/**
 * Utilities to generate a PHP associative array
 *
 */


module.exports = {};

/**
 * Outputs a php opening statement
 * @returns {string}
 */
module.exports.phpHeader = () => {
    return '<?php\n';
};

/**
 * Outputs a [ on a single line
 * @param indent {number}
 * @returns {string}
 */
module.exports.openingBracket = (indent=0) => {
    let out = '';
    for (let i=0; i<indent; i++) out += '\t';
    return out + '[\n';
};

/**
 * Output a ] on a single line with a , or a ;
 * @param indent {number}
 * @param last {boolean}
 * @returns {string}
 */
module.exports.closingBracket = (indent=0, last=false) => {
    let out ='';
    for (let i=0; i<indent; i++) out += '\t';
    if (last) out+= '];\n'; else out += '],\n';
    return out;
};

/**
 * Outputs 'return ['
 * @param indent {number}
 * @returns {string}
 */
module.exports.returnWithBracket = (indent=0) => {
    let out ='';
    for (let i=0; i<indent; i++) out += '\t';
    return out += 'return [\n' ;
};

/**
 * Output "key' => "
 * @param key
 * @param indent
 * @returns {string}
 */
module.exports.arrayKeyWithGT = (key, indent=0) => {
    let out ='';
    for (let i=0; i<indent; i++) out += '\t';
    return out += `'${key}' => ` ;
};
