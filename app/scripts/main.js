(function(){
'use strict';

window.App = {};					/* UNNECESSARY/INAPPROPRIATE IN PARSE? OR DO YOU JUST PREFER var IN JSBIN? */
App.Models = {};
App.Collections = {};
App.Views = {};
App.Routers = {};


// MODELS

App.Post = Parse.Object.extend({
  className: 'post'
});

App.Comment = Parse.Object.extend({
  className: 'comment'
});


// VIEWS

App.LogInView = Parse.View.extend({
	template: _.template($('[data-template-name="login"]').text()),

	events: {
		'submit': 'userLogIn',
	},

	userLogIn: function(e){
	    e.preventDefault();
	    Parse.User.logOut();							/* Test to see if necessary */
	    var email = this.$('.email-input').val();
	    var password = this.$('.password-input').val();
	    var username = this.$('.username-input').val();
	 

Parse.User.logIn(username, password, {
  success: function(user) {
    // Do stuff after successful login.
    console.log('y');
  },
  error: function(user, error) {
    // The login failed. Check error to see why.
    console.log('n');
  }
});

	    // Parse.User.logIn(email, password).then(function(user){
	    // 	console.log(user);
	    //   PPRouter.navigate('/posts/create', {trigger: true});
	    // }, function(error){
	    //   console.error(error);
	    // });

	  },

	initialize: function(){
		this.render();
	},

	render: function(){
		this.$el.html(this.template);
		return this;
	},
});


App.RegisterView = Parse.View.extend({

	template: _.template($('[data-template-name="register"]').text()),

	events: {
		'submit': 'userRegister',
	},

	userRegister: function(e){
		e.preventDefault();

		var email = this.$('.email-input').val();
		var password = this.$('.password-input').val();
		var username = this.$('.username-input').val();

		var user = new Parse.User();
		user.set('username', username);
		user.set('password', password);
		user.set('email', email);
		 
		user.signUp(null, {
		  success: function(user) {
		    // Hooray! Let them use the app now.
		  },
		  error: function(user, error) {
		    // Show the error message somewhere and let the user try again.
		    alert("Error: " + error.code + " " + error.message);
		  }
		});
	},

	initialize: function(){
		this.render();
	},

	render: function(){
		this.$el.html(this.template);
		return this;
	},
});


App.PostsIndexView = Parse.View.extend({

	template: _.template( $('[data-template-name="posts/index"]').text() ),
  
	initialize: function(){
		this.render();
	},

	render: function(){
		this.$el.html(this.template);
		return this;
	}

});


// ROUTER(S)

App.AppRouter = Parse.Router.extend({
	routes: {
		//URL to match	//function called when the hash matches

		''				: 'index',				//	url/#
		'login'			: 'login',				//	url/#login
		'register'		: 'register',			//	url/#register
		'posts'			: 'postsIndex',			//  url/#posts
		'setlang'		: 'renderSetLanguages',	//	url/#setlang
		'messenger'		: 'renderMessenger'		//	url/#messenger
	},

	index: function(){
	    if(Parse.User.current()){
	      this.navigate('posts', {trigger: true});
	    } else {
	      this.navigate('login', {trigger: true});
	    }
	},
  
	login: function(){
		this.swap( new App.LogInView({el: 'body'}) );
	},

	register: function(){
		this.swap( new App.RegisterView({el: 'body'}) );
	},

	postsIndex: function(){
		this.swap( new App.PostsIndexView({el: 'body'}) );
	},

	swap: function(view){
		if (this.currentView) {
			this.currentView.remove();
			this.currentView = view;
			// this.currentView.render();
  		}
  	},

});


// "GLUE" CODE

Parse.initialize('LyWY44CklJfoUT82opx55PgKeQFXgU076IP8dzd9', 'HB7stHrSgvG7AST6XVclCA2lFifzHC1YDr1GH89M');
window.PPRouter = new App.AppRouter();
Parse.history.start();


})();

