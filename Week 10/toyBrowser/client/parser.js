const css = require('css');
const layout = require('./layout');

const EOF = Symbol('EOF');

let currToken = null;
let currAttribute = null;
let currTextNode = null;

let stack = [{
    type: 'document',
    children: []
}];

let rules = [];
function addCssRules (text) {
    let ast = css.parse(text);
    console.log(JSON.stringify(ast, null, '    '));
    rules.push(...ast.stylesheet.rules);
}

function computeCSS (element) {
    let elements = stack.slice().reverse();// 获取父元素序列
    if (!element.computedStyle) {
        element.computedStyle = {};
    }
    for (const rule of rules) { // 只处理简单选择器
        let selectorParts = rule.selectors[0].split(' ').reverse();
        if (!match(element, selectorParts[0])) {
            continue;
        }
        let matched = false;
        let j = 1;
        for (let i = 0; i < elements.length; i++) { // winter的代码 i从0开始
            if (match(elements[i], selectorParts[j])) {
                j++;
            }
        }
        if (j >= selectorParts.length) {
            matched = true;
        }
        if (matched) {
            let sp = specificity(rule.selectors[0]);
            let computedStyle = element.computedStyle;
            for (const declaration of rule.declarations) {
                if (!computedStyle[declaration.property]) {
                    computedStyle[declaration.property] = {};
                }
                if (!computedStyle[declaration.property].specificity) {
                    computedStyle[declaration.property].value = declaration.value;
                    computedStyle[declaration.property].specificity = sp;
                } else if (compare(computedStyle[declaration.property].specificity, sp) < 0) {
                    computedStyle[declaration.property].value = declaration.value;
                    computedStyle[declaration.property].specificity = sp;
                }
            }
            console.log(element.computedStyle);
        }
    }
}

/**
 *  .a #a div,简单化了，复合的可以使用正则拆分
 */
function match (element, selector) {
    if (!selector || !element.attributes) {
        return false;
    }
    if (selector.charAt(0) === '#') {
        let attr = element.attributes.filter(attr => attr.name === 'id')[0];
        if (attr && attr.value === selector.replace('#', '')) {
            return true;
        }
    } else if (selector.charAt(0) === '.') {
        let attr = element.attributes.filter(attr => attr.name === 'class')[0];// 假设只要一个class
        if (attr && attr.value === selector.replace('.', '')) {
            return true;
        }
    } else {
        if (element.tagName === selector) {
            return true;
        }
    }
    return false;
}

function specificity (selector) {
    let p = [0, 0, 0, 0];
    let selectorParts = selector.split(' ');
    for (const part of selectorParts) {
        if (part.charAt(0) === '#') {
            p[1] += 1;
        } else if (part.charAt(0) === '.') {
            p[2] += 1;
        } else {
            p[3] += 1;
        }
    }
    return p;
}

function compare (sp1, sp2) {
    if (sp1[0] - sp2[0]) {
        return sp1[0] - sp2[0];
    }
    if (sp1[1] - sp2[1]) {
        return sp1[1] - sp2[1];
    }
    if (sp1[2] - sp2[2]) {
        return sp1[2] - sp2[2];
    }
    return sp1[3] - sp2[3];
}

function emit (token) {
    let top = stack[stack.length - 1];

    if (token.type === 'startTag') {
        let element = {
            type: 'element',
            children: [],
            attributes: []
        };
        element.tagName = token.tagName;

        for (let p in token) {
            if (p !== 'type' && p !== 'tagName' && p !== 'isSelfClosing') {
                element.attributes.push({
                    name: p,
                    value: token[p]
                });
            }
        }

        computeCSS(element);

        top.children.push(element);
        element.parent = top;

        if (!token.isSelfClosing) {
            stack.push(element);
        }
        //  else {
        //     layout(element);
        // }

        currTextNode = null;
    } else if (token.type === 'endTag') {
        if (top.tagName !== token.tagName) {
            throw new Error('Tag start end doesn\'t match');
        } else {
            // ++++++遇到style标签时候，执行添加CSS规则的操作++++++++++++ //
            if (top.tagName === 'style') { // 我们只考虑style 不考虑 link
                addCssRules(top.children[0].content);
            }
            layout(top);
            stack.pop();
        }
        currTextNode = null;
    } else if (token.type === 'text') {
        if (currTextNode === null) {
            currTextNode = {
                type: 'text',
                content: ''
            };
            top.children.push(currTextNode);
        }
        currTextNode.content += token.content;
    }
}

