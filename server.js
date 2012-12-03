if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.publish('allUsers', function() {
    return Meteor.users.find({});
  });

  Meteor.publish('conversations', function(id) {
    // If we scope this to the conversationId (eg don't allow the user
    // to access any but their own conversations), then this fails sometimes.
    // Clearly giving the user access to all conversations is a security
    // flaw though.

    // It probably fails because the userId can either be the first user or the
    // second user. In the 'findOrCreateConversation' method, it will search for
    // the user as the seconduser after it can't find it as the firstuser, but
    // before resorting to creating a new conversation.
    return Conversations.find({});
  });
}