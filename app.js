var express = require('express');
var app = express();
var router = express.Router();
var path = __dirname + '/views/';
app.use(express.static(__dirname + '/public'));

router.use(function (req,res,next) {
  console.log('/' + req.method);
  next();
});

router.get('/',function(req,res){
  res.sendFile(path + 'index.html');
});

router.get('/about',function(req,res){
  res.sendFile(path + 'about.html');
});

router.get('/signup',function(req,res){
  res.sendFile(path + 'signup.html');
});

router.get('/myaccount',function(req,res){
  res.sendFile(path + 'myaccount.html');
});

router.get('/write',function(req,res){
  res.sendFile(path + 'write.html');
});

app.use('/',router);

app.use('*',function(req,res){
  res.sendFile(path + 'error.html');
});

module.exports = app;
