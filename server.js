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
    return Conversations.find({});
  })
}