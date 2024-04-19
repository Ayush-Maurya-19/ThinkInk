// import express
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const userRouter = require("./routers/userRouter");
const scoreRouter = require("./routers/scoreRouter");
const utilRouter = require("./routers/utils");
const cors = require("cors");

const constantData = require("./constants");

const usersName = [];
const createdRooms = [];

// initialize express
const app = express();
const port = 5000;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

// middlewares
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
);

app.use("/user", userRouter);
app.use("/score", scoreRouter);
app.use("/util", utilRouter);

app.use(express.static("./uploads"));

// routes
app.get("/", (req, res) => {
  res.send("response from index");
});

app.get("/home", (req, res) => {
  res.send("response from home");
});

app.get("/add", (req, res) => {
  res.send("response from add");
});

app.get("/getall", (req, res) => {
  res.send("response from getall");
});

// socket.io

const getRandomElement = (arr) => {
  var index = Math.floor(Math.random() * arr.length);
  // console.log(  index);
  return arr[index];
};

io.on("connection", (socket) => {
  console.log("User Connected", socket.id);

  //drawing logic

  socket.on("draw-line", ({ room, line, tool, points }) => {
    console.log({ room, line, tool, points });
    socket.to(room).emit("draw-line", { line, tool, points });
  });

  socket.on("set-name", (name) => {
    if (usersName.includes(name)) {
      socket.emit("name-exists", "Name already exists");
    } else {
      usersName.push(name);
      socket.emit("name-set", name);
      console.log(`User set name ${name}`);
    }
  });

  socket.on("join-room", (data) => {
    const { room, username } = data;
    socket.join(room);
    console.log(socket.rooms);
    if (createdRooms.find((r) => r.roomName === room)) {
      createdRooms
        .find((r) => r.roomName === room)
        .users.push({ socketId: socket.id, name: username });
    } else {
      createdRooms.push({
        canvasData: null,
        gameStarted: false,
        userDrawing: null,
        roomName: room,
        users: [{ socketId: socket.id, name: username }],
      });
    }
    console.log(`User joined room ${room}`);
    io.emit("notify-room", createdRooms);
  });

  socket.on("get-room-info", () => {
    socket.emit("notify-room", createdRooms);
  });

  socket.on("leave-room", (room) => {
    const index = createdRooms.findIndex((r) => r.roomName === room);
    createdRooms[index].users = createdRooms[index].users.filter(
      (u) => u.socketId !== socket.id
    );
    if (createdRooms[index].users.length === 0) {
      createdRooms.splice(index, 1);
    }
    socket.leave(room);
    io.emit("notify-room", createdRooms);
    console.log(`User left room ${room}`);
  });

  socket.on("delete-room", (room) => {
    const index = createdRooms.findIndex((r) => r.roomName === room);
    createdRooms.splice(index, 1);
    createdRooms.forEach((room) => {
      room.users = room.users.filter((u) => u.socketId !== socket.id);
    });
    io.emit("notify-room", createdRooms);
    console.log(`User deleted room ${room}`);
  });

  socket.on("message", ({ room, message }) => {
    console.log({ room, message });
    io.to(room).emit("receive-message", message);
  });

  socket.on("disconnect", () => {
    //this is to remove user from the room if the page reloads
    createdRooms.forEach((room) => {
      room.users = room.users.filter((u) => u.socketId !== socket.id);
    });
    io.emit("notify-room", createdRooms);

    console.log("User Disconnected", socket.id);
  });

  socket.on("play-game", (room) => {
    const currentRoom = createdRooms.find((r) => r.roomName === room);
    currentRoom.gameStarted = true;
    createdRooms.rounds = 2;
    createdRooms.currentRound = 1;
    io.emit("notify-room", createdRooms);
  });

  socket.on("command-start-game", (roomName) => {
    // console.log(roomName);
    // console.log(createdRooms[0].users.map((obj) => obj.socketId));
    console.log("Game Start from client");
    socket.to(roomName).emit("room-start-game");
  });

  socket.on("command-play-game", (roomName) => {
    console.log("Game Play from client");
    const currentRoom = createdRooms.find((r) => r.roomName === roomName);
    currentRoom.gameStarted = true;
    currentRoom.notPlayedUsers = currentRoom.users;
    currentRoom.userDrawing = getRandomElement(currentRoom.notPlayedUsers);
    console.log('next player '+currentRoom.userDrawing.name);
    // remove the use drawing
    currentRoom.notPlayedUsers = currentRoom.notPlayedUsers.filter(
      (u) => u.socketId !== currentRoom.userDrawing.socketId
    );
    console.log(createdRooms);
    socket.to(roomName).emit("room-play-game", currentRoom);
  });

  socket.on("turn-complete", (roomName) => {
    console.log("Turn complete");
    // socket.emit("next-turn", (roomName) => {
      const currentRoom = createdRooms.find((r) => r.roomName === roomName);
      console.log(currentRoom);
      if (currentRoom.notPlayedUsers.length === 0 && currentRoom.currentRound < currentRoom.rounds) {
        currentRoom.currentRound += 1;
        currentRoom.notPlayedUsers = currentRoom.users;
        socket.to(roomName).emit("round-update", currentRoom);
        console.log('round update');
      }
      currentRoom.userDrawing = getRandomElement(currentRoom.notPlayedUsers);
      // console.log('next player '+currentRoom.userDrawing.name);
      currentRoom.notPlayedUsers = currentRoom.notPlayedUsers.filter(
        (u) => u.socketId !== currentRoom.userDrawing.socketId
      );
      console.log(currentRoom);
      socket.to(roomName).emit("next-turn-start", currentRoom);
    // });
  });

  socket.on("command-update-room-canvas", (data) => {
    // console.log(data);

    socket.to(data.room).emit("update-room-canvas", data.canvasData);
  });

  socket.on("request-doodle", ({ socketId, roomName }) => {
    const currentRoom = createdRooms.find((r) => r.roomName === roomName);
    if (currentRoom.currentDoodle) {
      socket.emit("receive-doodle", currentRoom.currentDoodle);
    } else {
      const selDoodle = getRandomElement(Object.values(constantData.LABELS));
      currentRoom.currentDoodle = selDoodle;
      console.log(selDoodle);
      socket.emit("receive-doodle", selDoodle);
    }
  });
});

// home
// add
// getall

// starting the server
httpServer.listen(port, () => {
  console.log("express server started");
});
