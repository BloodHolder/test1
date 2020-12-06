const url = require('url');
const userAccount = [];
const userTransaction = [];

exports.bankListRequest = function (req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(userAccount));
};

exports.bankBalanceChcekRequest = function (req, res) {
    const reqUrl = url.parse(req.url, true);
    let accountid = reqUrl.query.accountid
    if (!accountid) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end(`Account No is Requeried`);
        return
    }
    let checkAccountId = userAccount.find(item => item.accountid === accountid);
    if (!checkAccountId) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end(`Account No is Invalid Please Check It`);
        return
    }
    let alldebit = userTransaction.filter(item => item.debituserid === accountid);
    let allcredit = userTransaction.filter(item => item.credituserid === accountid);
    var debitamount = alldebit.reduce((acc, curr) => acc + curr.amount, 0);
    var creditamount = allcredit.reduce((acc, curr) => acc + curr.amount, 0);

    let totalbalance = checkAccountId.amount + creditamount - debitamount
    let obj = {
        name: checkAccountId.name,
        Accountno: checkAccountId.accountid,
        balance: totalbalance
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(obj));
};
exports.bankTranscationHistoryRequest = async (req, res) => {
    const reqUrl = url.parse(req.url, true);
    let accountid = reqUrl.query.accountid
    if (!accountid) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end(`Account No is Requeried`);
        return
    }
    let checkAccountId = userAccount.find(item => item.accountid === accountid);
    if (!checkAccountId) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end(`Account No is Invalid Please Check It`);
        return
    }
    let totaltrans = userTransaction.filter(item => item.debituserid === accountid || item.credituserid === accountid);
    let alldebit = userTransaction.filter(item => item.debituserid === accountid);
    let allcredit = userTransaction.filter(item => item.credituserid === accountid);
    var debitamount = alldebit.reduce((acc, curr) => acc + curr.amount, 0);
    var creditamount = allcredit.reduce((acc, curr) => acc + curr.amount, 0);
    let totalbalance = checkAccountId.amount + creditamount - debitamount

    let result = {
        Accountid: checkAccountId.accountid,
        balance: totalbalance,
        histroy: totaltrans
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));

}

exports.bankAddRequest = async (req, res) => {
    body = '';
    req.on('data', function (chunk) {
        body += chunk;
    });
    req.on('end', function () {

        if (body) {
            body = JSON.parse(body)
            let name = body.name ? body.name : ""
            let amount = parseInt(body.amount) ? body.amount : ""
            if (!name) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end(`Name is Requeried`);
                return
            }
            if (!amount) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end(`Invalid Amount`);
                return
            }

            var mesg = "";
            let id = userAccount.length + 1;
            let obj = {
                id: id,
                name: name,
                accountid: `${id}${new Date().getTime()}`,
                amount: amount,
            }
            if (userAccount.length === 0) {
                mesg = `New account created successfully`
                userAccount.push(obj)
            } else {
                let userCheck = userAccount.find(item => item.name === name);
                if (userCheck) {
                    mesg = `This user has already account so we have created a new account on same name`,
                        userAccount.push(obj)

                } else {
                    mesg = `New account created successfully`

                    userAccount.push(obj)
                }
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: mesg, result: obj }));
        } else {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Request has been Empty');
        }
    });


}

exports.banktransferRequest = async (req, res) => {
    body = '';
    req.on('data', function (chunk) {
        body += chunk;
    });
    req.on('end', function () {
        if (body) {
            body = JSON.parse(body)
            let youraccountno = body.youraccountno ? body.youraccountno : ""
            let transferaccountno = body.transferaccountno ? body.transferaccountno : ""
            let amount = parseInt(body.amount) ? body.amount : ""
            if (!youraccountno) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end(`Your Account No is Requeried`);
                return
            }
            if (!transferaccountno) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end(`Transfer Account No is Requeried`);
                return
            }
            if (!amount) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end(`Invalid Amount`);
                return
            }
            let findyouraccount = userAccount.find(item => item.accountid === youraccountno);
            let findtransferaccount = userAccount.find(item => item.accountid === transferaccountno);
            let chcekamount = userAccount.find(item => item.accountid === youraccountno && item.amount >= amount);
            if (!findyouraccount) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end(`Your Account No is Invalid please chcek it`);
                return
            }
            if (!findtransferaccount) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end(`Tranfer Account No is Invalid please chcek it`);
                return
            }
            if (!chcekamount) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end(`Insufficient Balance`);
                return
            }
            let obj = {
                tansid: userTransaction.length + 1,
                debituserid: youraccountno,
                credituserid: transferaccountno,
                amount: amount

            }
            userTransaction.push(obj)
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Amount transfer success');
        } else {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Request has been Empty');
        }
    });
}
exports.invalidRequest = function (req, res) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Invalid Request');
};