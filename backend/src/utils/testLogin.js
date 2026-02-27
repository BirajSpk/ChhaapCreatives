const http = require('http');

const data = JSON.stringify({ email: 'admin@chhaap.com', password: 'Admin123!@#' });

const req = http.request({
    hostname: 'localhost',
    port: 5003,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
}, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
        console.log('STATUS:', res.statusCode);
        console.log('BODY:', body);
        process.exit();
    });
});

req.on('error', e => { console.error(e); process.exit(1); });
req.write(data);
req.end();
