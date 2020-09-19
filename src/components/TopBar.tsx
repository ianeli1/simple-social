import * as r from "../misc/reference";
import React from "react";
import { makeStyles, Avatar, Typography } from "@material-ui/core";
const TopBarStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "row",
  },
  avatar: {
    height: 80,
    width: 80,
  },
  namedesc: {
    display: "flex",
    margin: "0 8px",
    flexDirection: "column",
  },
});

export function TopBar(props: { user: r.User }) {
  const classes = TopBarStyles();
  return (
    <div className={classes.root}>
      {props.user.icon ? (
        <Avatar
          className={classes.avatar}
          alt={props.user.name[0]}
          src={props.user.icon}
        />
      ) : (
        <Avatar className={classes.avatar}>{props.user.name[0]}</Avatar>
      )}
      <div className={classes.namedesc}>
        <Typography variant="h4">{props.user.name}</Typography>
        {props.user.desc && (
          <Typography variant="h6">{props.user.desc}</Typography>
        )}
      </div>
    </div>
  );
}
