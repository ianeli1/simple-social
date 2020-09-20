import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  InputBase,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import { Favorite, Send } from "@material-ui/icons";
import React, { useState } from "react";
import { UserData } from "./UserData";
import { formatDate } from "../misc/format";
import * as r from "../misc/reference";

const newPostStyles = makeStyles({
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
  content: {
    display: "flex",
    margin: "8px 20px",
    flexDirection: "row",
    justifyContent: "stretch",
    alignItems: "stretch",
    minHeight: 100,
  },
  interaction: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    margin: 10,
  },
  input: {
    margin: 8,
    flexGrow: 1,
  },
  btngroup: {
    "& :nth-child(1)": {
      flexGrow: 1,
    },
  },
});

export function NewPost(props: { user: r.User; post: r.Post }) {
  const [time, setTime] = useState<Date>(new Date());
  setInterval(async () => await setTime(new Date()), 1000 * 60);
  const classes = newPostStyles();
  return (
    //It's a header so the feed doesn't change its margin
    <Paper component="header" className={classes.root}>
      <Box className={classes.firstRow}>
        <UserData user={props.user} />
        <Typography variant="h6">@ {formatDate(time)}</Typography>
      </Box>
      <Paper className={classes.content}>
        <InputBase
          className={classes.input}
          multiline
          placeholder="What are you thinking about?"
        />
        <ButtonGroup
          orientation="vertical"
          color="primary"
          className={classes.btngroup}
        >
          <Button>+</Button>
          <Button>...</Button>
        </ButtonGroup>
      </Paper>
      <Box className={classes.interaction}>
        <IconButton>
          <Favorite />
        </IconButton>
        <div style={{ width: 20 }} />
        <IconButton>
          <Send />
        </IconButton>
      </Box>
    </Paper>
  );
}
