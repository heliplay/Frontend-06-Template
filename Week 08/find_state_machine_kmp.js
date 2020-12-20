/**
 * @description Find ${pattern} in a string，模拟kmp算法
 * @param {string} str
 * @param {string} pattern
 * @return {boolean}
 */
function match (str, pattern) {
    let preRepeats = new Array(pattern.length).fill(0);

    // 计算 preRepeats
    {
        let i = 1;
        let j = 0;// 匹配头下标
        while (i < pattern.length) {
            if (pattern[i] === pattern[j]) {
                i++;
                j++;
                preRepeats[i] = j;
            } else {
                if (j > 0) { j = preRepeats[j]; } else { i++; }
            }
        }
    }

    // 准备有序的状态机
    function end () { // 陷进状态机
        return end;
    }
    let stateList = [];
    for (let i = 0; i < pattern.length; i++) {
        let char = pattern[i];
        let stateMachine = null;

        if (i === 0) {
            // 开始状态机
            stateMachine = function start (c) {
                if (c === char) {
                    return stateList[1];
                } else {
                    return start;
                }
            };
        } else if (i === pattern.length - 1) {
            // 尾部状态机器
            stateMachine = function (c) {
                if (c === char) {
                    return end;
                } else {
                    return stateList[preRepeats[i]](c);
                }
            };
        } else {
            stateMachine = function (c) {
                if (c === char) {
                    return stateList[i + 1];
                } else {
                    return stateList[preRepeats[i]](c);
                }
            };
        }
        stateList.push(stateMachine);
    }

    //  查找
    let state = stateList[0];
    for (const c of str) {
        state = state(c);
    }
    return state === end;
}

// debugger;
console.log(match('ababababababx', 'abababx'));
