import { Component, STATE, ATTRIBUTE } from './framework.js';
import { enableGuesture } from './guesture';
import { Timeline, Animation } from './animation';
import { ease } from './ease';

export { STATE, ATTRIBUTE } from './framework.js';

export class Carousel extends Component {
    // constructor () {
    //     super();
    // }

    render () {
        this.root = document.createElement('div');
        this.root.classList.add('carousel');
        for (const record of this[ATTRIBUTE].src) {
            let child = document.createElement('div');
            child.style.backgroundImage = `url("${record.img}")`;
            this.root.append(child);
        }

        enableGuesture(this.root);

        let timeline = new Timeline();
        timeline.start();

        let children = this.root.children;
        let handler = null;

        let duration = 3000;
        let animationDuration = 500;
        let timeerStop = false;

        this[STATE].position = 0;

        let t = 0;
        let ax = 0;
        this.root.addEventListener('start', event => {
            if (!timeerStop) { // 用于处理配置点击后不再自动timer的情况，防止每次点击产生ax错误值
                timeline.pause();
                clearInterval(handler);

                // 计算动画造成的位移
                if (Date.now() - t <= animationDuration) {
                    let progress = (Date.now() - t) / animationDuration;
                    ax = ease(progress) * 500 - 500;
                } else {
                    ax = 0;
                }

                timeerStop = true;
            } else {
                ax = 0;
            }
        });

        this.root.addEventListener('tap', event => {
            this.triggerEvent('click', { position: this[STATE].position, data: this[ATTRIBUTE].src[this[STATE].position] });
        });

        this.root.addEventListener('pan', event => {
            const width = 500;
            let x = event.clientX - event.startX - ax;
            let current = this[STATE].position - ((x - x % width) / width); // 等于Math.floor(x/width)
            for (const offset of [-1, 0, 1]) {
                let pos = current + offset;
                pos = (pos % children.length + children.length) % children.length;// 周期序列取余数保证为正的方法

                children[pos].style.transition = 'none';
                children[pos].style.transform = `translateX(${-pos * width + offset * width + x % width}px)`;
            }
        });

        this.root.addEventListener('end', event => { // 使用end防止在动画中点击不滑动
            const width = 500;

            timeline.reset();
            timeline.start();
            handler = setInterval(nextPicture, duration);
            timeerStop = false;

            let x = event.clientX - event.startX - ax;
            let current = this[STATE].position - ((x - x % width) / width); // 等于Math.floor(x/width)

            let direction = Math.round((x % width) / width); // -1,0,1

            // flick计算
            if (event.isFlick) {
                // if (event.velocity < 0) { // Animation库并没有提供方向，这个逻辑没有支撑
                //     direction = Math.ceil((x % width) / width);
                // } else {
                //     direction = Math.floor((x % width) / width);
                // }

                direction = Math.sign((x % width) / width); // leo
            }

            for (const offset of [-1, 0, 1]) {
                let pos = current + offset;
                pos = (pos % children.length + children.length) % children.length;// 周期序列取余数保证为正的方法

                children[pos].style.transition = 'none';
                timeline.add(new Animation(
                    children[pos].style,
                    'transform',
                    -pos * width + offset * width + x % width,
                    -pos * width + offset * width + direction * width,
                    animationDuration,
                    0,
                    ease,
                    v => `translateX(${v}px)`
                ));
            }

            this[STATE].position = this[STATE].position - ((x - x % width) / width) - direction;
            this[STATE].position = (this[STATE].position % children.length + children.length) % children.length;
            this.triggerEvent('change', { position: this[STATE].position });
        });

        let nextPicture = () => {
            let children = this.root.children;
            let nextIndex = ((this[STATE].position + 1) % children.length + children.length) % children.length;

            let current = children[this[STATE].position];
            let next = children[nextIndex];

            /**
             * 使用timeline css 的transition要取消
             */

            t = Date.now();

            timeline.add(new Animation(
                current.style,
                'transform',
                -this[STATE].position * 500,
                -500 - this[STATE].position * 500,
                animationDuration,
                0,
                ease,
                v => `translateX(${v}px)`
            ));

            timeline.add(new Animation(
                next.style,
                'transform',
                500 - nextIndex * 500,
                -nextIndex * 500,
                animationDuration,
                0,
                ease,
                v => `translateX(${v}px)`
            ));

            this[STATE].position = nextIndex;
            this.triggerEvent('change', { position: this[STATE].position });
        };
        handler = setInterval(nextPicture, duration);
        return this.root;

        // let children = this.root.children;
        // let position = 0;
        // const width = 500;
        // this.root.addEventListener('mousedown', event => {
        //     let children = this.root.children;
        //     let startX = event.clientX;
        //     const move = (event) => {
        //         /** clientX clientY 不受元素定位影响 */
        //         /** clientX clientY 不受元素定位影响 */

        //         // console.log('move');

        //         let x = event.clientX - startX;
        //         let current = position - ((x - x % width) / width); // 等于Math.floor(x/width)
        //         for (const offset of [-1, 0, 1]) {
        //             let pos = current + offset;
        //             console.log(pos);
        //             pos = (pos + children.length) % children.length;
        //             console.log(pos);

        //             children[pos].style.transition = 'none';
        //             children[pos].style.transform = `translateX(${-pos * width + offset * width + x % width}px)`;
        //         }
        //     };
        //     const up = (event) => {
        //         // console.log('up');

        //         let x = event.clientX - startX;
        //         position = position - Math.round(x / 500);
        //         position = (position + children.length) % children.length;// leo 防止超出范围

        //         for (const offset of [0, -Math.sign(Math.round(x / 500) - x + Math.sign(x) * 250)]) { // 判断存疑  Math.round(x / 500) - x  ->  Math.round(x / 500) - x + Math.sign(x) * 250)
        //             let pos = position + offset;
        //             pos = (pos + children.length) % children.length;

        //             children[pos].style.transition = '';
        //             children[pos].style.transform = `translateX(${-pos * width + offset * width}px)`;
        //         }

        //         document.removeEventListener('mousemove', move);
        //         document.removeEventListener('mouseup', up);
        //     };
        //     document.addEventListener('mousemove', move);
        //     document.addEventListener('mouseup', up);
        // });

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

        // return this.root;
    }
}
