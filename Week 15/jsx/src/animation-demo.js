import { Timeline, Animation } from './animation';
import { ease, easeIn, easeInOut, easeOut } from './timing';

let tl = new Timeline();
tl.start();

tl.add(new Animation(document.querySelector('#el').style, 'transform', 0, 500, 3000, 0, easeInOut, v => `translateX(${v}px)`));

document.querySelector('#pause-btn').addEventListener('click', () => {
    tl.pause();
});

document.querySelector('#resume-btn').addEventListener('click', () => {
    tl.resume();
});
