var AppRouter = Backbone.Router.extend({

  routes: {
    "":                 "hello",
    "conversation/:id": "conversation"
  },

  hello: function() {
    Session.set('currentView', 'hello');
    Session.set('conversationId', '');
    Session.set('conversationUserId', '');
    this.navigate('', {trigger: true});
  },

  conversation: function(id, userId) {
    Session.set('conversationId', id);
    Session.set('conversationUserId', userId);
    Session.set('currentView', 'conversation');
    this.navigate('conversations/' + id, {trigger: true});
  }

});

Router = new AppRouter();