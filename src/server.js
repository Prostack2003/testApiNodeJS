const { createServer } = require('node:http');
const mealsController = require('./controllers/meals.controller');
const {port} = require("./config");
const mealsRouter = require("./routes/meals.router");

const server = createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost:3000');
    try {
        if (url.pathname === '/') {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end('KBZU API')
        }

        else if (url.pathname.startsWith('/api/meals')) {
            await mealsRouter(req, res, url);
        }

        else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({error: '404 Not Found'}));
        }
    } catch (err) {
        console.error(err);
        if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
    }
});

if (require.main === module) {
    server.listen(port, () => console.log('Server running...'));
}

module.exports = server;