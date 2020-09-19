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
  user: r.User;
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
    this.props.getFeed(this.props.user.userId);
  }

  componentDidUpdate(prevProps: NewsFeedProps) {
    //TODO: look for changes
    if (!this.state.feed && this.props.feed) {
      this.setState({ feed: this.props.feed });
    }
  }

  render() {
    return <Feed user={this.props.user} feed={this.state.feed} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewsFeed);
