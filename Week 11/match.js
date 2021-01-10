/**
 * 编写一个 match 函数。它接收两个参数，第一个参数是一个选择器字符串性质，第二个是一个 HTML 元素。这个元素你可以认为它一定会在一棵 DOM 树里面。通过选择器和 DOM 元素来判断，当前的元素是否能够匹配到我们的选择器。（不能使用任何内置的浏览器的函数，仅通过 DOM 的 parent 和 children 这些 API，来判断一个元素是否能够跟一个选择器相匹配。）以下是一个调用的例子
 */

/**
  *
  * @param {str} selector
  * @param {dom} element
  */
function match (selector, element) {
    let selectorArr = selectorParser(selector);
    let index = selector.length - 1;
    if (!selector.length || selectorArr[index].type === 'combinator') {
        return false;
    }
    while (index > -1) {
        if (!element) {
            return false;
        }
        let currSelector = selectorArr[index];
        if (currSelector.type === 'simple-selector') {
            if (matchElement(currSelector, element)) {
                index--;
            }
        } else if (currSelector.type === 'combinator') {
            if (currSelector.val === ' ') {
                element = element.parentElement;
            } else if (currSelector.val === '>') {
                index--;
                currSelector = selectorArr[index - 1];

                element = element.parentElement;
                if (!matchElement(currSelector, element)) {
                    return false;
                }

                index--;// next simple selector
            } else if (currSelector.val === '+') {
                index--;
                currSelector = selectorArr[index - 1];

                element = element.previousElementSibling;
                if (!matchElement(currSelector, element)) {
                    return false;
                }

                index--;// next simple selector
            } else if (currSelector.val === '~') {
                // loop for siblings
                let tmp = element;
                let flag = false;

                index--;
                currSelector = selectorArr[index - 1];

                element = element.previousElementSibling;
                while (element) {
                    if (matchElement(currSelector, element)) {
                        flag = true;
                        break;
                    }
                    element = element.previousElementSibling;
                }
                if (flag) {
                    index--;// next simple selector
                    continue;
                }

                element = tmp;

                element = element.nextElementSibiling;
                while (element) {
                    if (matchElement(currSelector, element)) {
                        flag = true;
                        break;
                    }
                    element = element.nextElementSibiling;
                }
                if (flag) {
                    index--;// next simple selector
                    continue;
                }
            }
        }
    }

    return true;
}

/**
 *
 * @param {str} selector
 * @returns {array}
 * @description 按顺序解析出简单选择器和combinator的对象数组,使用状态机完成
 */
function selectorParser (selector) {
    let arr = [];

    // eg
    // arr = [
    //     {
    //         type: 'simple-selector',
    //         val: {
    //             tag: 'div',
    //             id: 'id',
    //             classList: ['cls1']
    //         }
    //     },
    //     {
    //         type: 'combinator',
    //         val: '>'
    //     }
    // ];

    // more code here
    return arr;
}

/**
 *
 * @param {object} simpleSelector
 * @param {dom} element
 */
function matchElement (simpleSelector, element) {
    // more code here
    return true;
}

// match('div #id.class', document.getElementById('id'));
