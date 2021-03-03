export function createElement (type, attributes, ...children) {
    console.log(type, children);
    let element;
    if (typeof type === 'string') {
        element = new ElementWrapper(type);
    } else {
        // eslint-disable-next-line
        element = new type;
    }
    for (const name in attributes) {
        element.setAttribute(name, attributes[name]);
    }

    let processChildren = (children) => {
        for (const child of children) {
            if (typeof child === 'object' && (child instanceof Array)) { // 处理List 类型的情况，或者直接在私有的render里面处理，等同于自定义存放位置，只不过存放的内容是迭代生成的
                processChildren(child);
                continue;
            }
            let appendChild = child;
            if (typeof child === 'string') {
                appendChild = new TextWrapper(child);
            }
            element.appendChild(appendChild);
        }
    };
    processChildren(children);

    return element;
}

export const STATE = Symbol('state');
export const ATTRIBUTE = Symbol('attribute');

export class Component {
    constructor (type) {
        this[ATTRIBUTE] = Object.create(null);
        this[STATE] = Object.create(null);
    }

    appendChild (child) {
        child.mountTo(this.root);
    }

    setAttribute (name, value) {
        this[ATTRIBUTE][name] = value;
    }

    mountTo (parent) {
        if (!this.root) {
            this.render();
        }
        parent.appendChild(this.root);
    }

    triggerEvent (type, args) {
        type = type.replace(/^[\s\S]/, s => s.toUpperCase());
        console.log(type, args);
        this[ATTRIBUTE]['on' + type](new CustomEvent(type, { detail: args }));
    }

    render () {
        return this.root;
    }// 默认添加
}

class TextWrapper extends Component {
    constructor (content) {
        super();
        this.root = document.createTextNode(content);
    }
}

class ElementWrapper extends Component {
    constructor (type) {
        super();
        this.root = document.createElement(type);
    }

    setAttribute (name, value) {
        this.root.setAttribute(name, value);
    }
}
