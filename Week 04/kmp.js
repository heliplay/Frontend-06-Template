function kmp (source, pattern) {
    // 计算table
    let table = new Array(pattern.length).fill(0);

    {
        let i = 1;
        let j = 0;// 匹配头下标
        while (i < pattern.length) {
            if (pattern[i] === pattern[j]) {
                i++;
                j++;
                table[i] = j;
            } else {
                if (j > 0) { j = table[j]; } else { i++; }
            }
        }
    }

    // 匹配
    {
        let i = 0;
        let j = 0;// pattern的下标
        let index = -1;
        while (i < source.length) {
            if (source[i] === pattern[j]) {
                i++;
                j++;
            } else {
                if (j > 0) { j = table[j]; } else { i++; }
            }

            // pattern匹配结束
            if (j === pattern.length) {
                index = i - pattern.length;
                break;
            }
        }
        return index;
    }
}
