/**
 * wildcard find
 */
function find (source, pattern) {
    const STAR = '*';
    const QUESTION = '?';
    let starCount = 0;
    for (let i = 0; i < pattern.length; i++) {
        if (pattern[i] === STAR) {
            starCount++;
        }
    }

    // 如果没有 “*”
    if (starCount === 0) {
        for (let i = 0; i < pattern.length; i++) {
            if (pattern[i] !== source[i] && pattern[i] !== QUESTION) {
                return false;
            }
        }
        return true;
    }

    // pattern index
    let i = 0;

    // source index
    let lastIndex = 0;

    // Before first *
    for (i = 0; pattern[i] !== STAR; i++) {
        if (pattern[i] !== source[i] && pattern[i] !== QUESTION) {
            return false;
        }
    }

    lastIndex = i;

    // *<SubPattern>
    for (let p = 0; p < starCount - 1; p++) {
        i++;
        let subPattern = '';
        while (pattern[i] !== STAR) {
            subPattern += pattern[i];
            i++;
        }
        let reg = new RegExp(subPattern.replace(/\?/g, '[\\s\\S]'), 'g');
        reg.lastIndex = lastIndex;
        if (!reg.exec(source)) {
            return false;
        }
        lastIndex = reg.lastIndex;
    }

    // the last <SubPattern>
    for (let j = 0; j < source.length - lastIndex && pattern[pattern.length - j - 1] !== STAR; j++) {
        if (pattern[pattern.length - j - 1] !== source[source.length - j - 1] && pattern[pattern.length - j - 1] !== QUESTION) {
            return false;
        }
    }
    return true;
}
console.log(find('abcabcabxaac', 'a*b?*b?x*c'));
