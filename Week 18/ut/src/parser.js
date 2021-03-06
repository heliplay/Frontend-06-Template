const EOF = Symbol('EOF')
let currToken = null
let currAttribute = null
let currTextNode = null
const stack = [{
    type: 'document',
    children: []
}]

function emit (token) {
    const top = stack[stack.length - 1]

    if (token.type === 'startTag') {
        const element = {
            type: 'element',
            children: [],
            attributes: []
        }
        element.tagName = token.tagName

        for (const p in token) {
            if (p !== 'type' && p !== 'tagName' && p !== 'isSelfClosing') {
                element.attributes.push({
                    name: p,
                    value: token[p]
                })
            }
        }

        // computeCSS(element)

        top.children.push(element)
        element.parent = top

        if (!token.isSelfClosing) {
            element.isSelfClosing = true
            stack.push(element)
        }

        currTextNode = null
    } else if (token.type === 'endTag') {
        if (top.tagName !== token.tagName) {
            throw new Error('Tag start end doesn\'t match')
        } else {
            // ++++++遇到style标签时候，执行添加CSS规则的操作++++++++++++ //
            // if (top.tagName === 'style') { // 我们只考虑style 不考虑 link
            //     addCssRules(top.children[0].content)
            // }
            stack.pop()
        }
        currTextNode = null
    } else if (token.type === 'text') {
        if (currTextNode === null) {
            currTextNode = {
                type: 'text',
                content: ''
            }
            top.children.push(currTextNode)
        }
        currTextNode.content += token.content
    }
}

function data (c) {
    if (c === '<') {
        return tagOpen
    } else if (c === EOF) {
        emit({
            type: 'EOF'
        })
    } else {
        emit({
            type: 'text',
            content: c
        })
        return data
    }
}
function tagOpen (c) {
    if (c === '/') {
        return endTagOpen
    } else if (c.match(/^[a-zA-Z]$/)) {
        currToken = {
            type: 'startTag',
            tagName: ''
        }
        return tagName(c)
    } else {
        return data
    }
}
function endTagOpen (c) {
    if (c.match(/^[a-zA-Z]$/)) {
        currToken = {
            type: 'endTag',
            tagName: ''
        }
        return tagName(c)
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
        return beforeAttributeName
    } else if (c === '/') { // 自封闭标签
        return selfClosingStartTag
    } else if (c.match(/^[a-zA-Z]$/)) {
        currToken.tagName += c
        return tagName
    } else if (c === '>') {
        emit(currToken)
        return data
    } else {
        return tagName// err
    }
}

function selfClosingStartTag (c) {
    if (c === '>') {
        currToken.isSelfClosing = true
        emit(currToken)
        return data
    } else if (c === EOF) {
        ;
    } else {
        return selfClosingStartTag
    }
}

function beforeAttributeName (c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName
    } else if (c === '>' || c === '/' || c === EOF) {
        return afterAttributeName(c)// ??
    } else if (c === '=') {
        ;// err
    } else {
        currAttribute = {
            name: '',
            value: ''
        }
        return attributeName(c)
    }
}

function attributeName (c) {
    if (c.match(/^[\t\n\f ]$/) || c === '>' || c === '/' || c === EOF) {
        return afterAttributeName(c)
    } else if (c === '=') {
        return beforeAttributeValue
    } else if (c === '\u0000') {
        ;
    } else if (c === '"' || c === '\'' || c === '<') {
        ;
    } else {
        currAttribute.name += c
        return attributeName
    }
}

function afterAttributeName (c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return afterAttributeName
    } else if (c === '/') {
        return selfClosingStartTag
    } else if (c === '=') {
        return beforeAttributeValue
    } else if (c === '>') {
        currToken[currAttribute.name] = currAttribute.value
        emit(currToken)
        return data
    } else if (c === EOF) {
        ;
    } else {
        currToken[currAttribute.name] = currAttribute.value
        currAttribute = {
            name: '',
            value: ''
        }
        return attributeName(c)
    }
}

function beforeAttributeValue (c) {
    if (c.match(/^[\t\n\f ]$/) || c === '>' || c === '/' || c === EOF) {
        return beforeAttributeValue
    } else if (c === '"') {
        return doubleQuotedAttributeValue
    } else if (c === '\'') {
        return singleQuotedAttributeValue
    } else if (c === '>') { // ??
        ;// err
    } else {
        return unquotedAttributeValue(c)
    }
}
function doubleQuotedAttributeValue (c) {
    if (c === '"') {
        currToken[currAttribute.name] = currAttribute.value
        return afterQuotedAttributeValue
    } else if (c === '\u0000') {
        ;
    } else if (c === EOF) {
        ;
    } else {
        currAttribute.value += c
        return doubleQuotedAttributeValue
    }
}
function singleQuotedAttributeValue (c) {
    if (c === '\'') {
        currToken[currAttribute.name] = currAttribute.value
        return afterQuotedAttributeValue
    } else if (c === '\u0000') {
        ;
    } else if (c === EOF) {
        ;
    } else {
        currAttribute.value += c
        return singleQuotedAttributeValue
    }
}
function unquotedAttributeValue (c) {
    if (c.match(/^[\t\n\f ]$/)) {
        currToken[currAttribute.name] = currAttribute.value
        return beforeAttributeName
    } else if (c === '/') {
        currToken[currAttribute.name] = currAttribute.value
        return selfClosingStartTag
    } else if (c === '>') {
        currToken[currAttribute.name] = currAttribute.value
        emit(currToken)
        return data
    } else if (c === '\u0000') {
        ;
    } else if (c === '\'' || c === '"' || c === '<' || c === '=' || c === '`') {
        ;
    } else if (c === EOF) {
        ;
    } else {
        currAttribute.value += c
        return unquotedAttributeValue
    }
}

// <div id="d"id2> id id2之间要有间距
function afterQuotedAttributeValue (c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName
    } else if (c === '/') {
        return selfClosingStartTag
    } else if (c === '>') {
        currToken[currAttribute.name] = currAttribute.value
        emit(currToken)
        return data
    } else if (c === EOF) {
        ;
    } else {
        throw new Error('unexpected character' + `"${c}"`)
        // currAttribute.value += c
        // return doubleQuotedAttributeValue
    }
}

export function parseHtml (html) {
    stack[0].children = []
    currToken = null
    currAttribute = null
    currTextNode = null
    let state = data
    for (const c of html) {
        state = state(c)
    }
    state = state(EOF)// 强行截止
    return stack[0]
}
