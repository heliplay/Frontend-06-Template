import { Component } from './framework.js';

export class Carousel extends Component {
    constructor () {
        super();
        this.attributes = Object.create(null);
    }

    setAttribute (name, value) {
        this.attributes[name] = value;
    }

    render () {
        this.root = document.createElement('div');
        this.root.classList.add('carousel');
        for (const record of this.attributes.src) {
            let child = document.createElement('div');
            child.style.backgroundImage = `url("${record}")`;
            this.root.append(child);
        }

        let position = 0;
        const width = 500;
        this.root.addEventListener('mousedown', event => {
            let children = this.root.children;
            let startX = event.clientX;
            const move = (event) => {
                /** clientX clientY 不受元素定位影响 */
                /** clientX clientY 不受元素定位影响 */

                // console.log('move');

                let x = event.clientX - startX;
                let current = position - ((x - x % width) / width); // 等于Math.floor(x/width)
                for (const offset of [-1, 0, 1]) {
                    let pos = current + offset;
                    console.log(pos);
                    pos = (pos + children.length) % children.length;
                    console.log(pos);

                    children[pos].style.transition = 'none';
                    children[pos].style.transform = `translateX(${-pos * width + offset * width + x % width}px)`;
                }
            };
            const up = (event) => {
                // console.log('up');

                let x = event.clientX - startX;
                position = position - Math.round(x / 500);
                position = (position + children.length) % children.length;// leo 防止超出范围

                for (const offset of [0, -Math.sign(Math.round(x / 500) - x + Math.sign(x) * 250)]) { // 判断存疑  Math.round(x / 500) - x  ->  Math.round(x / 500) - x + Math.sign(x) * 250)
                    let pos = position + offset;
                    pos = (pos + children.length) % children.length;

                    children[pos].style.transition = '';
                    children[pos].style.transform = `translateX(${-pos * width + offset * width}px)`;
                }

                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', up);
            };
            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', up);
        });

        /** pointer play */

        /** ------auto play start------ */
        // let currentIndex = 0;
        // let direction = -1;
        // let duration = 3000;
        // setInterval(() => {
        //     let children = this.root.children;
        //     let nextIndex = (currentIndex + 1) % children.length;

        //     let current = children[currentIndex];
        //     let next = children[nextIndex];

        //     next.style.transition = 'none';
        //     next.style.transform = `translateX(${direction * (nextIndex - 1) * 100}%)`;

        //     setTimeout(() => {
        //         next.style.transition = '';
        //         current.style.transform = `translateX(${direction * (currentIndex + 1) * 100}%)`;
        //         next.style.transform = `translateX(${direction * nextIndex * 100}%)`;

        //         currentIndex = nextIndex;
        //     }, 16);
        // }, duration);
        /** -------auto play end------- */

        return this.root;
    }

    mountTo (parent) {
        parent.appendChild(this.render());
    }
}
