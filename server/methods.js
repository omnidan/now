var _debug = Meteor.npmRequire('debug');
var debug = _debug('server');

Meteor.methods({
  vote: function votePost(dbId) {
    var voted = true;

    // check if post exists
    var post = Posts.findOne(dbId);
    if (!post) {
      debug("%s: post '" + dbId + "' not found", Meteor.user().username);
      return;
    }

    // check if user created the post
    if (Meteor.userId() === post.user) {
      debug("%s: tried to vote for their own post", Meteor.user().username);
      return;
    }

    // check if user has voted already or not
    if (Meteor.user().voted && (Meteor.user().voted.indexOf(dbId) !== -1)) {
      voted = false;
    }

    var update = {};
    update[voted ? '$push' : '$pull'] = { voted: dbId };
    Meteor.users.update(Meteor.userId(), update);

    var handlePoints = { $inc: { points: voted ? +1 : -1 } };
    Meteor.users.update(post.user, handlePoints);
    Posts.update(dbId, handlePoints);
  }
});