'use strict';

var config = {
  apiKey: 'AIzaSyDMd_3y7EadFXdkAsVxAwBMh440IpCm1NE',
  authDomain: 'andeblogs.firebaseapp.com',
  databaseURL: 'https://andeblogs.firebaseio.com',
  storageBucket: 'andeblogs.appspot.com',
};
var app = firebase.initializeApp(config);
var auth = app.auth();
var ui = new firebaseui.auth.AuthUI(auth);

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    var user = firebase.auth().currentUser;
    console.log(user);
    var userId = user.uid;
    var name = user.displayName;
    var email = user.email;
    var photoUrl = user.photoURL;
    if(photoUrl == null || photoUrl == '') {
      photoUrl = '/images/person.jpg'
    }
    var followers=0;
    var following=0;

    //Window.localStorage.setItem('user', JSON.stringify(user));

$('#header').load('/includes/header.html',function() {
  if (user) {
    console.log('not null');
    $('#switchNav').html(
      '<li><a id="myaccount" href="/myaccount">My Account</a></li>' +
      '<li><a id="logout" href="#" onclick="logout()">Logout</a></li>'
    );
  } else {
    $('#switchNav').html(
      '<li><a id="loginTrigger" class="btn" href="#loginModal">' +
      'Sign in</a></li>'
    );
    $('#loginTrigger').click(function() {
      var uiConfig = {
        'signInSuccessUrl': '/myaccount',
        'signInOptions': [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID
        ],
        // Terms of service url.
        'tosUrl': '#',
      };
      ui.start('#firebaseui-auth-container', uiConfig);
      $('#loginModal').openModal();
    });
  }
  $('.button-collapse').sideNav();
  $('#logout').click(function() {
    console.log('logging out');
    Window.localStorage.clear();
    firebase.auth().signOut().then(function() {
      //$('#header').after('<p class="text-red">Logout failed</p>')
      console.log('gogged out')
    }, function(error) {console.log('Error: ' + error);
    });
  });
});
$('#footer').load('/includes/footer.html');
function logout() {
  console.log('logging out');
  //Window.localStorage.clear();
  firebase.auth().signOut().then(function() {
    //$('#header').after('<p class="text-red">Logout failed</p>')
    console.log('gogged out')
    }, function(error) {console.log('Error: ' + error)
  });
}

$('#myProfile').ready(function() {
  //function to calculate number of followers
  //function calculate number of followining
  $('#name').html(name);
  $('#picture').html('<img src="' + photoUrl + '" />');
  $('#followers').html(followers);
  $('#following').html(following);
  displayBlogPostsList();
  displayLikedPostList();
});

function displayBlogPostsList() {
  console.log('display blog');
  if(!(user.articles == null)) {
    console.log('found: ' + user.articles);
    $('#blogPostsList').html('<ul>');
    user.articles.forEach(function(article) {
      $('#blogPostsList').appendTo('<li>'+article.title+'</li>');
    });
    $('#blogPostsList').appendTo('</ul>');
  } else {
    console.log('nothing found');
    $('#blogPostsList').html('<p>No posts have been wriiten</p>');
  }

}

function displayLikedPostList() {
  if(!(user.likes == null)) {
    $('#likedPostsList').html('<ul>');
    user.likes.forEach(function(like) {
      $('#likedPostsList').appendTo('<li>'+like.article.title+'</li>');
    });
    $('#likedPostsList').appendTo('</ul>');
  } else {
    $('#likedPostsList').html('<p>You have not liked any posts</p>');
  }
}

var toolbar = [
  ['style', ['style', 'bold', 'italic', 'underline', 'strikethrough', 'clear']],
  ['fonts', ['fontsize', 'fontname']],
  ['undo', ['undo', 'redo', 'help']],
  ['ckMedia', ['ckImageUploader', 'ckVideoEmbeeder']],
  ['misc', ['link', 'picture', 'table', 'hr', 'codeview', 'fullscreen']],
  ['para',
    ['ul', 'ol', 'paragraph', 'leftButton', 'centerButton', 'rightButton',
    'justifyButton', 'outdentButton', 'indentButton']],
  ['height', ['lineheight']],
  ];

$('.editor').materialnote({
    toolbar: toolbar,
    height: 550,
    minHeight: 100,
    defaultBackColor: '#e0e0e0'
  });

$('#submitNewPost').click(function() {
  var articleTitle = $('#articleTitle').html;
  var articleContent = $('#articleContent').html;
  var d = new Date();

  var articleData = {
    author: displayName,
    userId: userId,
    title: articleTitle,
    content: articleContent,
    likeCount: 0
  };
   var newArticleKey = firebase.database().ref().child('articles').push.key;
   var updates ={};
   updates['/articles/' + newArticleKey] = articleData;
   updates['/user-articles/' + newArticleKey] = articleData;
   return firebase.database().ref().update(updates);
});



}
});
/*
function listArticles() {}
function listPopularArticles() {}
function listNewestArticles() {}
function listFollowedUsersArticles() {}
function writeArticle() {}
function listFollowers() {}
function displayArticle() {}
*/
