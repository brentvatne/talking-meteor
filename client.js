if (Meteor.isClient) {
  // This is executed each time the app restarts or page refresh
  Meteor.startup(function () {
    Session.set('currentView', 'hello');
    Backbone.history.start({pushState: true});
    Router.hello();
  });

  Accounts.ui.config({
    requestPermissions: {
      github: ['user']
    }
  });

  Meteor.autosubscribe(function() {
    Meteor.subscribe('conversations', Session.get('conversationId'));
  });

  Meteor.subscribe('allUsers');

  Template.hello.otherUsers = function() {
    return Meteor.users.find({_id: { $ne: Meteor.userId() }});
  };

  Template.hello.events({
    'click .start-conversation' : function(e) {
      e.preventDefault();
      var userId = $(e.target).data('id');

      // Create the conversation
      var conversationId = Meteor.call('findOrCreateConversation', {
        firstUserId: Meteor.userId(),
        secondUserId: userId
      }, function(err, conversationId) {
        Router.conversation(conversationId);
      });
    }
  });

  Template.conversation.events({
    'submit .new-message-form' : function(e) {
      e.preventDefault();
      var messageText = $('.new-message-text').val();
      Meteor.call('createMessage', {
        conversationId: Session.get('conversationId'),
        text: messageText,
        sender: Meteor.user().profile.name
      }, function(err, result) {
        // Do nothing
      });
    }
  });

  Template.conversation.messages = function() {
    conversation = Conversations.findOne({_id: Session.get('conversationId')});
    messages = conversation.messages;
    return messages || [];
  };

  if (Handlebars) {
    Handlebars.registerHelper('currentView', function() {
      return Session.get('currentView');
    });

    Handlebars.registerHelper('render', function(name) {
      if (Template[name])
        return Template[name]();
    });
  }
}
