Meteor.methods({

  findOrCreateConversation: function(options) {
    var conversation = Conversations.findOne(options);

    if (conversation) {
      return conversation._id;
    } else {
      // Try to reverse the first and second user
      conversation = Conversations.findOne(
        { firstUserId:  options.secondUserId,
          secondUserId: options.firstUserId }
      );

      if (conversation) {
        return conversation._id;
      } else {
        return Conversations.insert(options);
      }
    }
  },

  createMessage: function(options) {
    var index = Conversations.findOne({_id: options.conversationId}).messages.length;
    Conversations.update({_id: options.conversationId}, {
      $addToSet: {messages: {text: options.text, sender: options.sender, i: index}}
    });
  }

});