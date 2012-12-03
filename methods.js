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

  findConversationLength: function(options) {
    var conversation = Conversations.findOne(options);

    if (conversation) {
      return {_id: conversation._id, messagesLength:conversation.messages.length};
    } else {
      // Try to reverse the first and second user
      conversation = Conversations.findOne(
        { firstUserId:  options.secondUserId,
          secondUserId: options.firstUserId }
      );

      if (conversation) {
        return {_id: conversation._id, messagesLength:conversation.messages.length};
      } else {
        return {_id: conversation._id, messagesLength: undefined};
      }
    }
  },

  createMessage: function(options) {
    var messages = Conversations.findOne({_id: options.conversationId}).messages;
    Conversations.update({_id: options.conversationId}, {
      $addToSet: {messages: {text: options.text, sender: options.sender, i: messages.length}}
    });
  }

});