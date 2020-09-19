import React, { Component } from "react";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import { Switch, Route, RouteComponentProps, Redirect } from "react-router-dom";

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
  Button,
} from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import NewsFeed from "./feed";
import * as r from "../misc/reference";
import { LeftSidebar } from "./leftSidebar";
import Profile from "./profile";
import { connect } from "react-redux";
import { Login } from "../components/Login";
import { createNewUser, login } from "../misc/firebaseMgmt";
import { Register } from "../components/Register";
import { UserData } from "../components";

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
  user: r.User | null;
  mobileOpen: boolean;
  loggedIn: boolean;
  showLogin: boolean;
  showRegister: boolean;
};
interface AppProps extends WithStyles<typeof AppCSS> {
  user: r.User | null;
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
      user: null,
      mobileOpen: false,
      loggedIn: Boolean(this.props.user),
      showLogin: false,
      showRegister: true,
    };
  }

  componentDidUpdate() {
    if (
      !this.state.user ||
      (this.props.user && this.state.user.userId != this.props.user.userId)
    ) {
      this.setState({ user: this.props.user });
    }
  }

  render() {
    return (
      <div className={this.props.classes.outer}>
        <CssBaseline />
        <Login
          login={login}
          close={() => this.setState({ showLogin: false })}
          open={this.state.showLogin}
        />
        <Register
          open={this.state.showRegister}
          close={() => this.setState({ showRegister: false })}
          createUser={createNewUser}
        />
        <Box className={this.props.classes.root}>
          <LeftSidebar
            mobileOpen={this.state.mobileOpen}
            routes={{
              news: "/",
              userProfile: "/profile", //change
            }}
            setMobileOpen={() => this.setState({ mobileOpen: false })}
          >
            <AppToolbar
              user={this.state.user}
              setMenu={() => this.setState({ mobileOpen: true })}
              openLogin={() => this.setState({ showLogin: true })}
              openRegister={() => this.setState({ showRegister: true })}
            />
            <Box className={this.props.classes.innerApp}>
              <Switch>
                <Route exact path="/">
                  <NewsFeed />
                </Route>
                {this.props.user && (
                  <Route exact path="/profile">
                    <Redirect to={"/profile/" + this.props.user.userId} />
                  </Route>
                )}

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

function AppToolbar(props: {
  user: r.User | null;
  setMenu: () => void;
  openLogin: () => void;
  openRegister: () => void;
}) {
  return (
    <AppBar position="static">
      <Toolbar>
        <Hidden smUp implementation="css">
          <IconButton onClick={props.setMenu}>
            <Menu />
          </IconButton>
          <div style={{ flexGrow: 1 }} />
          {props.user ? (
            <UserData user={props.user} />
          ) : (
            <div>
              <Button onClick={props.openLogin}>Login</Button>
              <Button onClick={props.openLogin}>Register</Button>
            </div>
          )}
        </Hidden>
        <Typography variant="h5">Simple-Social</Typography>
      </Toolbar>
    </AppBar>
  );
}

const mapStateToProps = ({ data }: { data: r.State }) => ({
  user: data.currentUser,
});

export default connect(mapStateToProps)(withStyles(AppCSS)(App));
