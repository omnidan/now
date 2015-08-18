function digits(x) {
  if (!x || (x === 0)) return 0;

  // math-magic - from http://stackoverflow.com/a/28203456
  return (math.log((x ^ (x >> 31)) - (x >> 31), 10) | 0) + 1;
}

Posts = new Mongo.Collection('posts', {
  transform: function (doc) {
    doc.digits = digits(doc.points);
    return doc;
  }
});

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
  insert: function (userId, doc) {
    return userId && doc.user === userId;
  }
});