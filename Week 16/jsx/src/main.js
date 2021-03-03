import { Carousel } from './carousel';
import { Button } from './Button';
import { List } from './List';
import { createElement } from './framework'; // jsx需要
const images = [
    {
        img: 'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg',
        url: 'https://www.baidu.com',
        title: '蓝马'
    },
    {
        img: 'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
        url: 'https://www.baidu.com',
        title: '蓝马2'

    },
    {
        img: 'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg',
        url: 'https://www.baidu.com',
        title: '蓝马3'

    },
    {
        img: 'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg',
        url: 'https://www.baidu.com',
        title: '蓝马4'

    }
];
// let a = <Carousel src={images} onChange ={ event => console.log(event)} onClick ={event => { window.open(event.detail.data); }}/>;
// let b = <Button>c</Button>;

// a.mountTo(document.body);
// b.mountTo(document.body);

let list = <List data={images}>
    {(record) =>
        <div>
            <img src={record.img}></img>
            <a href={record.url}>{record.title}</a>
        </div>
    }
</List>;
list.mountTo(document.body);
