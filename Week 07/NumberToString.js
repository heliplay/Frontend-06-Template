function number2String (num, radix = 10) {
    if (isNaN(num)) {
        throw new TypeError('Passed Num is a NaN');
    }
    let exponent = null;
    if (radix === 2) {
        exponent = 2;
    } else if (radix === 8) {
        exponent = 8;
    } else if (radix === 10) {
        exponent = 10;
    } else if (radix === 16) {
        exponent = 16;
    } else {
        throw new Error('Radix  is an option of [2,8,10,16]');
    }

    let int = null;
    let fraction = null;
    let sign = num > 0 ? '' : '-';
    let absNum = Math.abs(num);

    // 整数部分
    int = Math.floor(absNum / (exponent ** 0));
    // let copyInt = int;

    // 小数部分
    fraction = absNum - int;

    let intStr = '';
    while (int !== 0) {
        let res = int % (exponent);
        intStr = '' + res + intStr;
        int = Math.floor(int / exponent);
    }

    let fractionStr = '';
    let ex = -1;
    while (fraction > Number.EPSILON) {
        let res = Math.floor(fraction / (exponent ** ex));
        fractionStr += res;

        // 暂时没有方法消除误差的影响
        // if (absNum - (copyInt + fractionStr * (exponent ** ex)) < Number.EPSILON) {
        //     break;
        // }
        fraction = fraction - res * (exponent ** ex);
        ex--;
    }
    return fractionStr ? `${sign}${intStr}.${fractionStr}` : `${sign}${intStr}`;
}

number2String(33.33, 4);
