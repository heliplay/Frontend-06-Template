function string2Number (str) {
    if (!str) {
        throw new Error('Please pass an legal argument');
    }

    str = str.toLowerCase().trim();

    let regExp = /^(\+|\-)?(?:(0b[0-1]+)|(0o[0-7]+)|(0x[0-9a-f]+)|(\.\d+|\d+\.\d*)(e\d+)?)$/g;
    let res = regExp.exec(str);

    if (!res) {
        throw new Error('Please insert a legal number literal');
    }

    let val = 0;
    let radix = null;// 进制
    let ex = 1; // 幂
    let intPart = null;
    let fractionPart = null;
    let type = 0;
    let sign = res[1] === '-' ? -1 : 1;
    if (res[2]) {
        // 二进制
        radix = 2;
        intPart = res[2].split('0b')[1];
    } else if (res[3]) {
        // 八进制
        radix = 8;
        intPart = res[3].split('0o')[1];
    } else if (res[4]) {
        // 十六进制
        radix = 16;
        intPart = res[4].split('0x')[1];
    } else if (res[5]) {
        // 十进制
        type = 1;
        radix = 10;
        let tmp = res[5].split('.');
        intPart = tmp[0] || '';
        fractionPart = tmp[1] || '';
        if (res[6]) {
            ex = 10 ** (res[6].split('e')[1]);
        }
    } else {
        return;
    }

    // 二进制、八进制、十进制、十六进制的整数部分处理
    for (let i = intPart.length - 1; i >= 0; i--) {
        const digit = intPart[i];
        val += digit * radix ** (intPart.length - 1 - i);
    }

    // 十进制处理小数点和幂处理
    if (type === 1) {
        let fractionVal = 0;
        for (let i = 0; i < fractionPart.length; i++) {
            const digit = fractionPart[i];
            fractionVal += digit * radix ** (-i - 1);
        }
        val += fractionVal;
        val *= ex;
    }
    return sign * val;
}

console.log(string2Number('-0b11101'));
console.log(string2Number('0o3247'));
