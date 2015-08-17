Meteor.startup(function () {
  AutoForm.setDefaultTemplate("semanticUI");
  Meteor.subscribe("userData");
});