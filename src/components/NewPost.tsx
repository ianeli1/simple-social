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
import React, { ChangeEvent, useEffect, useState } from "react";
import { UserData } from "./UserData";
import { formatDate } from "../misc/format";
import * as r from "../misc/reference";
import { connect } from "react-redux";
import { constants } from "os";

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
  innerContent: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "row",
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
  imageContainer: {
    width: 100,
    maxHeight: 200,
    overflow: "hide",

    padding: 8,
    boxSizing: "content-box",
  },
  image: {
    borderRadius: 8,
    width: 100,
    height: "auto",
  },
});

export function NewPostRaw(props: { user: r.User | null }) {
  const [time, setTime] = useState<Date>(new Date());
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [liked, setLiked] = useState(false);
  const user: r.User = props.user || {
    userId: "0",
    name: "0",
    desc: "0",
    icon: null,
  };
  useEffect(() => {
    const dateInterval = setInterval(
      async () => await setTime(new Date()),
      1000 * 60
    );
    return () => {
      clearInterval(dateInterval);
    };
  });

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
      setFile(event.target.files[0]);
    }
  }

  function handleSend() {
    if (content.length >= 5 && user) {
      //send the post lmao
      setImage("");
      setFile(null);
      setContent("");
      setLiked(false);
    }
  }

  const classes = newPostStyles();
  return (
    //It's a header so the feed doesn't change its margin
    <Paper component="header" className={classes.root}>
      <Box className={classes.firstRow}>
        <UserData user={user} />
        <Typography variant="h6">@ {formatDate(time)}</Typography>
      </Box>

      <Paper className={classes.content}>
        <div className={classes.innerContent}>
          <InputBase
            className={classes.input}
            multiline
            placeholder="What are you thinking about?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <ButtonGroup
            orientation="vertical"
            color="primary"
            className={classes.btngroup}
          >
            <input
              style={{ display: "none" }}
              accept="image/*"
              type="file"
              onChange={handleFile}
              name="add-image-button"
              id="add-image-button"
            />
            <label htmlFor="add-image-button">
              <Button component="span">+</Button>
            </label>
            <Button>...</Button>
          </ButtonGroup>
        </div>
        {image.length > 0 && (
          <div className={classes.imageContainer}>
            <img alt="Post pic" src={image} className={classes.image} />
          </div>
        )}
      </Paper>
      <Box className={classes.interaction}>
        <IconButton onClick={() => setLiked(!liked)}>
          <Favorite style={{ color: liked ? "#ff0800" : undefined }} />
        </IconButton>
        <div style={{ width: 20 }} />
        <IconButton onClick={handleSend}>
          <Send />
        </IconButton>
      </Box>
    </Paper>
  );
}

const mapStateToProps = ({ data }: { data: r.State }) => ({
  user: data.currentUser,
});

const mapDispatchToProps = (dispatch: r.AppDispatch) => ({
  /*sendPost: (
    post: r.Post,
    file?: File,
    progressCallback?: (percentage: number) => void
  ) => dispatch(sendPost(post, file, progressCallback)),*/
});

export const NewPost = connect(mapStateToProps, mapDispatchToProps)(NewPostRaw);
