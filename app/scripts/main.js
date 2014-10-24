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


// COLLECTIONS

App.Posts = Parse.Collection.extend({
	model: App.Post
});

// VIEWS

App.LogInView = Parse.View.extend({
	template: _.template($('[data-template-name="login"]').text()),

	events: {
		'submit': 'userLogIn',
	},

	userLogIn: function(e){
		console.log('userLogin');
	    e.preventDefault();
	    Parse.User.logOut();							/* Test to see if necessary */
	    var email = this.$('.email-input').val();
	    var password = this.$('.password-input').val();
	    var username = this.$('.username-input').val();
	 
		Parse.User.logIn(username, password, {
		  success: function(user) {
		    // Do stuff after successful login.
		    console.log('y');
		    PPRouter.navigate('/posts/create', {trigger: true});
		  },
		  error: function(user, error) {
		    // The login failed. Check error to see why.
		    console.log('n');
		  }
		});

	    // Parse.User.logIn(email, password).then(function(user){			/* Didn't work! */
	    // 	console.log(user);
	    //   PPRouter.navigate('/posts/create', {trigger: true});
	    // }, function(error){
	    //   console.error(error);
	    // });

	  },

	initialize: function(options){
		options.$container.html(this.el);
		this.render();
	},

	render: function(){
		this.$el.html(this.template());
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
		    alert('Error: ' + error.code + ' ' + error.message);
		  }
		});
	},

	initialize: function(options){
		options.$container.html(this.el);
		this.render();
	},

	render: function(){
		this.$el.html(this.template());
		return this;
	},
});



// {posts: this.collection.toJSON()}
App.PostsIndexView = Parse.View.extend({

	template: _.template( $('[data-template-name="posts/index"]').text() ),
  
	initialize: function(options){
		options.$container.html(this.el);
		this.render();
	},

	render: function(){
		console.log(this.collection);
    	this.$el.html( this.template({posts: this.collection.toJSON()}) );
    	console.log(this.collection);
  	}

});


App.PostsCreateView = Parse.View.extend({

	template: _.template( $('[data-template-name="posts/create"]').text() ),
  
	initialize: function(options){
		options.$container.html(this.el);
		this.model = new App.Post();
		    window.post = this.model;
		    this.render();
		    _.bindAll(this, 'render');
		    this.model.on('change', this.render);
	},

	render: function(){
		this.$el.html( this.template({model: this.model.toJSON()}) );
		return this;
	},


	events: {
	    'submit': 'createPost',
	    'change input[type=file]': 'uploadFile',
	},
  
	uploadFile: function(e){
	    var file = $(e.target)[0].files[0];
	   
	    var parseFile = new Parse.File(file.name, file);
	    var self = this;
	    parseFile.save().then(function(){
	      self.model.set('image', parseFile.url());
	    });
	},
  
	createPost: function(e){
	    e.preventDefault();
	    this.model.set({
	      title: this.$('.title').val(),
	      url: this.$('.url').val(),
	      author: Parse.User.current()
	    });
	    
	    post.save().then(function(){
	      PPRouter.navigate('posts', {trigger: true});
	    });
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
		'posts/create'	: 'postsCreate',		//	url/#posts/create

		'setlang'		: 'renderSetLanguages',	//	url/#setlang
		'messenger'		: 'renderMessenger'		//	url/#messenger
	},

	index: function(){
	    if(Parse.User.current()){
	      this.navigate('/posts', {trigger: true});
	    } else {
	      this.navigate('/login', {trigger: true});
	    }
	},
  
	login: function(){
		new App.LogInView({$container: $('.container')});
	},

	register: function(){
		new App.RegisterView({$container: $('.container')});
	},

	postsIndex: function(){
		var posts = new App.Posts();
		posts.fetch().then(function() {
		console.log(posts);
		new App.PostsIndexView({collection: posts, $container: $('.container')});	
		})
	},

	postsCreate: function(){
		new App.PostsCreateView({$container: $('.container')});
	},

	swap: function(view){
		if (this.currentView) {
			// this.currentView.stopListening();
			// this.currentView.undelegateEvents();
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

