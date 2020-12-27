/**
 * 关于css选择器的拆解
 * @param {string} selector
 */
function splitSelector (selector) {
    // selector = selector.trim();
    let tagName = '';
    let id = '';
    let className = '';
    let classList = [];
    let state = 'tag';// tag、class、 id
    for (const char of selector) {
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

/**
 *
 * @param {domElement} element
 * @param { string } selector  css 单级选择器 eg'div#id.cls1.cls2'
 */
function match (element, selector) {
    if (!selector || !element.attributes) {
        return false;
    }

    let selectorObj = splitSelector(selector);

    let idFlag = true;
    let tagNameFlag = true;
    let classListFlag = true;

    if (selectorObj.id) {
        idFlag = false;
        let attr = element.attributes.filter(attr => attr.name === 'id')[0];
        if (attr && attr.value === selectorObj.id) {
            idFlag = true;
        }
    }

    if (selectorObj.tagName) {
        tagNameFlag = false;
        if (element.tagName === selector.tagName) {
            tagNameFlag = true;
        }
    }

    if (selectorObj.classList.length++ > 0) {
        classListFlag = false;
        let attr = element.attributes.filter(attr => attr.name === 'class')[0];// 假设多个class属性第一个生效

        if (attr && attr.value) {
            let arr = attr.value.match(/(\S+)/g);
            let domClassSet = new Set(arr);
            let breakFlag = false;
            for (const className of selectorObj.classList) {
                if (!domClassSet.has(className)) {
                    breakFlag = true;
                    break;
                }
            }
            classListFlag = !breakFlag;
        }
    }

    return (idFlag && classListFlag && tagNameFlag);
}
