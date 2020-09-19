import * as r from "../misc/reference";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  Container,
  Avatar,
  makeStyles,
  Typography,
  Backdrop,
  CircularProgress,
  Theme,
  Divider,
  Card,
} from "@material-ui/core";
import { getProfile } from "../actions";

import { People, Feed, TopBar } from "../components";

const ProfileStyle = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    padding: 0,
  },
  friendList: {
    flexDirection: "column",
    margin: "0 24px",
    "& > div": {
      margin: "8px 0",
      "& > div": {
        margin: "8px 0",
      },
    },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  outer: {
    padding: 20,
  },
  card: {
    padding: 20,
  },
}));

export const Profile = (props: {
  userId: string;
  profile: r.Profile | null;
  people: { [key: string]: r.User };
  feed: r.Feed;
  getProfile: (userId: string) => void;
}) => {
  const classes = ProfileStyle();
  const [posts, setPosts] = useState<r.Feed>({});
  const [profile, setProfile] = useState<r.Profile | null>(null);
  const [people, setPeople] = useState<{ [key: string]: r.User }>({});
  function getFriends(people: { [key: string]: r.User }, friends: string[]) {
    return (
      friends.reduce(
        (ac: { [key: string]: r.User }, cv) => ({ ...ac, [cv]: people[cv] }),
        {}
      ) || {}
    );
  }

  function getPosts(feed: r.Feed, posts: string[]): r.Feed {
    return (
      posts.reduce(
        (ac: r.Feed, cv: string) => ({ ...ac, [cv]: feed[cv] }),
        {}
      ) || {}
    );
  }

  useEffect(() => {
    props.getProfile(props.userId);
  }, []);
  useEffect(() => {
    props.profile && setProfile(props.profile);
  }, [props.profile]);
  useEffect(() => {
    setPeople(props.people || {});
  }, [props.people]);
  useEffect(() => {
    if (Object.keys(props.feed).length) {
      setPosts((profile && getPosts(props.feed, profile.posts)) || {});
    }
  }, [props.feed]);
  return (
    <Container className={classes.outer}>
      {profile ? (
        <Card className={classes.card}>
          <TopBar user={profile.data} />
          <div className={classes.root}>
            <Feed
              people={people}
              feed={posts}
              user={profile.data}
              drawNewPost={false}
            />
            <Divider orientation="vertical" flexItem />
            <div className={classes.friendList}>
              <Typography variant="h5">
                Friends({String(props.people.length || 0)})
              </Typography>
              <People people={props.people} />
            </div>
          </div>
        </Card>
      ) : (
        <div>
          <Backdrop className={classes.backdrop} open>
            <CircularProgress color="inherit" />
          </Backdrop>
        </div>
      )}
    </Container>
  );
};

const mapStateToProps = ({ data }: { data: r.State }) => ({
  profile: data.currentProfile,
  people: data.users,
  feed: data.feed || {},
});

const mapDispatchToProps = (dispatch: r.AppDispatch) => ({
  getProfile: (userId: string) => dispatch(getProfile(userId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
