import {
  Box,
  IconButton,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import { Favorite, ChatBubble, Share } from "@material-ui/icons";
import React from "react";
import { UserData } from "./UserData";
import * as r from "../misc/reference";
import { formatDate } from "../misc/format";

const postStyle = makeStyles({
  root: {
    minHeight: 100,
    display: "flex",
    flexDirection: "column",
    padding: 8,
  },
  firstRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  content: {},
  interaction: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    margin: 10,
  },
});

export function Post(props: { user: r.User; post: r.Post }) {
  const classes = postStyle();
  //TODO: Add timestamp
  return (
    <Paper className={classes.root}>
      <Box className={classes.firstRow}>
        <UserData user={props.user} />
        <Typography variant="h6">
          @ {formatDate(props.post.timestamp)}
        </Typography>
      </Box>
      <Box className={classes.content}>
        <Typography variant="body1">{props.post.content}</Typography>
      </Box>
      <Box className={classes.interaction}>
        <IconButton>
          <Favorite />
        </IconButton>
        <Typography variant="subtitle1">{123}</Typography>
        <IconButton>
          <ChatBubble />
        </IconButton>
        <Typography variant="subtitle1">{321}</Typography>
        <IconButton>
          <Share />
        </IconButton>
      </Box>
    </Paper>
  );
}
