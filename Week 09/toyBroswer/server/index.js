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
        response.end(`<html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Document</title>
            <style>
                img{
                    color:red;
                }
                #testid{
                    color:blue;
                }
            </style>
        </head>
        <body>
            <div>
                <img src="" alt="" id="testid" />
                <img />
            </div>
        </body>
        </html>`);
    });
}).listen(8080);
console.log(s);
console.log('server started at port:8080');
