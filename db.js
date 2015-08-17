Posts = new Mongo.Collection('posts');
Posts.attachSchema(new SimpleSchema({
  title: {
    type: String,
    label: 'Title',
    max: 64
  },
  url: {
    type: String,
    label: 'URL',
    max: 128
  },
  points: {
    type: Number,
    label: 'Points',
    defaultValue: 0,
    autoform: { omit: true }
  },
  user: {
    type: String,
    label: 'User',
    autoValue: function () {
      if (this.isInsert) {
        return Meteor.userId();
      }
    },
    autoform: { omit: true }
  },
  createdAt: {
    type: Date,
    label: 'Created',
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      }
    },
    autoform: { omit: true }
  }
}));
Posts.allow({
  insert: function () {
    return true;
  }
});

AccountsGuest.name = true;
AccountsGuest.anonymous = true;