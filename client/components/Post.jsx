/**
 * @jsx React.DOM
 */

User = ReactMeteor.createClass({
  templateName: 'User',

  componentWillUpdate(nextProps, nextState) {
    // FIXME: workaround for bug that makes username and digits undefined sometimes
    if (nextProps.username === undefined) nextProps.username = this.props.username;
    if (nextProps.digits === undefined) nextProps.digits = this.props.digits;
  },

  startMeteorSubscriptions() {
    Meteor.subscribe("users");
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
    var { username, digits } = this.props;
    if (this.props.points) digits = this.digits(this.props.points);

    var className;
    if (digits === undefined) className = "username";
    else className = "username " + this.resolveColor(digits);

    var points;
    if (this.props.points !== undefined) points = this.props.points;
    else points = this.resolveCode(digits);

    var pointsBox;
    if (points) pointsBox = <small>[{points}]</small>;

    return <span className={className}>
      {username} {pointsBox}
    </span>;
  }
});

Post = React.createClass({
  getInitialState() {
    return {
      voted: (this.props.voted === undefined) ? false : this.props.voted
    };
  },

  vote() {
    this.setState({ voted: !this.state.voted });
    Meteor.call("vote", this.props.dbId);
    console.log("VOTED", this.props.dbId, this.state.voted);
  },

  render() {
    var { title, url, user, points, createdAt } = this.props;

    user = user ? user : Meteor.user();

    var timestamp = new Date(createdAt);
    var icon = "large " + (this.state.voted ? "orange" : "grey") + " angle up middle aligned icon";
    return <div className="item">
      <i className={icon} onClick={this.vote}></i>
      <div className="content post">
        <a className="header" href={url}>{title}</a>
        <div className="description footer"><span className="points">{points} points</span> - submitted by <User username={user.username} digits={user.digits} /> at <span className="date">{timestamp.toLocaleString()}</span></div>
      </div>
    </div>;
  }
});

PostContainer = ReactMeteor.createClass({
  templateName: 'PostContainer',

  startMeteorSubscriptions() {
    Meteor.subscribe("posts");
    Meteor.subscribe("userData");
  },

  getMeteorState() {
    return {
      posts: Posts.find({}, {sort: {points: -1}}).fetch()
    };
  },

  renderPost(model) {
    var voted = Meteor.user().voted && (Meteor.user().voted.indexOf(model._id) !== -1);
    return <Post
      key={model._id}
      dbId={model._id} // TODO: figure out a cleaner solution than setting _id twice (http://stackoverflow.com/questions/26657023/this-key-in-react-js-0-12)
      title={model.title}
      url={model.url}
      user={model.user}
      points={model.points}
      createdAt={model.createdAt}
      voted={voted}
    />;
  },

  render() {
    if (!this.state.posts) {
      console.warn("No posts passed to PostContainer, not rendering component.");
      return <div className="ui relaxed divided list"></div>;
    }
    return <div className="ui relaxed divided list">
      { this.state.posts.map(this.renderPost) }
    </div>;
  }
});