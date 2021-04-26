const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const path = require("path");
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const PORT = process.env.PORT || 8000;

app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.append("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use(express.urlencoded({ extended: false }));
app.use(express.raw());
app.use(express.text());
app.use(express.json());

var rooms = [];

io.on("connection", (socket) => {
  socket.on("chatToServer", (data) => {
    console.log(
      "Recieved chat message from client : ",
      data,
      "=======",
      data.roomId
    );
    rooms[data.roomId].map((socket) => {
      socket.emit("chatToClient", {
        from: data.from,
        msg: data.msg,
      });
    });
  });

  socket.on("playVideo", (roomId) => {
    if (rooms[roomId]) {
      console.log("Playing videos");
      rooms[roomId].map((usersocket) => {
        if (usersocket !== socket) {
          console.log("playing user video");
          usersocket.emit("playVideo");
        }
      });
    }
  });

  socket.on("pauseVideo", (roomId) => {
    if (rooms[roomId]) {
      console.log("Pausing videos");
      rooms[roomId].map((usersocket) => {
        if (usersocket !== socket) {
          console.log("pausing user video");
          usersocket.emit("pauseVideo");
        }
      });
    }
  });

  socket.on("msg", (msg) => {
    console.log("Message recieved ", msg);
  });

  socket.on("join room", (roomId) => {
    console.log("Room join request : ", roomId);
    socket.join(roomId);
    if (rooms[roomId]) {
      // room exist
      rooms[roomId].push(socket);
    } else {
      // room doesn't exist
      rooms[roomId] = [socket];
    }

    if (rooms[roomId]) {
      rooms[roomId].map((usersocket) => {
        usersocket.emit("resetVideo");
      });
    }

    console.log("for roomID : ", roomId, "=====", rooms[roomId].length);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

app.use(express.static(path.join(__dirname, "client", "build")));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
