import * as r from "../misc/reference";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { getFeed } from "../actions";
import { Feed } from "../components";

const mapStateToProps = ({ data }: { data: r.State }) => ({
  feed: data.feed,
  people: data.users,
  user: data.currentUser,
  drawNewPost: true,
});

const mapDispatchToProps = (dispatch: r.AppDispatch) => ({
  getFeed: (userId: string) => dispatch(getFeed(userId)),
});

interface NewsFeedProps {
  feed: r.Feed | null;
  user: r.User | null;
  people: {
    [key: string]: r.User;
  };
  drawNewPost: boolean;
  getFeed: (userId: string) => void;
}

interface NewsFeedState {
  feed: r.Feed | null;
  user: r.User | null;
}

class NewsFeed extends Component<NewsFeedProps, NewsFeedState> {
  constructor(props: NewsFeedProps) {
    super(props);
    this.state = {
      user: props.user,
      feed: null,
    };
  }

  componentDidMount() {
    if (this.state.user) {
      this.props.getFeed(this.state.user.userId);
    }
  }

  componentDidUpdate(prevProps: NewsFeedProps) {
    //TODO: look for changes
    if (
      this.props.user &&
      (!this.state.user || this.state.user.userId != this.props.user.userId)
    ) {
      this.setState(
        { user: this.props.user },
        () => this.state.user && this.props.getFeed(this.state.user.userId)
      );
    }
    if (!this.state.feed && this.props.feed) {
      this.setState({ feed: this.props.feed });
    }
  }

  render() {
    return this.state.user ? (
      <Feed
        people={this.props.people}
        user={this.state.user}
        feed={this.state.feed}
      />
    ) : (
      <p>Uh oh, this shouldn't happen</p>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewsFeed);
