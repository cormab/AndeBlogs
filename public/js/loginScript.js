'use strict';

$('#header').load('/includes/header.html');
$('.button-collapse').sideNav();
$('#footer').load('/includes/footer.html');

var config = {
  apiKey: 'AIzaSyDMd_3y7EadFXdkAsVxAwBMh440IpCm1NE',
  authDomain: 'andeblogs.firebaseapp.com',
};

var app = firebase.initializeApp(config);
var auth = app.auth();
var ui = new firebaseui.auth.AuthUI(auth);

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    window.location.href = "#";
  ) else {

   }
 });