function data (c) {
    if (c === '<') {
        return tagOpen;
    } else if (c === EOF) {
        emit({
            type: 'EOF'
        });
    } else {
        emit({
            type: 'text',
            content: c
        });
        return data;
    }
}
function tagOpen (c) {
    if (c === '/') {
        return endTagOpen;
    } else if (c.match(/^[a-zA-Z]$/)) {
        currToken = {
            type: 'startTag',
            tagName: ''
        };
        return tagName(c);
    } else {
        ;
    }
}
function endTagOpen (c) {
    if (c.match(/^[a-zA-Z]$/)) {
        currToken = {
            type: 'endTag',
            tagName: ''
        };
        return tagName(c);
    } else if (c === '>') {
        ;// err
    } else if (c === EOF) {
        ;// err;
    } else {
        ;
    }
}
function tagName (c) {
    if (c.match(/^[\t\n\f ]$/)) { // 空格符结束
        return beforeAttributeName;
    } else if (c === '/') { // 自封闭标签
        return selfClosingStartTag;
    } else if (c.match(/^[a-zA-Z]$/)) {
        currToken.tagName += c;
        return tagName;
    } else if (c === '>') {
        emit(currToken);
        return data;
    } else {
        return tagName;
    }
}

function selfClosingStartTag (c) {
    if (c === '>') {
        currToken.isSelfClosing = true;
        emit(currToken);
        return data;
    } else if (c === EOF) {
        ;
    } else {
        ;
    }
}

function beforeAttributeName (c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if (c === '>' || c === '/' || c === EOF) {
        return afterAttributeName(c);// ??
    } else if (c === '=') {
        ;// err
    } else {
        currAttribute = {
            name: '',
            value: ''
        };
        return attributeName(c);
    }
}

function attributeName (c) {
    if (c.match(/^[\t\n\f ]$/) || c === '>' || c === '/' || c === EOF) {
        return afterAttributeName(c);
    } else if (c === '=') {
        return beforeAttributeValue;
    } else if (c === '\u0000') {
        ;
    } else if (c === '\"' || c === '\'' || c === '<') {
        ;
    } else {
        currAttribute.name += c;
        return attributeName;
    }
}

function afterAttributeName (c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return afterAttributeName;
    } else if (c === '/') {
        return selfClosingStartTag;
    } else if (c === '=') {
        return beforeAttributeValue;
    } else if (c === '>') {
        currToken[currAttribute.name] = currAttribute.value;
        emit(currToken);
        return data;
    } else if (c === EOF) {
        ;
    } else {
        currToken[currAttribute.name] = currAttribute.value;
        currAttribute = {
            name: '',
            value: ''
        };
        return attributeName(c);
    }
}

function beforeAttributeValue (c) {
    if (c.match(/^[\t\n\f ]$/) || c === '>' || c === '/' || c === EOF) {
        return beforeAttributeValue;
    } else if (c === '"') {
        return doubleQuotedAttributeValue;
    } else if (c === '\'') {
        return singleQuotedAttributeValue;
    } else if (c === '>') { // ??
        ;// err
    } else {
        return unquotedAttributeValue(c);
    }
}
function doubleQuotedAttributeValue (c) {
    if (c === '"') {
        currToken[currAttribute.name] = currAttribute.value;
        return afterQuotedAttributeValue;
    } else if (c === '\u0000') {
        ;
    } else if (c === EOF) {
        ;
    } else {
        currAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}
function singleQuotedAttributeValue (c) {
    if (c === '\'') {
        currToken[currAttribute.name] = currAttribute.value;
        return afterQuotedAttributeValue;
    } else if (c === '\u0000') {
        ;
    } else if (c === EOF) {
        ;
    } else {
        currAttribute.value += c;
        return singleQuotedAttributeValue;
    }
}
function unquotedAttributeValue (c) {
    if (c.match(/^[\t\n\f ]$/)) {
        currToken[currAttribute.name] = currAttribute.value;
        return beforeAttributeName;
    } else if (c === '/') {
        currToken[currAttribute.name] = currAttribute.value;
        return selfClosingStartTag;
    } else if (c === '>') {
        currToken[currAttribute.name] = currAttribute.value;
        emit(currToken);
        return data;
    } else if (c === '\u0000') {
        ;
    } else if (c === '\'' || c === '"' || c === '<' || c === '=' || c === '`') {
        ;
    } else if (c === EOF) {
        ;
    } else {
        currAttribute.value += c;
        return unquotedAttributeValue;
    }
}

// <div id="d"id2> id id2之间要有间距
function afterQuotedAttributeValue (c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if (c === '/') {
        return selfClosingStartTag;
    } else if (c === '>') {
        currToken[currAttribute.name] = currAttribute.value;
        emit(currToken);
        return data;
    } else if (c === EOF) {
        ;
    } else {
        currAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}

module.exports.parseHtml = function (html) {
    console.log(html);
    let state = data;
    for (const c of html) {
        state = state(c);
    }
    state = state(EOF);// 强行截止
    console.log(stack);
    return stack[0];
};
