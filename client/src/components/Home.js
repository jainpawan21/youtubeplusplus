import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import getYoutubeId from "get-youtube-id";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: "100vh",
    width: "100vw",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
}));

function Home() {
  const classes = useStyles();
  const [videoID, setVideoID] = useState("");
  let history = useHistory();

  function handleClick(e) {
    const id = getYoutubeId(videoID);
    console.log("Youtube vdeo ID found : ", id);

    history.push({
      pathname: "/video",
      search: `?videoID=${id}`,
      state: {
        videoID: id,
      },
    });
  }
  function handleNameChange(e) {
    window.$name = e.target.value;
  }
  function handleTextFieldChange(e) {
    setVideoID(e.target.value);
  }

  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      className={classes.root}
    >
      <Grid item xs={12} md={6} lg={6}>
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h1>Youtube Video Link</h1>
        </div>
        <Grid container justify="center" alignItems="center">
          <Grid item>
            <form noValidate autoComplete="off">
              <TextField
                onChange={handleTextFieldChange}
                id="standard-basic"
                label="Enter video link"
              />
            </form>
            <form noValidate autoComplete="off">
              <TextField
                onChange={handleNameChange}
                id="standard-basic"
                label="Enter your name"
              />
            </form>
            <div
              style={{
                marginTop: "16px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                onClick={handleClick}
                variant="contained"
                color="secondary"
              >
                {" "}
                Submit{" "}
              </Button>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Home;
