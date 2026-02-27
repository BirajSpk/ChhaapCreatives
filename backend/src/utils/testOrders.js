const http = require('http');

async function testMyOrders() {
    // First Login to get token
    const loginData = JSON.stringify({ email: 'admin@chhaap.com', password: 'Admin123!@#' });

    const loginReq = http.request({
        hostname: 'localhost',
        port: 5003,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(loginData) }
    }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', async () => {
            const data = JSON.parse(body);
            const token = data.data.accessToken;
            console.log('Login Success. Fetching orders...');

            const orderReq = http.request({
                hostname: 'localhost',
                port: 5003,
                path: '/api/orders/my-orders',
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            }, (orderRes) => {
                let orderBody = '';
                orderRes.on('data', chunk => orderBody += chunk);
                orderRes.on('end', () => {
                    console.log('ORDER STATUS:', orderRes.statusCode);
                    console.log('ORDER BODY:', orderBody);
                    process.exit();
                });
            });
            orderReq.end();
        });
    });
    loginReq.write(loginData);
    loginReq.end();
}

testMyOrders();
