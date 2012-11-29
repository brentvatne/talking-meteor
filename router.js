var AppRouter = Backbone.Router.extend({

  routes: {
    "":                 "hello",
    "conversation/:id": "conversation"
  },

  hello: function() {
    Session.set('currentView', 'hello');
    this.navigate('', {trigger: true})
  },

  conversation: function(id) {
    Session.set('conversationId', id);
    Session.set('currentView', 'conversation');
    this.navigate('conversations/' + id, {trigger: true})
  }

});

Router = new AppRouter();
