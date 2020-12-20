/**
 * @param {String} str
 * @return {Boolean}
 */
function match (str) {
    if (typeof str !== 'string') {
        return false;
    }
    for (let i = 0; i < str.length - 1; i++) {
        if (str[i] === 'a' && str[i + 1] === 'b') {
            return true;
        }
    }
    return false;
}
