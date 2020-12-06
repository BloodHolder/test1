const http = require('http');
const url = require('url');

module.exports = http.createServer((req, res) => {

    var apiService = require('./function');
    const reqUrl = url.parse(req.url, true);

    if (reqUrl.pathname == '/listall' && req.method === 'GET') {

        apiService.bankListRequest(req, res);

    } else if (reqUrl.pathname == '/createaccount' && req.method === 'POST') {

        apiService.bankAddRequest(req, res);

    } else if (reqUrl.pathname == '/transfer' && req.method === 'POST') {

        apiService.banktransferRequest(req, res);

    } else if (reqUrl.pathname == '/checkbalance' && req.method === 'GET') {

        apiService.bankBalanceChcekRequest(req, res);

    } else if (reqUrl.pathname == '/histroy' && req.method === 'GET') {

        apiService.bankTranscationHistoryRequest(req, res);

    } else {

        apiService.invalidRequest(req, res);

    }
});