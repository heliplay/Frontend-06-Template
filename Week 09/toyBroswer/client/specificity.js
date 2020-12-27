/**
 *
 * @param {string} selector css多级选择器字符串
 */
function specificity (selector) {
    let p = [0, 0, 0, 0];
    let selectorParts = selector.split(' ');
    for (const part of selectorParts) {
        let partObj = parsePart(part);
        if (partObj.id) {
            p[1] += 1;
        }
        p[2] += partObj.classList.length;
        if (partObj.tagName) {
            p[3] += 1;
        }
    }
    return p;
}

/**
 *
 * @param {string} part css 单级选择器 eg'div#id.cls1.cls2'
 */
function parsePart (part) {
    // selector = selector.trim();
    let tagName = '';
    let id = '';
    let className = '';
    let classList = [];
    let state = 'tag';// tag、class、 id
    for (const char of part) {
        if (char === '#') {
            if (state === 'class') {
                classList.push(className);
                className = '';
            }
            state = 'id';
        } else if (char === '.') {
            state = 'class';
            if (state === 'class') {
                classList.push(className);
                className = '';
            }
        } else {
            if (state === 'tag') {
                tagName += char;
            } else if (state === 'class') {
                className += char;
            } else if (state === 'id') {
                id += char;
            }
        }
    }
    return {
        tagName,
        classList,
        id
    };
}
