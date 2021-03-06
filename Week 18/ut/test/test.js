import { parseHtml } from '../src/parser.js'
const assert = require('assert')

describe('Parse html:', function () {
    const htmlString = [
        '<a></a>',
        '<a href="https://www.baidu.com">baidu</a>',
        '<span id="test" class="anchor"><a href="https://www.baidu.com">baidu</a></span><image src="http://www.baidu.com2" />',
        '<a href id></a>',
        '<a  id=5  class=\'anchor\' name="anchor"></a>',
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
        '<image src="http://www.baidu.com"id>',
        '<a></span>',
        '<a/>',
        '< a id = "test"   / >',
        '<a / >',
        '<image id=5/>',
        '<a id=5></a>',
        '<a id="5"></a>',
        '<image id="5"/>',
        '<a id =><>',
        '<a5>',
        '<a></>'

    ]
    it(htmlString[0], function () {
        const tree = parseHtml(htmlString[0])
        // console.log(tree)
        assert.strictEqual(tree.children[0].tagName, 'a')
        assert.strictEqual(tree.children[0].children.length, 0)
    })

    it(htmlString[1], function () {
        const tree = parseHtml(htmlString[1])
        assert.strictEqual(tree.children[0].tagName, 'a')
        assert.strictEqual(tree.children[0].attributes[0].value, 'https://www.baidu.com')
        assert.strictEqual(tree.children[0].children.length, 1)
    })

    it(htmlString[2], function () {
        const tree = parseHtml(htmlString[2])
        console.log(tree)
        assert.strictEqual(tree.children.length, 2)
        assert.strictEqual(tree.children[0].tagName, 'span')
        assert.strictEqual(tree.children[0].children[0].attributes[0].value, 'https://www.baidu.com')
        assert.strictEqual(tree.children[1].attributes[0].value, 'http://www.baidu.com2')
    })

    it(htmlString[3], function () {
        const tree = parseHtml(htmlString[3])
        assert.strictEqual(tree.children[0].children.length, 0)
        assert.strictEqual(tree.children[0].tagName, 'a')
        assert.strictEqual(tree.children[0].attributes.length, 2)
    })

    it(htmlString[4], function () {
        const tree = parseHtml(htmlString[4])
        assert.strictEqual(tree.children[0].children.length, 0)
        assert.strictEqual(tree.children[0].tagName, 'a')
        assert.strictEqual(tree.children[0].attributes.length, 3)
    })

    it(htmlString[5], function () {
        const tree = parseHtml(htmlString[5])
        console.log(tree.children[0].attributes)
        assert.strictEqual(tree.children[0].children.length, 0)
        assert.strictEqual(tree.children[0].tagName, 'meta')
        assert.strictEqual(tree.children[0].isSelfClosing, true)
        assert.strictEqual(tree.children[0].attributes.length, 2)
    })

    it(htmlString[6], function () {
        const tree = parseHtml(htmlString[6])
        console.log(tree.children[0].attributes)
    })

    it(htmlString[7], function () {
        const tree = parseHtml(htmlString[7])
        console.log(tree.children[0].attributes)
    })
    it(htmlString[8], function () {
        const tree = parseHtml(htmlString[8])
    })
    it(htmlString[9], function () {
        const tree = parseHtml(htmlString[9])
    })

    it(htmlString[10], function () {
        const tree = parseHtml(htmlString[10])
    })

    it(htmlString[11], function () {
        const tree = parseHtml(htmlString[11])
    })

    it(htmlString[12], function () {
        const tree = parseHtml(htmlString[12])
    })

    it(htmlString[13], function () {
        const tree = parseHtml(htmlString[13])
    })

    it(htmlString[14], function () {
        const tree = parseHtml(htmlString[14])
    })

    it(htmlString[15], function () {
        const tree = parseHtml(htmlString[15])
    })

    it(htmlString[16], function () {
        const tree = parseHtml(htmlString[16])
    })

    it(htmlString[17], function () {
        const tree = parseHtml(htmlString[17])
    })
})
