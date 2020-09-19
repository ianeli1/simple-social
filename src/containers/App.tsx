import React, { Component } from "react";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import { Switch, Route, RouteComponentProps } from "react-router-dom";

import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Container,
  CssBaseline,
  createStyles,
  Theme,
  Hidden,
  Typography,
} from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import NewsFeed from "./feed";
import * as r from "../misc/reference";
import { LeftSidebar } from "./leftSidebar";
import Profile from "./profile";

const AppCSS = (theme: Theme) =>
  createStyles({
    root: {
      overflow: "hidden",
    },
    innerApp: {
      flexGrow: 1,
    },
    outer: {
      maxHeight: "100vh",
    },
  });

type AppState = {
  mobileOpen: boolean;
};
interface AppProps extends WithStyles<typeof AppCSS> {
  /*
  currentUser: r.User;
  currentProfile: r.Profile | null;
  feed: r.Feed | null;
  users: {
    [key: string]: r.User;
  };
  ref: r.Feed;*/
}

/*
Load /
if user is not registered, redirect to /register
draw dummy news feed with blur and 
show a register/sign in window
if user is logged in, redirect to /, show news feed

*/

interface MatchParams {
  id: string;
}

class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      mobileOpen: false,
    };
  }

  render() {
    return (
      <div className={this.props.classes.outer}>
        <CssBaseline />
        <Box className={this.props.classes.root}>
          <LeftSidebar
            mobileOpen={this.state.mobileOpen}
            routes={{
              news: "/",
              userProfile: "/profile", //change
            }}
            setMobileOpen={() => this.setState({ mobileOpen: false })}
          >
            <AppToolbar setMenu={() => this.setState({ mobileOpen: true })} />
            <Box className={this.props.classes.innerApp}>
              <Switch>
                <Route exact path="/">
                  <NewsFeed />
                </Route>
                <Route
                  path="/profile/:id"
                  render={({ match }: RouteComponentProps<MatchParams>) => (
                    <Profile userId={match.params.id} />
                  )}
                ></Route>
              </Switch>
            </Box>
          </LeftSidebar>
        </Box>
      </div>
    );
  }
}

function AppToolbar(props: { setMenu: () => void }) {
  return (
    <AppBar position="static">
      <Toolbar>
        <Hidden smUp implementation="css">
          <IconButton onClick={props.setMenu}>
            <Menu />
          </IconButton>
        </Hidden>
        <Typography variant="h5">Simple-Social</Typography>
      </Toolbar>
    </AppBar>
  );
}

export default withStyles(AppCSS)(App);
