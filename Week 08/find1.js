/**
 * @param {String} str
 * @return {boolean}
 */
function findA (str) {
    if (typeof str !== 'string') {
        return false;
    }
    for (let i = 0; i < str.length; i++) {
        if (str[i] === 'a') {
            return true;
        }
    }
    return false;
}
