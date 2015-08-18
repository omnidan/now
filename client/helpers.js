Template.body.helpers({
  userId: function () {
    return Meteor.userId();
  },

  version: function () {
    var v = VERSION.split('.');
    return (v.length >= 2) ? v[0] + '.' + v[1] : VERSION;
  },

  fullVersion: function () {
    return VERSION;
  }
});