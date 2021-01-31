export function createElement (type, attributes, ...children) {
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
    for (const child of children) {
        let appendChild = child;
        if (typeof child === 'string') {
            appendChild = new TextWrapper(child);
        }
        element.appendChild(appendChild);
    }

    return element;
}

export class Component {
    // constructor (type) {
    // }

    render () {
        return document.createElement('div');
    }

    appendChild (child) {
        child.mountTo(this.root);
    }

    setAttribute (name, value) {
        this.root.setAttribute(name, value);
    }

    mountTo (parent) {
        parent.appendChild(this.root);
    }
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
}
