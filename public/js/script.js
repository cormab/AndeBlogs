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
var user = firebase.auth().currentUser;

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    user = firebase.auth().currentUser;
    var userId = user.uid;
    var name = user.displayName;
    var email = user.email;
    var photoUrl = user.photoURL;
    if(photoUrl == null || photoUrl == '') {
      photoUrl = '/images/person.jpg'
    }
    var followers=0;
    var following=0;

    var userArticlesRef = firebase.database().ref('user-articles/' + userId);
    var recentArticlesRef = firebase.database().ref('articles').limitToLast(10);
    var popularArticlesRef = firebase.database().ref('user-' +
      'articles').orderByChild('likeCount').limitToLast(10);

$('#header').load('/includes/header.html',function() {
  $('#switchNav').html(
    '<li><a id="myaccount" href="/myaccount">My Account</a></li>' +
    '<li><a id="logout" href="#">Logout</a></li>'
    );
  $('.button-collapse').sideNav();
  $('#logout').click(function() {
    logout();
  });

});
$('#footer').load('/includes/footer.html');

$('#myProfile').ready(function() {
  $('#name').html(name);
  $('#picture').html('<img src="' + photoUrl + '" />');
  $('#followers').html(followers);
  $('#following').html(following);
  //fetchArticles(userArticlesRef, '#blogPostsList');
  //fetchArticles(recentArticlesRef, '#newestArticles');
  //fetchPosts(likedPostsRef, '#likedPostsList');
  //fetchArticles(popularArticlesRef, '#popularArticles');
});

tinymce.init({
  selector: '#articleContent',
  menubar: false,
  plugins: [
    'advlist autolink link image lists charmap print preview hr anchor',
    'pagebreak spellchecker searchreplace wordcount visualblocks visualchars',
    'code fullscreen insertdatetime media nonbreaking save table contextmenu',
    'directionality emoticons template paste textcolor'
  ],
  toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft ' +
  'aligncenter alignright alignjustify | bullist numlist outdent indent | ' +
  'link image'
});

$('#submitNewPost').click(function() {
  var articleTitle = $('#articleTitle').val();
  var articleContent = tinymce.get('articleContent').getContent();

  if (articleTitle === '' || articleContent === '') {
    console.log(articleContent);
    alert('Please make sure to enter a title and content');
  } else {
    saveNewArticle(articleTitle, articleContent).then(function () {
      alert('data saved');
      window.location.href = "/myaccount";
    });
  }
});

 function saveNewArticle(articleTitle, articleContent) {
   var articleData = {
     author: name,
     userId: userId,
     title: articleTitle,
     content: articleContent,
     likeCount: 0
   };
    var newArticleKey = firebase.database().ref().child('articles').push().key;
    var updates ={};
    updates['/articles/' + newArticleKey] = articleData;
    updates['/user-articles/' + userId + newArticleKey] = articleData;
    return firebase.database().ref().update(updates);
  }

 function displayList(title, author, content, elementId) {
   $('\'' + elementId + '\'').html('<ul class="collapsible" data-collapsible="'
    + 'accordion">');
   $('\'' + elementId + '\'').appendTo('<li><div class="collapsible-header">' +
     '<strong>' + title + '</strong> - ' + author + '</div>');
   $('\'' + elementId + '\'').appendTo('<div class="collapsible-body"><p>' +
     content + '</p></div></li>');
 }

 function logout() {
   firebase.auth().signOut().then(function() {
   }, function(error) {console.log('Error: ' + error);
   });
   window.location.href = "/";
 }

 function fetchArticles(articlesRef, elementId) {
   articlesRef.on('value', function(data) {
     console.log(data.val());
     displayList(data.val().title, data.val().author, data.val().body,
       elementId);
   });
 };
} else {
  $('#header').load('/includes/header.html',function() {
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
          'tosUrl': '#',
        };
        ui.start('#firebaseui-auth-container', uiConfig);
        $('#loginModal').openModal();
      });
    });
}
});
