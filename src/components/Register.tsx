import * as r from "../misc/reference";

import React, { ChangeEvent, useState } from "react";
import {
  AppBar,
  Avatar,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogTitle,
  IconButton,
  makeStyles,
  Paper,
  Slide,
  TextField,
  Theme,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { TransitionProps } from "@material-ui/core/transitions/transition";
import { TopBar } from ".";
import { green } from "@material-ui/core/colors";

const RegisterStyle = makeStyles((theme: Theme) => ({
  appBar: {
    position: "relative",
  },
  root: {},
  entry: {},
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  card: {
    padding: theme.spacing(2),
    margin: theme.spacing(2),
  },
  desc: {
    display: "flex",
  },
  progress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type RegisterProps = {
  open: boolean;
  close: () => void;
  createUser: (
    email: string,
    password: string,
    user: Omit<r.User, "userId">,
    icon: File | null,
    progressCallback?: (percentage: number) => void
  ) => Promise<boolean>;
};

export const Register = (props: RegisterProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [desc, setDesc] = useState("");
  const [error, setError] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const classes = RegisterStyle();
  async function handleClose() {
    props.close();
  }
  async function handleRegister() {
    if (name && email && password) {
      const result = await props.createUser(
        email,
        password,
        {
          name,
          desc,
          icon: null,
        },
        file,
        (percentage) => setLoading(percentage)
      );
      if (result) {
        handleClose();
      } else {
        setError(true); //TODO: be more specific
      }
    }
  }

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
      setFile(event.target.files[0]);
    }
  }
  const [loading, setLoading] = useState(0);
  return (
    <Dialog
      fullScreen
      open={props.open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <Close />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Register a new account
          </Typography>
        </Toolbar>
      </AppBar>
      <Container className={classes.root}>
        <Paper className={classes.card} variant="outlined">
          <Typography variant="h6" className={classes.entry}>
            Full Name
          </Typography>
          <TextField
            autoFocus
            error={error}
            id="name"
            label="Full Name"
            type="text"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
        </Paper>
        <Paper className={classes.card} variant="outlined">
          <Typography variant="h6" className={classes.entry}>
            Email
          </Typography>
          <TextField
            autoFocus
            error={error}
            id="email"
            label="Email"
            type="email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
        </Paper>
        <Paper className={classes.card} variant="outlined">
          <Typography variant="h6" className={classes.entry}>
            Password
          </Typography>
          <TextField
            autoFocus
            error={error}
            id="password"
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
        </Paper>
        <Paper className={classes.card} variant="outlined">
          <Typography variant="h6" className={classes.entry}>
            Avatar & desc
          </Typography>
          <div>
            <Paper variant="outlined" className={classes.card}>
              <TopBar
                user={{ userId: "0", name: name, desc: desc, icon: image }}
              />
            </Paper>
            <div className={classes.desc}>
              <div>
                <label htmlFor="image-picker">
                  <input
                    style={{ display: "none" }}
                    accept="image/*"
                    type="file"
                    onChange={handleFile}
                    name="image-picker"
                    id="image-picker"
                  />
                  <Button color="primary" variant="contained" component="span">
                    Choose Avatar
                  </Button>
                </label>
              </div>
              <TextField
                autoFocus
                error={error}
                id="desc"
                label="Description"
                type="text"
                variant="outlined"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                fullWidth
              />
            </div>
          </div>
        </Paper>
        <div>
          <Button
            onClick={handleRegister}
            variant="contained"
            color="primary"
            disabled={Boolean(loading)}
          >
            {loading > 0 ? String(loading) + "%" : "Create user"}
          </Button>
          {loading && (
            <CircularProgress size={24} className={classes.progress} />
          )}
        </div>
      </Container>
    </Dialog>
  );
};
