const hostname = 'localhost';
const port = 3000;

const server = require('./routers/banking.js');

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});