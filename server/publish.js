Meteor.publish('posts', function () {
  return Posts.find({}, {sort: {points: -1}});
});

/* from http://stackoverflow.com/a/15103885/702288 */
Meteor.publish('myData', function () {
  return Meteor.users.find({_id: this.userId}, {fields: {
  	'username': 1,
  	'points': 1,
  	'voted': 1
  }});
});

Meteor.publish('users', function () {
  return Meteor.users.find({}, {fields: {
    'username': 1,
    'points': 1
  }});
});