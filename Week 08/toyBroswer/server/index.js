const http = require('http');
const s = http.createServer((request, response) => {
    let body = [];
    request.on('error', (err) => {
        console.log('error');
        console.error(err);
    });
    request.on('data', (chunk) => {
        console.log('data');
        body.push(chunk);
    });
    request.on('end', () => {
        console.log('end');
        console.log(body);
        body = Buffer.concat(body).toString();
        console.log('body:', body);
        response.writeHead('200', { 'Content-Type': 'text/html' });
        response.end('Hello World');
    });
}).listen(8080);
console.log(s);
console.log('server started at port:8080');
