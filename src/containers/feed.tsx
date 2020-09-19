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
}

class NewsFeed extends Component<NewsFeedProps, NewsFeedState> {
  constructor(props: NewsFeedProps) {
    super(props);
    this.state = {
      feed: null,
    };
  }

  componentDidMount() {
    this.props.user && this.props.getFeed(this.props.user.userId); //what if the object gets rendered but user doesn't exist?
  }

  componentDidUpdate(prevProps: NewsFeedProps) {
    //TODO: look for changes
    if (!this.state.feed && this.props.feed) {
      this.setState({ feed: this.props.feed });
    }
  }

  render() {
    return this.props.user ? (
      <Feed
        people={this.props.people}
        user={this.props.user}
        feed={this.state.feed}
      />
    ) : (
      <p>Uh oh, this shouldn't happen</p>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewsFeed);
