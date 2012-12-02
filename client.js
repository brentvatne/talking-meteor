if (Meteor.isClient) {
  // This is executed each time the app restarts or page refresh
  Meteor.startup(function () {
    Session.set('currentView', 'hello');
    Backbone.history.start({pushState: true});
    Router.hello();
    checkForNewMessages();
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

  Template.navbar.otherUsers = function() {
    return Meteor.users.find({_id: { $ne: Meteor.userId() }});
  };

  // var checkForNewMessages = function(){
  //   $("nav a.user").each(function(i, val){
  //     var element = $(this);
  //     var userId = element.data('id');
  //     var conversation = Meteor.call('findConversationLength',{
  //       firstUserId: Meteor.userId(),
  //       secondUserId: userId
  //     }, function(err, conversation){
  //       var lastViewedCount = Session.get('lastViewedCount');
  //       if (typeof lastViewedCount === 'undefined') {
  //         lastViewedCount = {};
  //       }
  //       alert(JSON.stringify(lastViewedCount));
  //       if (typeof lastViewedCount[conversationId]) {
  //         lastViewedCount[conversationId] = '';
  //       }
  //       if (conversation.messagesLength != lastViewedCount[conversationId]) {
  //         alert(conversation.messagesLength);
  //         element.addClass('unread-message');
  //       }
  //       else {
  //         element.removeClass('unread-message');
  //       }
  //     });
  //   });
  // }

  // Meteor.setInterval(function(){
  //   checkForNewMessages();
  // },2000);

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

  Template.conversation.events({
    'submit .new-message-form' : function(e) {
      e.preventDefault();
      var messageText = $('.new-message-text').val();
      Meteor.call('createMessage', {
        conversationId: Session.get('conversationId'),
        text: messageText,
        sender: Meteor.user().profile.name
      }, function(err, result) {
        $('input.new-message-text').val(''); 
        //required for some reason when I add id="appendedInputButton" to .new-message-text
        //this also hilariously fixes the bug that could cause a user's text to disappear when
        //they received a message from the person that they were typing to
      });
    }
  });

  Template.navbar.events({
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
    return ret;
  };

  Template.conversation.rendered = function() {
    var conversationId = Session.get('conversationId');
    
    // var conversation = Conversations.findOne({_id: conversationId});
    // var lastViewedCount = Session.get('lastViewedCount');
    // if (typeof lastViewedCount == 'undefined') lastViewedCount = {};
    // //gets the count of messages as you last viewed them
    // lastViewedCount[conversationId] = conversation.messages.length;
    // //sets the count of messages for this conversation
    // Session.set('lastViewedCount', lastViewedCount);
    // //stores the value in the session

    var userId = Session.get('conversationUserId');
    $("nav a.active").removeClass('active'); //
    $("nav").find("a[data-id='" + userId + "']").addClass('active');
    $('.messages').scrollTop($('.messages')[0].scrollHeight); // scroll message boxes down to bottom
    $(".new-message-text").focus();
  } // this code is loaded once the page is finished rendering, basically $(document).ready

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