function Utf8Encoding (str) {
    let radio = 16;// 编码显示的进制 2或者16进制可选
    let res = [];
    for (let i = 0; i < str.length; i++) {
        let codePoint = str[i].codePointAt(0);
        let utf8 = [];
        if (codePoint < 0x80) {
            // 7
            let segTemp = 0b01111111 && codePoint;
            utf8.push(segTemp.toString(radio));
        } else if (codePoint < 0x0800) {
            // 5-6
            let segTemp;

            // 5
            let seg5 = codePoint >> 6;
            segTemp = 0b11111 & seg5;
            utf8.push((0b11000000 | segTemp).toString(radio));

            // 6
            segTemp = 0b00111111 & codePoint;
            utf8.push((0b10000000 | segTemp).toString(radio));
        } else if (codePoint < 0x10000) {
            // 4-6-6
            let segTemp;

            // 4
            let seg4 = codePoint >> 12;
            segTemp = 0b1111 & seg4;
            utf8.push((0b11100000 | segTemp).toString(radio));

            // 6
            let seg6 = codePoint >> 6;
            segTemp = 0b111111 & seg6;
            utf8.push((0b10000000 | segTemp).toString(radio));

            // 6
            segTemp = 0b111111 & codePoint;
            utf8.push((0b10000000 | segTemp).toString(radio));
        } else if (codePoint < 0x100000) {
            // 3 6 6 6

            let segTemp;

            // 4
            let seg3 = codePoint >> 18;
            segTemp = 0b111 & seg3;
            utf8.push((0b11110000 | segTemp).toString(radio));

            // 6
            let seg6 = codePoint >> 12;
            segTemp = 0b111111 & seg6;
            utf8.push((0b10000000 | segTemp).toString(radio));

            // 6
            seg6 = codePoint >> 6;
            segTemp = 0b111111 & seg6;
            utf8.push((0b10000000 | segTemp).toString(radio));

            // 6
            segTemp = 0b111111 & codePoint;
            utf8.push((0b10000000 | segTemp).toString(radio));
        }
        res.push(utf8);
    }
    return res;
}
console.log(Utf8Encoding('a严格'));
