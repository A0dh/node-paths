var extend = require('extend');

//--- Helpers ---
function objToArray(obj) { return Array.prototype.slice.call(obj); }
function join() { return Array.prototype.join.call(arguments, '/'); }
function cleanPath(path) { return path.replace(/\/+/g, '/').replace(/\/+$/, ''); }
function combinePaths(prefixes, postfixes) {
    var collection = [];
    if (!postfixes) return prefixes;
    if (!prefixes) prefixes = '';
    if (prefixes.constructor !== Array) prefixes = [prefixes];
    if (postfixes.constructor !== Array) postfixes = [postfixes];
    if (prefixes.length === 0) prefixes.push('');
    if (postfixes.length === 0) postfixes.push('');
    for (var i=0; i<prefixes.length; i++) {
        var prefix = prefixes[i] || '';
        if (typeof prefix === 'function') prefix = prefix();
        for (var j=0; j<postfixes.length; j++) {
            var postfix = postfixes[j] || '';
            if (typeof postfix === 'function') postfix = postfix();
            if (postfix.constructor === Array || postfix.constructor === Array) {
                collection = collection.concat(combinePaths(prefix,  postfix));
            } else {
                collection.push(join(prefix, postfix));
            }
        }
    }
    return collection;
}
//--- \Helpers ---

module.exports = {
    objToArray: objToArray,
    join: join,
    cleanPath: cleanPath,
    combinePaths: combinePaths,
    extend: extend
};
