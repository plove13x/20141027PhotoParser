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

App.User = Parse.Object.extend({
  className: 'User'				/* Where is some documentatio that shows why this has to be uppercase for userIndex view to function correctly? I get that "User" is a special object (class?) type in Parse, but where am I even referencing the className? */
});

App.Comment = Parse.Object.extend({
  className: 'comment'
});


// COLLECTIONS

App.Posts = Parse.Collection.extend({
	model: App.Post
});

// VIEWS


App.BaseView = Parse.View.extend({
    template: _.template($('[data-template-name="base"]').text()),

    initialize: function(){
    	this.render();
    },

    render: function(){
    	this.$el.html(this.template());			/* prepend vs. html? */
    	window.pHeader = new App.HeaderView ({
    		$container: $('header')
    	});
    }

});

App.HeaderView = Parse.View.extend({
	template: _.template($('[data-template-name="headerContent"]').html()),

	initialize: function(opts){
		var options = _.defaults({}, opts, {
            $container: opts.$container
        });
		options.$container.html(this.el);		/* vs. append? */
		this.render();
	},

	events: {
		'click .logIn': 'logIn',
		'click .logOut': 'logOut'
	},

	render: function(){
		this.$el.html(this.template());			/* vs. prepend? */
	},

	logIn: function() {
		var self = this;
		PPRouter.navigate('/login', {trigger: true});
	},

	logOut: function() {
		Parse.User.logOut();
		window.uzer = null;
		console.log('You logged out! Current user is: ' + window.uzer);
		PPRouter.navigate('/login', {trigger: true});
		pHeader.render();
	}
});

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
		    console.log(username);
		    window.uzer = username;
		    PPRouter.navigate('/posts', {trigger: true});
		  },
		  error: function(user, error) {
		    // The login failed. Check error to see why.
		    console.log('n');
		  }
		}).then(function(){
			pHeader.render();	
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

	events: {
		'click .addPhoto': 'addPhoto'
	},

	addPhoto: function() {
		PPRouter.navigate('/posts/create', {trigger: true});
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

	 	// var query = new Parse.Query(App.User);					THROWS AN ERROR SO SET window.uzer on login...
		// query.equalTo('username', Parse.User.current());

	    this.model.set({
	      title: this.$('.title').val(),
	      url: this.$('.url').val(),
	      author: Parse.User.current(),
	      authorName: window.uzer
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
		':author_id'	: 'userIndex',

		'setlang'		: 'renderSetLanguages',	//	url/#setlang
		'messenger'		: 'renderMessenger'		//	url/#messenger
	},

	initialize: function() {
		new App.BaseView({
			el: 'body'
		});
	},

	index: function(){
	    if(Parse.User.current()){
	      this.navigate('/posts', {trigger: true});
	    } else {
	      this.navigate('/login', {trigger: true});
	    }
	},
  
	login: function(){
		this.swap ( new App.LogInView({$container: $('.container')}) );
	},

	register: function(){
		this.swap ( new App.RegisterView({$container: $('.container')}) );
	},

	postsIndex: function(){
		// var posts = new App.Posts();
		// var self = this;
		// posts.fetch().then(function() {
		// console.log(posts);
		// self.swap ( new App.PostsIndexView({collection: posts, $container: $('.container')}) );	
		// })

		var query = new Parse.Query(App.Post);
		    query.equalTo('author', Parse.User.current());
		    var collection = query.collection();
		    var self = this;
		    collection.fetch().then(function(){
		      self.swap ( new App.PostsIndexView({
		        collection: collection,
		        $container: $('.container')
		      }) );
		    });
	},

	userIndex: function(user){
		var query = new Parse.Query(App.Post);
	    query.equalTo('authorName', user);

		// var userQuery = new Parse.Query(App.User);		ALTERNATE METHOD TO ABOVE AND WINDOW.UZER...
		// userQuery.equalTo('username', user);

		// var postQuery = new Parse.Query(App.Post);
		// postQuery.matchesQuery('author', userQuery);

	    var collection = query.collection();
	    var self = this;
	    collection.fetch().then(function(){
	      self.swap ( new App.PostsIndexView({
	        collection: collection,
	        $container: $('.container')
	      }) );
	    });
	},

	postsCreate: function(){
		this.swap ( new App.PostsCreateView({$container: $('.container')}) );
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

