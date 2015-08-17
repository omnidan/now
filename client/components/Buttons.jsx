/**
 * @jsx React.DOM
 */

NewPostButton = ReactMeteor.createClass({
  templateName: 'NewPostButton',

  toggleNewPost() {
    $('#newPost').toggle('fast');
    this.setState({active: !this.state.active});
  },

  getInitialState() {
    return {
      active: false
    };
  },

  render() {
    var className = "nowButton newPost";
    if (this.state.active) className += " active";

    return <span className={className} onClick={this.toggleNewPost}>
      <i className="write icon"></i>
    </span>;
  }
});