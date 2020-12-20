/**
 *
 * @param {string} str
 * @return {boolean}
 */
function match (str) {
    let findA = false;
    let findB = false;
    let findC = false;
    let findD = false;
    for (const c of str) {
        if (c === 'a') {
            findA = true;
        } else if (findA === true && c === 'b') {
            findB = true;
        } else if (findB === true && c === 'c') {
            findC = true;
        } else if (findC === true && c === 'd') {
            findD = true;
        } else if (findD === true && c === 'e') {
            return true;
        } else {
            findA = false;
            findB = false;
            findC = false;
            findD = false;
        }
    }
    return false;
}
