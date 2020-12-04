function Utf8Encoding (str) {
    // let radio = 16;// 编码显示的进制 2或者16进制可选
    let res = [];
    for (let i = 0; i < str.length; i++) {
        let codePoint = str[i].codePointAt(0);
        let ut8Buffer = null;
        let unit8 = null;
        if (codePoint < 0x80) {
            // 7
            let segTemp = 0b01111111 && codePoint;
            ut8Buffer = new ArrayBuffer(1);
            unit8 = new Uint8Array(ut8Buffer, 0, 1);
            unit8[0] = segTemp;
        } else if (codePoint < 0x0800) {
            // 5-6
            let segTemp;
            ut8Buffer = new ArrayBuffer(2);
            unit8 = new Uint8Array(ut8Buffer, 0, 2);

            // 5
            let seg5 = codePoint >> 6;
            segTemp = 0b11111 & seg5;
            unit8[0] = 0b11000000 | segTemp;

            // 6
            segTemp = 0b00111111 & codePoint;
            unit8[1] = 0b10000000 | segTemp;
        } else if (codePoint < 0x10000) {
            // 4-6-6
            let segTemp;
            ut8Buffer = new ArrayBuffer(3);
            unit8 = new Uint8Array(ut8Buffer, 0, 3);

            // 4
            let seg4 = codePoint >> 12;
            segTemp = 0b1111 & seg4;
            unit8[0] = 0b11100000 | segTemp;

            // 6
            let seg6 = codePoint >> 6;
            segTemp = 0b111111 & seg6;
            unit8[1] = 0b10000000 | segTemp;

            // 6
            segTemp = 0b111111 & codePoint;
            unit8[2] = 0b10000000 | segTemp;
        } else if (codePoint < 0x100000) {
            // 3 6 6 6

            let segTemp;
            ut8Buffer = new ArrayBuffer(4);
            unit8 = new Uint8Array(ut8Buffer, 0, 4);

            // 3
            let seg3 = codePoint >> 18;
            segTemp = 0b111 & seg3;
            unit8[0] = 0b11110000 | segTemp;

            // 6
            let seg6 = codePoint >> 12;
            segTemp = 0b111111 & seg6;
            unit8[1] = 0b10000000 | segTemp;

            // 6
            seg6 = codePoint >> 6;
            segTemp = 0b111111 & seg6;
            unit8[2] = 0b10000000 | segTemp;

            // 6
            segTemp = 0b111111 & codePoint;
            unit8[3] = 0b10000000 | segTemp;
        }
        res.push(ut8Buffer);
    }
    return res;
}
let code = Utf8Encoding('a严格');
