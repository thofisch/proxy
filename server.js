const httpProxy = require('http-proxy');
const process = require('process');

// config from environment or sensible defaults
const PORT = process.env.PORT || 5000;
const TARGET = process.env.TARGET || 'https://api.dfds.cloud/crm-service/api';

var proxy = httpProxy.createServer({
    target: TARGET,
    changeOrigin: true
});

proxy.on('error', function (err, req, res) {
    res.writeHead(500, {
        'Content-Type': 'text/plain'
    });

    res.end('Oops, something went wrong.');

    console.log(JSON.stringify(err, true, 2));
});

proxy.on('proxyReq', function (proxyReq, req, res) {
    console.log(`-> ${req.method} ${req.url}`);
    console.log('   ' + JSON.stringify(req.headers, false, 0));
    console.log(`=> ${proxyReq.method} ${proxyReq.path}`);
});

proxy.on('proxyRes', function (proxyRes, req, res) {
    console.log(`<- ${proxyRes.statusCode} ${proxyRes.statusMessage}`)
    console.log('   ' + JSON.stringify(proxyRes.headers, false, 0));
});

console.log(`Listening on 0.0.0.0:${PORT}... Forwarding requests to ${TARGET}`)

proxy.listen(PORT);
