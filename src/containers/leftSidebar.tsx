import * as r from "../misc/reference";
import {
  ListItemIcon,
  ListItem,
  ListItemText,
  Divider,
  List,
  Drawer,
  Hidden,
  makeStyles,
  Theme,
  useTheme,
} from "@material-ui/core";
import { Inbox, Mail, AccountBox } from "@material-ui/icons";
import React, { Component } from "react";
import { connect } from "react-redux";

import classes from "*.module.css";
import { Link } from "react-router-dom";

const drawerWidth = 250;
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  content: {
    flexGrow: 1,
    overflow: "hidden",
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
}));

export function LeftSidebar(props: {
  mobileOpen: boolean;
  setMobileOpen: () => void;
  routes: {
    news: string;
    userProfile: string;
  };
  children: React.ReactNode;
}) {
  const { routes } = props;
  const classes = useStyles();
  const theme = useTheme();
  const container =
    window !== undefined ? () => window.document.body : undefined;
  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        <ListItem
          button
          key="news"
          component={(props) => <Link to={routes.news} {...props} />}
        >
          <ListItemIcon>
            <Inbox />
          </ListItemIcon>
          <ListItemText primary="Newsfeed" />
        </ListItem>
        <ListItem
          button
          key="profile"
          component={(props) => <Link to={routes.userProfile} {...props} />}
        >
          <ListItemIcon>
            <AccountBox />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
        <ListItem button key="idk">
          <ListItemIcon>
            <Inbox />
          </ListItemIcon>
          <ListItemText primary="idk hah" />
        </ListItem>
      </List>
    </div>
  );
  return (
    <div className={classes.root}>
      <nav className={classes.drawer}>
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={"left"}
            open={props.mobileOpen}
            onClose={props.setMobileOpen}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>{props.children}</main>
    </div>
  );
}

const mapStateToProps = (state: r.State) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(LeftSidebar);
