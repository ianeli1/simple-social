import {
  Theme,
  createStyles,
  WithStyles,
  withStyles,
  Backdrop,
  CircularProgress,
  Container,
  Typography,
} from "@material-ui/core";
import React from "react";
import { NewPost, Post } from ".";
import * as r from "../misc/reference";

const FeedCSS = (theme: Theme) =>
  createStyles({
    root: {
      "&:first-child": {
        margin: "20px 0",
      },
      "& > div": {
        margin: "8px 0",
      },
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
  });

interface FeedProps extends WithStyles<typeof FeedCSS> {
  feed: r.Feed | null;
  user: r.User;
  people: {
    [key: string]: r.User;
  };
  drawNewPost?: boolean;
}

function Feed({ drawNewPost = true, ...props }: FeedProps) {
  return props.feed ? (
    <Container className={props.classes.root}>
      {drawNewPost && <NewPost user={props.user} />}
      {Object.keys(props.feed).length ? (
        Object.entries(props.feed).map((
          [ts, post] //TODO: timestamppppp
        ) => <Post key={ts} user={props.people[post.userId]} post={post} />)
      ) : (
        <Typography variant="h6">There's no posts to be shown</Typography>
      )}
    </Container>
  ) : (
    <div>
      <Backdrop className={props.classes.backdrop} open>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export const StyledFeed = withStyles(FeedCSS)(Feed);
