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

app.use('/',router);

app.use('*',function(req,res){
  res.sendFile(path + 'error.html');
});

/*app.listen(3000,function(){
  console.log('Live at Port 3000');
});*/

var firebase = require('firebase');

firebase.initializeApp({
  serviceAccount: 'firebase/AndeBlogs-204fd2ea31a0.json',
  databaseURL: 'https://andeblogs.firebaseio.com'
});

var db = firebase.database();
var ref = db.ref("restricted_access/secret_document");
ref.once("value", function(snapshot) {
  console.log(snapshot.val());
});
module.exports = app;
