(function(){
'use strict';

window.App = {};					/* UNNECESSARY/INAPPROPRIATE IN PARSE? OR DO YOU JUST PREFER var IN JSBIN? */
App.Models = {};
App.Collections = {};
App.Views = {};
App.Routers = {};


// MODELS


// VIEWS

App.LogInView = Parse.View.extend({
	template: _.template($('.login-template').text()),

	events: {
		'submit': 'userLogIn',
	},

	userLogIn: function(e){
	    e.preventDefault();
	    var email = this.$('.email-input').val();
	    var password = this.$('.password-input').val();
	    Parse.User.logIn(email, password).then(function(user){
	    	console.log(user);
	      // PPRouter.navigate('/posts/create', {trigger: true});
	    // }, function(error){
	    //   console.error(error);
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


App.RegisterView = Parse.View.extend({

	template: _.template($('.register-template').text()),

	events: {
		'submit': 'userRegister',
	},

	userRegister: function(e){
		e.preventDefault();

		var email = this.$('.email-input').val();
		var password = this.$('.password-input').val();
		var username = this.$('.username-input').val();

		var user = new Parse.User();
		user.set("username", username);
		user.set("password", password);
		user.set("email", email);
		 
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



// ROUTER(S)

App.AppRouter = Parse.Router.extend({
	routes: {
		//URL to match	//function called when the hash matches

		''				: 'index',				//	url/#
		'login'			: 'login',			//	url/#aboutme
		'setlang'		: 'renderSetLanguages',	//	url/#setlang
		'register'		: 'register',				//	url/#tomeet
		'messenger'		: 'renderMessenger'			//	url/#messenger
	},

	index: function(){
	    if(Parse.User.current()){
	      this.navigate('posts', {trigger: true});
	    } else {
	      this.navigate('login', {trigger: true});
	    }
	},
  
	login: function(){
		new App.LogInView({el: 'body'});
	},

	register: function(){
		new App.RegisterView({el: 'body'});
	}

});


// "GLUE" CODE

Parse.initialize('LyWY44CklJfoUT82opx55PgKeQFXgU076IP8dzd9', 'HB7stHrSgvG7AST6XVclCA2lFifzHC1YDr1GH89M');
window.PPRouter = new App.AppRouter();
Parse.history.start();


})();

