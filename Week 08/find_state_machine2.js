/**
 * @description Find 'abcabx' in a string
 * @param {string} str
 * @return {boolean}
 */
function match (str) {
    let state = start;
    for (const c of str) {
        state = state(c);
    }
    return state === end;
}

function start (c) {
    if (c === 'a') {
        return foundA;
    } else {
        return start;
    }
}

function end () {
    return end;
}

function foundA (c) {
    if (c === 'b') {
        return foundB;
    } else {
        return start(c);
    }
}

function foundB (c) {
    if (c === 'c') {
        return foundC;
    } else {
        return start(c);
    }
}

function foundC (c) {
    if (c === 'a') {
        return foundA2;
    } else {
        return start(c);
    }
}

function foundA2 (c) {
    if (c === 'b') {
        return foundB2;
    } else {
        return foundA(c);
        // return start(c)
    }
}

function foundB2 (c) {
    if (c === 'x') {
        return end;
    } else {
        return foundB(c);
    }
}
