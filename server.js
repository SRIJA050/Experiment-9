const http = require('http');
const os = require('os');
const path = require('path');
const EventEmitter = require('events');

// Create custom event emitter
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

// Request handler
const requestHandler = (req, res) => {

    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Hello, World!\n');

    } else if (req.url === '/info') {

        const info = {
            hostname: os.hostname(),
            platform: os.platform(),
            homedir: os.homedir(),
            currentFile: __filename,
            currentDirectory: __dirname,
            fileName: path.basename(__filename),
            extension: path.extname(__filename)
        };

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(info, null, 2));

    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found\n');
    }

    // Trigger events
    myEmitter.emit('requestHandled', req.url);
    myEmitter.emit('customEvent', { message: 'Hello from custom event!' });
};

// Create server
const server = http.createServer(requestHandler);

// Start server
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

// Event listeners
myEmitter.on('requestHandled', (url) => {
    console.log(`A request was made to: ${url}`);
});

myEmitter.on('customEvent', (data) => {
    console.log(`Custom Event Triggered: ${JSON.stringify(data)}`);
});
