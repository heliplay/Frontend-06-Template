import { Component, STATE, ATTRIBUTE, createElement } from './framework.js';

export class Button extends Component {
    constructor () {
        super();
        ;
    }

    render () { // 意义在于可以自定义内容型child的存放位置
        this.childContainer = (<span></span>);
        this.root = (<div>{this.childContainer}</div>).render();
        return this.root;
    }

    appendChild (child) {
        if (!this.childContainer) {
            this.render();
        }
        this.childContainer.appendChild(child);
    }
}
