import { useLocation } from "react-router-dom";
import RoomIdDisplay from "./RoomIdDisplay";
import ReactPlayer from "react-player/lazy";
import { useEffect, useState, useRef } from "react";
import { v4 as uuid } from "uuid";
import socketIOClient from "socket.io-client";
// import Speech from "react-speech";
// import VideoPlayer from './VideoPlayer'
import "../Chat.css";
import { Container, TextField, Button, Chip, Grid } from "@material-ui/core";
const ENDPOINT = `http://jainpawan.southeastasia.cloudapp.azure.com:8000/`;

// const ENDPOINT = `http://localhost:8000`

function Video() {
  const location = useLocation();
  const [videoID, setVideoID] = useState("");
  const [keyword, setKeyword] = useState("");
  const [theatreStarted, toggleTheatreStarted] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const currentMsg = useRef("");
  const socketRef = useRef();
  const [theatreName, setTheatreName] = useState("");
  const [playing, setPlaying] = useState(true);
  const [url, setUrl] = useState(null);
  const [summary, setSummary] = useState("");
  const [timestamps, setTimestamps] = useState([]);

  useEffect(() => {
    setVideoID(location.state.videoID);
    console.log(
      "Video is ",
      `https://www.youtube.com/watch?v=${location.state.videoID}`
    );
    setUrl(`https://www.youtube.com/watch?v=${location.state.videoID}`);
    console.log("Recieved video ID : ", location.state.videoID);

    socketRef.current = socketIOClient.connect(ENDPOINT);
    socketRef.current.on("chatToClient", (data) => {
      console.log("Recieved chat message from server : ", data);
      // var newChats = messages;
      // newChats.push(data);
      // setMessages(newChats)
      // console.log("Now messages are :: ", newChats)
      setMessages((oldChats) => [...oldChats, data]);
    });

    socketRef.current.on("playVideo", () => {
      console.log("Playing videos");
      setPlaying(true);
    });
    socketRef.current.on("pauseVideo", () => {
      console.log("Pausing videos");
      setPlaying(false);
    });

    socketRef.current.on("resetVideo", () => {
      var newUrl = `https://www.youtube.com/watch?v=${location.state.videoID}&t=0s`;
      console.log("New URL : ", newUrl);
      setUrl(newUrl);
    });
    // eslint-disable-next-line
  }, []);

  function handleMsgSend() {
    console.log("message value", currentMsg.current.value);
    const data = {
      msg: message,
      from: window.$name,
      roomId: window.$roomId,
    };
    console.log(data);
    setMessage("");
    socketRef.current.emit("chatToServer", data);
  }

  function handleCreateTheatre(e) {
    const ID = uuid();
    setRoomId(ID);
    toggleTheatreStarted(true);
    window.$roomId = ID;
    socketRef.current.emit("join room", ID);
  }

  function handleJoinTheatre(e) {
    toggleTheatreStarted(true);
    setRoomId(theatreName);
    window.$roomId = theatreName;
    socketRef.current.emit("join room", theatreName);
  }

  function theatreNameChange(e) {
    setTheatreName(e.target.value);
  }

  function handleKeywordChange(e) {
    setKeyword(e.target.value);
  }

  async function searchKeyword(e) {
    if (keyword === "") return;
    // code for searching keyword
    var url = `http://captionapi.herokuapp.com/?video_id=${videoID}&keyword=${keyword}`;
    console.log(url);
    const data = await fetch(url)
      .then((res) => res.json())
      .then((res) => res)
      .catch((e) => console.log(e));
    console.log("Keyword search result : ", data);
    setTimestamps(data);
    //         setTimestamps(hardcode_timestamps)
  }

  async function getCaptions() {
    var url = `http://captionapi.herokuapp.com/?video_id=${videoID}&keyword=none`;
    console.log(url);
    const data = await fetch(url)
      .then((res) => res.json())
      .then((res) => res)
      .catch((e) => console.log(e));
    console.log("Captions : ", data.text);
    return data.text;
    // setTimestamps(data)
  }

  async function getSummary(e) {
    // code for getting summary
    console.log("Getting summary...");
    const captions = await getCaptions();
    var url = `https://api-summary.herokuapp.com/`;
    const payload = {
      text: captions,
    };
    const body = JSON.stringify(payload);
    // console.log(body)
    const data = await fetch(url, { method: "POST", body: body })
      .then((res) => res.json())
      .then((res) => res)
      .catch((e) => console.log(e));
    console.log("Summary : ", data);
    setSummary(data.summary);
  }

  function playVideo() {
    socketRef.current.emit("playVideo", window.$roomId);
  }
  function pauseVideo() {
    socketRef.current.emit("pauseVideo", window.$roomId);
  }

  function togglePlay() {
    console.log("current playing : ", playing);
    const bool = !playing;
    setPlaying(bool);
    if (bool) {
      playVideo();
    } else {
      pauseVideo();
    }
  }

  function handleTimestampList(timestamp) {
    console.log("For timestamp : ", timestamp);
    var time = Math.floor(timestamp);
    var newUrl = `https://www.youtube.com/watch?v=${videoID}&t=${time}`;
    console.log(newUrl);
    setUrl(newUrl);
  }

  return (
    <div style={{ marginTop: "60px" }}>
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={7}>
            {url && (
              <ReactPlayer
                url={url}
                playing={playing}
                controls={true}
                width="100%"
                height="400px"
              />
            )}
            <Button
              color="primary"
              variant="contained"
              onClick={togglePlay}
              style={{ marginTop: "8px" }}
            >
              Toggle
            </Button>
          </Grid>
          <Grid item xs={5}>
            {!theatreStarted && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleCreateTheatre}
                  >
                    Create a theatre
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Enter Theatre ID"
                    id="standard-basic"
                    onChange={theatreNameChange}
                  />
                  <Button
                    color="secondary"
                    variant="contained"
                    onClick={handleJoinTheatre}
                    style={{ marginTop: "8px" }}
                  >
                    Enter Theatre
                  </Button>
                </Grid>
              </Grid>
            )}

            {theatreStarted && (
              <Grid item xs={12}>
                <RoomIdDisplay roomId={roomId} />
              </Grid>
            )}

            {theatreStarted && (
              <Grid container style={{ marginTop: "16px" }}>
                <Grid
                  item
                  xs={12}
                  className="textChat"
                  style={{ padding: "8px" }}
                >
                  {messages &&
                    messages.map((message, index) => {
                      // return (<div key={index} className="otherUserChat">{message.msg}</div>)
                      if (message.from !== window.$name) {
                        return (
                          <div key={index} className="otherUserChat">
                            {message.msg}
                          </div>
                        );
                      } else {
                        return (
                          <div key={index} className="currentUserChat">
                            {message.msg}
                          </div>
                        );
                      }
                    })}
                  <TextField
                    type="text"
                    color="primary"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    label="Type your message"
                  />
                  <Button
                    onClick={handleMsgSend}
                    color="primary"
                    variant="contained"
                  >
                    Send
                  </Button>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
        {!theatreStarted && (
          <Grid container spacing={2}>
            <Grid item xs={7}>
              <TextField
                onChange={handleKeywordChange}
                id="keyword"
                label="keyword"
                value={keyword}
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={searchKeyword}
              >
                Search keyword
              </Button>
              <div style={{ marginTop: "8px" }}>
                {timestamps &&
                  timestamps.map((timestamp, index) => {
                    return (
                      <Chip
                        key={index}
                        size="small"
                        label={timestamp}
                        clickable
                        onClick={() => handleTimestampList(timestamp)}
                        color="secondary"
                        variant="outlined"
                        style={{ margin: "4px" }}
                      />
                    );
                  })}
              </div>
            </Grid>
            <Grid item xs={5}>
              <Button
                variant="contained"
                color="secondary"
                onClick={getSummary}
                style={{ marginBottom: "8px" }}
              >
                Get summary of the video
              </Button>
              <TextField
                disabled
                id="summary"
                name="summary"
                multiline
                rows={5}
                placeholder="summary"
                variant="outlined"
                value={summary}
                fullWidth
              />
              {/* <Speech
                stop={true}
                pause={true}
                resume={true}
                text={summary ? summary : "Hi I am pawan jain"}
              /> */}

            </Grid>
          </Grid>
        )}
      </Container>
    </div>
  );
}

export default Video;
