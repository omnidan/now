var _debug = Meteor.npmRequire('debug');
var debug = _debug('server');

function digits(x) {
  if (!x || (x === 0)) return 0;

  // math-magic - from http://stackoverflow.com/a/28203456
  return (math.log((x ^ (x >> 31)) - (x >> 31), 10) | 0) + 1;
}

Meteor.publish('posts', function () {
  Publish.relations(this, Posts.find({}, {sort: {points: -1}}), function (id, doc) {
    doc.user = this.cursor(Meteor.users.find(doc.user))
      .changeParentDoc(function (userId, user) {
        return {username: user.username, digits: digits(user.points)};
      });
  });

  return this.ready();
});

/* from http://stackoverflow.com/a/15103885/702288 */
Meteor.publish("userData", function () {
  return Meteor.users.find({_id: this.userId}, {fields: {'voted': 1, 'points': 1}});
});

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