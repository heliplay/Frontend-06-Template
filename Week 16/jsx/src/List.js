import { Component, STATE, ATTRIBUTE, createElement } from './framework.js';

export class List extends Component {
    constructor () {
        super();
        ;
    }

    render () {
        this.children = this[ATTRIBUTE].data.map(this.template);
        this.root = (<div>{this.children}</div>).render();
        return this.root;
    }

    appendChild (child) { // 将函数存起来
        this.template = child;
        // this.render();//或者主动渲染
    }
}
