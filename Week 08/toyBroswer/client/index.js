const net = require('net');
class Request {
    constructor (options) {
        this.method = options.method || 'GET';
        this.host = options.host;
        this.port = options.port || 80;
        this.path = options.path || '/';

        this.headers = options.headers || {};
        this.body = options.body || {};
        if (!this.headers['Content-Type']) {
            this.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }

        if (this.headers['Content-Type'] === 'application/json') {
            this.bodyText = JSON.stringify(this.body);
        } else if (this.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
            this.bodyText = Object.keys(this.body).map(key => {
                return `${key}=${encodeURIComponent(this.body[key])}`;
            }).join('&');
        }

        this.headers['Content-Length'] = this.bodyText.length;
    }

    send (connection) {
        return new Promise((resolve, reject) => {
            const parser = new ResponseParser();
            if (connection) {
                connection.write(this.toString());
            } else {
                connection = net.createConnection({
                    host: this.host,
                    port: this.port
                }, () => {
                    connection.write(this.toString());
                });
            }
            connection.on('data', (data) => {
                parser.recieve(data.toString());
                if (parser.isFinished) {
                    resolve(parser.string);
                    connection.end();
                }
            });
            connection.on('error', (err) => {
                reject(err);
                connection.end();
            });
        });
    }

    toString () {
        return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r
\r
${this.bodyText}`;
    }
}
class ResponseParser {
    constructor () { // 此处状态机的写法：分支（不如函数方式）
        this.WAITING_STATUS_LINE = 0;
        this.WAITING_STATUS_LINE_END = 1;
        this.WAITING_HEADER_NAME = 2;
        this.WAITING_HEADER_SPACE = 3;
        this.WAITING_HEADER_VALUE = 4;
        this.WAITING_HEADER_LINE_END = 5;
        this.WAITING_HEADER_BLOCK_END = 6;
        this.WAITING_BODY = 7;

        this.current = this.WAITING_STATUS_LINE;
        this.statusLine = '';
        this.headers = {};
        this.headerName = '';
        this.headerValue = '';
        this.bodyParser = null;
    }

    recieve (string) {
        console.log(string);
        for (let i = 0; i < string.length; i++) {
            this.recieveChar(string.charAt(i));
        }
    }

    recieveChar (char) {
        if (this.current === this.WAITING_STATUS_LINE) {
            if (char === '\r') {
                this.current = this.WAITING_STATUS_LINE_END;
            } else {
                this.statusLine += char;
            }
        } else if (this.current === this.WAITING_STATUS_LINE_END) {
            if (char === '\n') {
                this.current = this.WAITING_HEADER_NAME;
            }
        } else if (this.current === this.WAITING_HEADER_NAME) {
            if (char === ':') {
                this.current = this.WAITING_HEADER_SPACE;
            } else if (char === '\r') { // 一个空行，等待整个头部状态结束
                this.current = this.WAITING_HEADER_BLOCK_END;
                if (this.headers['Transfer-Encoding'] === 'chunk') { // 只写一个例子
                    this.bodyParser = new TrunkEDBodyParser();
                }
            } else {
                this.headerName += char;
            }
        } else if (this.current === this.WAITING_HEADER_SPACE) {
            if (char === ' ') {
                this.current = this.WAITING_HEADER_VALUE;
            }
        } else if (this.current === this.WAITING_HEADER_VALUE) {
            if (char === '\r') {
                this.current = this.WAITING_STATUS_LINE_END;
                this.headers[this.headerName] = this.headerValue;
                this.headerName = '';
                this.headerValue = '';
            } else {
                this.headerValue += char;
            }
        } else if (this.current === this.WAITING_STATUS_LINE_END) {
            if (char === '\n') {
                this.current = this.WAITING_HEADER_NAME;
            }
        } else if (this.current === this.WAITING_HEADER_BLOCK_END) {
            if (char === '\n') {
                this.current = this.WAITING_BODY;
            }
        } else if (this.current === this.WAITING_BODY) {
            this.bodyParser.recieveChar(char);
            console.log('####');
            console.log(char);
        }
    }

    get isFinished () {
        return this.bodyParser && this.bodyParser.isFinished;
    }

    get response () {
        this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\S\s]+)/);
        return {
            statusCode: RegExp.$1,
            statusText: RegExp.$2Í,
            headers: this.headers,
            body: this.bodyParser.content.join('')
        };
    }
}

/**
 *
 */
class TrunkEDBodyParser {
    constructor () {
        this.WAITING_LENGTH = 0;
        this.WAITING_LENGTH_LINE_END = 1;
        this.READING_TRUNK = 2;
        this.WAITING_NEW_LINE = 3;
        this.WAITING_NEW_LINE_END = 4;

        this.length = 0;// chunk 长度
        this.content = [];
        this.isFinished = false;
        this.current = this.WAITING_LENGTH;
    }

    recieveChar (char) {
        if (this.current === this.WAITING_LENGTH) {
            if (char === '\r') {
                if (this.length === 0) {
                    this.isFinished = true;
                }
                this.current = this.WAITING_LENGTH_LINE_END;
            } else {
                this.length *= 16;
                this.length += parseInt(char, 16);
            }
        } else if (this.current === this.WAITING_LENGTH_LINE_END) {
            if (char === '\r') {
                this.current = this.READING_TRUNK;
            }
        } else if (this.content === this.READING_TRUNK) {
            this.content.push(char);
            this.length--;
            if (this.length === 0) {
                this.current = this.WAITING_NEW_LINE;
            }
        } else if (this.current === this.WAITING_NEW_LINE) {
            if (char === '\r') {
                this.content = this.WAITING_NEW_LINE_END;
            }
        } else if (this.current === this.WAITING_NEW_LINE_END) {
            if (char === '\n') {
                this.content = this.WAITING_LENGTH;
            }
        }
    }
}

(async function () {
    let request = new Request({
        method: 'POST',
        host: '127.0.0.1',
        path: '/',
        port: 8080,
        headers: {
            'X-FOO2': 'customed'
            // 'Content-Type': 'application/json'
        },
        body: {
            name: 'winter'
        }

    });
    let response = await request.send();
}());
