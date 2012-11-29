if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.publish('allUsers', function() {
    return Meteor.users.find({});
  });

  Meteor.publish('conversations', function(id) {
    return Conversations.find({});
  })
}

