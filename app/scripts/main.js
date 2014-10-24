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
	    // Parse.User.logIn(email, password).then(function(user){
	    // 	console.log(user);
	      // PPRouter.navigate('/posts/create', {trigger: true});
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


// ROUTER(S)

App.AppRouter = Parse.Router.extend({
	routes: {
		//URL to match	//function called when the hash matches

		''				: 'index',				//	url/#
		'login'			: 'login',			//	url/#aboutme
		'setlang'		: 'renderSetLanguages',	//	url/#setlang
		'tomeet'		: 'renderToMeet',				//	url/#tomeet
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

});


// "GLUE" CODE

Parse.initialize('LyWY44CklJfoUT82opx55PgKeQFXgU076IP8dzd9', 'HB7stHrSgvG7AST6XVclCA2lFifzHC1YDr1GH89M');
window.PPRouter = new App.AppRouter();
Parse.history.start();


})();

