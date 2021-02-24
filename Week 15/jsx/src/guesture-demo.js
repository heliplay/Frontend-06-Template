import { enableGuesture } from './guesture'
;
enableGuesture(document.documentElement);
document.documentElement.addEventListener('panend', function () {
    console.log('panend');
});
