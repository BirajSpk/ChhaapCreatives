const http = require('http');

async function testMe() {
    const options = {
        hostname: 'localhost',
        port: 5003,
        path: '/api/auth/me',
        method: 'GET',
        headers: { 'Authorization': 'Bearer INVALID_TOKEN' }
    };

    const req = http.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
            console.log('STATUS:', res.statusCode);
            console.log('BODY:', body);
            process.exit();
        });
    });
    req.end();
}

testMe();
