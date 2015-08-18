/**
 * @jsx React.DOM
 */

User = ReactMeteor.createClass({
  templateName: 'User',

  startMeteorSubscriptions() {
    Meteor.subscribe('users');
    Meteor.subscribe('myData');
  },

  getMeteorState() {
    var user;
    if (this.props.user) user = Meteor.users.findOne(this.props.user);
    return {
      username: user ? user.username : 'loading...',
      points: user ? user.points : 0
    };
  },

  resolveColor(digits) {
    return 'rank' + digits;
  },

  resolveCode(digits) {
    if (digits === 0) return 'o';
    else return 'x'.repeat(digits);
  },

  digits(x) {
    if (!x || (x === 0)) return 0;

    // math-magic - from http://stackoverflow.com/a/28203456
    return (math.log((x ^ (x >> 31)) - (x >> 31), 10) | 0) + 1;
  },

  render() {
    var { username, points } = this.state;
    if (!points) points = 0;
    var digits = this.digits(points);

    var className;
    if (digits === undefined) className = "username";
    else className = "username " + this.resolveColor(digits);

    if (!this.props.me) points = this.resolveCode(digits);

    return <span className={className}>
      {username} <small>[{points}]</small>
    </span>;
  }
});