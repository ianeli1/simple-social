import { Avatar, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import * as r from "../misc/reference";

const userDataStyle = makeStyles({
  root: {
    background: "#E1E2E1",
    borderRadius: 20,
    height: 40,
    minWidth: 100,
    maxWidth: 300,
    overflow: "hide",
    display: "flex",
    flexDirection: "row",
    marginRight: 8,
    alignItems: "center",
    cursor: "pointer",
    "&:hover": {
      background: "#C1C2C1",
      transition: "background 500ms",
    },
  },
  nameBox: {
    marginLeft: 4,
    marginRight: 8,
    height: 40,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 0,
  },
});

export function UserData(props: {
  user: r.User;
  extra?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>, user: r.User) => void;
}) {
  const classes = userDataStyle();
  return (
    <div
      className={classes.root}
      key={props.user.userId}
      onClick={(e) => props.onClick && props.onClick(e, props.user)}
    >
      {props.user.icon ? (
        <Avatar alt={props.user.name} src={props.user.icon} />
      ) : (
        <Avatar>{props.user.name[0]}</Avatar>
      )}
      <div className={classes.nameBox}>
        <Typography variant="h5" noWrap>
          {props.user.name}
        </Typography>
        {props.extra && <Typography variant="h6">{props.extra}</Typography>}
      </div>
    </div>
  );
}
