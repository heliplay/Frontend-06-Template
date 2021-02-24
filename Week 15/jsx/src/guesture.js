// listen => recongnize => dispatch

// new Listener(new Recognizer(dispatch))

class Dispatcher {
    constructor (element) {
        this.element = element;
    }

    dispatch (type, properties) {
        // let event = new CustomEvent();
        let event = new Event(type);
        for (const name in properties) {
            event[name] = properties[name];
        }
        this.element.dispatchEvent(event);
    }
}

export class Listener {
    constructor (element, recognizer) {
        let isListeningMouse = false;

        let contexts = new Map();

        element.addEventListener('mousedown', event => {
            // console.log(event.button); 区分按键

            let context = Object.create(null);
            contexts.set('mouse' + (1 << event.button), context);

            recognizer.start(event, context);

            let mousemove = event => {
                // event.clientX, event.clientY
                // more code here
                // event.buttons 0b00000 掩码形式

                let button = 1;// 涉及到掩码的通用处理方式
                while (button <= event.buttons) {
                    if (button & event.buttons) {
                        // order of buttons & button property is not the same
                        let key;
                        if (button === 2) {
                            key = 4;
                        } else if (button === 4) {
                            key = 2;
                        } else {
                            key = button;
                        }
                        let context = contexts.get('mouse' + key);
                        recognizer.move(event, context);
                    }
                    button = button << 1;
                }
            };

            let mouseup = event => {
                let context = contexts.get('mouse' + (1 << event.button));
                recognizer.end(event, context);
                contexts.delete('mouse' + (1 << event.button));

                if (event.buttons === 0) { // 已经防止多个按键按下多次绑定事件了，所以移除事件要等最后一个按键
                    document.removeEventListener('mousemove', mousemove);
                    document.removeEventListener('mouseup', mouseup);
                    isListeningMouse = false;
                }
            };

            if (!isListeningMouse) { // 防止多个按键按下多次绑定事件
                document.addEventListener('mousemove', mousemove);
                document.addEventListener('mouseup', mouseup);
                isListeningMouse = true;
            }
        });

        // touchmove touchend不会单独触发
        // event.changedTouches  .clientX
        element.addEventListener('touchstart', event => {
            for (const touch of event.changedTouches) {
                let context = Object.create(null);
                contexts.set(touch.identifier, context);
                recognizer.start(touch, context);
            }
        });

        element.addEventListener('touchmove', event => {
            for (const touch of event.changedTouches) {
                let context = contexts.get(touch.identifier);
                recognizer.move(touch, context);
            }
        });

        element.addEventListener('touchend', event => {
            for (const touch of event.changedTouches) {
                let context = contexts.get(touch.identifier);
                recognizer.end(touch, context);
                contexts.delete(touch.identifier);
            }
        });

        // 被外部系统打断，如 alert,app的切换
        element.addEventListener('touchcancel', event => {
            for (const touch of event.changedTouches) {
                let context = contexts.get(touch.identifier);
                recognizer.cancel(touch, context);
                contexts.delete(touch.identifier);
            }
        });
    }
}

export class Recognizer {
    constructor (dispatcher) {
        this.dispatcher = dispatcher;
    }

    start (point, context) {
        // console.log('start', point.clientX);

        context.startX = point.clientX;
        context.startY = point.clientY;

        context.points = [
            {
                t: Date.now(),
                x: point.clientX,
                y: point.clientY
            }
        ];

        context.isPan = false;
        context.isTap = true;
        context.isPress = false;
        context.handler = setTimeout(() => {
            context.isPan = false;
            context.isTap = false;
            context.isPress = true;
            context.handler = null;
            this.dispatcher.dispatch('press', {});
        }, 500);
    };

    move (point, context) {
        // console.log('move', point.clientX);

        let dx = point.clientX - context.startX;
        let dy = point.clientY - context.startY;

        if (!context.isPan && dx ** 2 + dy ** 2 > 100) { // 移动了10px
            context.isPan = true;
            context.isTap = false;
            context.isPress = false;
            context.isVertical = Math.abs(dx) < Math.abs(dy);
            this.dispatcher.dispatch('panstart', {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical
            });
            clearTimeout(context.handler);
        }

        if (context.isPan) {
            this.dispatcher.dispatch('pan', {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical
            });
        }

        context.points = context.points.filter(point =>
            Date.now() - point.t < 500 // 最后500毫秒的值
        );
        context.points.push({
            t: Date.now(),
            x: point.clientX,
            y: point.clientY
        });
    };

    end (point, context) {
        // console.log('end', point.clientX);

        if (context.isTap) {
            this.dispatcher.dispatch('tap', {});
            clearTimeout(context.handler);
        }

        if (context.isPress) {
            this.dispatcher.dispatch('pressend', {});
        }

        context.points = context.points.filter(point =>
            Date.now() - point.t < 500 // 最后500毫秒的值
        );

        let v = 0;
        if (context.points.length > 0) {
            let d = Math.sqrt((point.clientX - context.points[0].x) ** 2 + (point.clientY - context.points[0].y) ** 2);
            v = d / (Date.now() - context.points[0].t);
        }
        const speedThreshold = 1.5; // 像素/ms
        if (v > speedThreshold) {
            context.isFlick = true;
            this.dispatcher.dispatch('flick', {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical,
                isFlick: context.isFlick,
                velocity: v
            });
        } else {
            context.isFlick = false;
        }

        if (context.isPan) {
            this.dispatcher.dispatch('panend', {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical,
                isFlick: context.isFlick
            });
        }
    };

    cancel (point, context) {
        // console.log('cancel', point.clientX);

        this.dispatcher.dispatch('cancel', {});
        clearTimeout(context.handler);
    };
}

export function enableGuesture (element) {
    let l1 = new Listener(
        element,
        new Recognizer(new Dispatcher(element))
    );
}
