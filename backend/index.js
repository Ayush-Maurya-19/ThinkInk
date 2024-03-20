// import express
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const userRouter = require("./routers/userRouter");
const utilRouter = require("./routers/utils");
const cors = require("cors");

const users = [];
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

io.on("connection", (socket) => {
  console.log("User Connected", socket.id);

  socket.on("join server", (username) => {
    const user = {
      username,
      id: socket.id,
    };
    users.push(user);
    io.emit("new user", users);
  });

  socket.on("join-room", (room) => {
    socket.join(room);
    if (createdRooms.find((r) => r.roomName === room)) {
      createdRooms.find((r) => r.roomName === room).users.push(socket.id);
    } else {
      createdRooms.push({
        roomName: room,
        users: [socket.id],
      });
    }
    console.log(`User joined room ${room}`);

    socket.emit("notify-room", createdRooms);
  });

  socket.on("delete-room", (room) => {
    const index = createdRooms.findIndex((r) => r.roomName === room);
    createdRooms.splice(index, 1);
    io.emit("notify-room", createdRooms);
    console.log(`User deleted room ${room}`);
  });

  socket.on("message", ({ room, message }) => {
    console.log({ room, message });
    socket.to(room).emit("receive-message", message);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// home
// add
// getall

// starting the server
httpServer.listen(port, () => {
  console.log("express server started");
});
