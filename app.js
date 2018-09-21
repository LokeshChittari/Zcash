var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var route = express.Router();
var http = require('http');
var shell = require('shelljs');
var server = http.createServer(app);
 app.use(bodyParser.json());
 var request = require('request');
//  app.use(bodyParser.urlencoded({extended: true}));

// route.get('/app/getInformation', function(req, res) {
//  request('https://api.zcha.in/v2/mainnet/blocks/{hash}/transactions', (request, response) =>{
//    res.json(response);
//  })
//  });
//  route.get('/app/getTransactionDetails', function(req, res){
//   var hash = req.param.hash;

     
//     request('https://api.zcha.in/v2/mainnet/transactions/{hash}', function(err, response, body){
          
//     res.json(response);
     
//     })  
// });
route.get('/app/CreateWallet',(req, res) =>{
    res.json(shell.exec(`./address.sh`));
});

route.post('/app/getBalance',(req, res) =>{
    var taddr = req.body.addr;
    console.log(taddr);
    // console.log(`./balance.sh ${'taddr'}`);
    // res.json(shell.exec(`./balance.sh ${taddr}`));
    shell.exec(`./balance.sh ${taddr}`, function(err, result) {
        var result1 = JSON.parse(result);
        res.json({"balance": result1});
    })
});

route.post('/app/sendmoney', (req, res) =>{
    var from = req.body.frmaddr;
    var to = req.body.toaddr;
    var amount = req.body.value;
    var data=[{"address": `${to}`, "amount": `${amount}`}];
    var data1 = JSON.stringify(data);
    // var data = [{"address": "tmM2DtS1pafhmpwVGTjz13sds8R44ijZGzx", "amount": 0.5 }]
    // var data1 = JSON.stringify(data);
    //  res.json(shell.exec(`./sendmoney.sh ${from} '${data1}'`));
    shell.exec(`./sendmoney.sh ${from} '${data1}'`, function(err, result){
    //  var result1 = JSON.parse(result);
     res.json({"id": result});
    });

});

route.post('/app/getOperationStatusbyoperationid', (req, res) =>{
    var txn = "null";
    var opid = req.body.id;
    var data = [`${opid}`];
    var data1 = JSON.stringify(data);
    // res.json(shell.exec(`./operationstatus.sh '${data1}'`));
    shell.exec(`./operationstatusbyaccount.sh '${data1}'`, function (err, result){
        var result1 = JSON.parse(result);
        if(result1[0].status == "success") {
            txn = result1[0].result.txid;
        }
        res.json({
          "id": result1[0].id,
          "status": result1[0].status,
          "txnid": `${txn}`
        })
        
    })
});

route.post('/app/getOperationstatuses', (req, res) => {
    var txn = "null";
    shell.exec(`./operationstatus.sh`, function(err, result) {
        var result1 = JSON.parse(result);
      
            res.json(result1);
        
    });
});

 app.use(route);
 app.listen(3100, function() {
     console.log("server started at http://localhost:3100")
 });
 