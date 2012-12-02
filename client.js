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

  var startConversation = function(e) {
      e.preventDefault();
      var userId = $(e.target).data('id');

      // Create the conversation
      var conversationId = Meteor.call('findOrCreateConversation', {
        firstUserId: Meteor.userId(),
        secondUserId: userId
      }, function(err, conversationId) {
        Router.conversation(conversationId, userId); 
        //userId passed into routes and used to identify which conversation is active
      });
    }; 

  Meteor.autosubscribe(function() {
    Meteor.subscribe('conversations', Session.get('conversationId'));
  });

  Meteor.subscribe('allUsers');

  Template.hello.otherUsers = function() {
    return Meteor.users.find({_id: { $ne: Meteor.userId() }});
  };

  Template.conversation.otherUsers = function() {
    return Meteor.users.find({_id: { $ne: Meteor.userId() }});
  }; //there's got to be a more elegant way to do this...

  Template.hello.events({
    'click .start-conversation' : function(e){startConversation(e)}
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
    },

    'click .start-conversation' : function(e){startConversation(e)}
  });

  Template.conversation.messages = function() {
    var conversation = Conversations.findOne({_id: Session.get('conversationId')});
    var messages = conversation.messages;
    var username = Meteor.user().profile.name;
    var ret = '';
    for (i in messages) {
      if (username == messages[i].sender) {
        ret += "You";
      }
      else {
        ret += messages[i].sender;
      }
       ret += ": " + messages[i].text + "\n";
    }
    return new Handlebars.SafeString(ret);
  };

  Template.conversation.rendered = function() {
    var userId = Session.get('conversationUserId');
    $("nav").find("a[data-id='" + userId + "']").addClass('active');
    $('.messages').scrollTop($('.messages')[0].scrollHeight);
    $(".new-message-text").focus();
  } //this code is loaded once the page is finished rendering, basically $(document).ready

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