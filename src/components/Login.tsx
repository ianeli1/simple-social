import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  TextField,
} from "@material-ui/core";
import React, { useState } from "react";

const LoginStyles = makeStyles({
  root: {},
});

interface LoginProps {
  login: (email: string, password: string) => Promise<boolean>;
  close: () => void;
  open: boolean;
}

export const Login = (props: LoginProps) => {
  const classes = LoginStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  function handleClose() {
    props.close();
  }

  async function handleLogin() {
    const result = await props.login(email, password);
    if (result) {
      setError(false);
      props.close();
    } else {
      setError(true);
    }
  }
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="login-window"
      open={props.open}
    >
      <DialogTitle>Please input your credentials</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          error={error}
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
        <TextField
          autoFocus
          error={error}
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleLogin}>Login</Button>
      </DialogActions>
    </Dialog>
  );
};
