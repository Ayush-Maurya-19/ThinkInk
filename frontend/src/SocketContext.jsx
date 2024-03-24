import { useNavigate } from "react-router-dom";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const socket = useMemo(() => io("http://localhost:5000"), []);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState([]);
  const [room, setRoom] = useState("");
  const [socketID, setSocketId] = useState("");
  const [roomName, setRoomName] = useState("");
  const [socketname, setSocketName] = useState("");
  const [usersName, setUsersName] = useState([]);

  const [roomList, setRoomList] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    socket.on("notify-room", (createdRooms) => console.log(createdRooms));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };
  socket.emit("get-room-info");
  const joinRoomHandler = () => {
    // e.preventDefault();
    console.log(room);
    if (room === "") {
      toast.error("Room name is required");
    } else {
      //check if user is in another room and also check if he leave the room then allow him to join another room
      if (roomList.find((r) => r.users.includes(socketID))) {
        toast.error("You are already in a room");
      } else {
        socket.emit("join-room", room);
        setRoomName("");
        toast.success("Room created successfully");
        socket.on("notify-room", (createdRooms) => console.log(createdRooms));
        // navigate("/multiplayer");
      }
    }
  };

  const joinexisitingRoomHandler = (room) => {
    if (roomList.find((r) => r.users.includes(socketID))) {
      toast.error("You are already in a room");
    } else {
      socket.emit("join-room", room);
      setRoomName("");
      toast.success("Room created successfully");
      socket.on("notify-room", (createdRooms) => console.log(createdRooms));
      // navigate("/multiplayer");
    }
  };

  roomList.map((r) => {
    console.log(r);
  });

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("connected", socket.id);
    });

    socket.on("name-set", (name) => {
      console.log(name);
    });

    socket.on("new user", (users) => {
      console.log(users);
    });

    socket.on("receive-message", (data) => {
      console.log(data);
      setMessages((messages) => [...messages, data]);
    });

  }, []);
  
  socket.on('receive-doodle', (data) => {
    console.log(data);
  })

  const getDoodle = () => {
    socket.emit('request-doodle', socket.id);
  }

  return (
    <SocketContext.Provider
      value={{
        socket,
        messages,
        setMessages,
        handleSubmit,
        joinRoomHandler,
        roomName,
        setRoomName,
        message,
        setMessage,
        setRoom,
        room,
        createdRooms: roomList,
        roomList,
        setRoomList,
        joinexisitingRoomHandler,
        usersName,
        setUsersName,
        getDoodle
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

const UseSocketContext = () => useContext(SocketContext);

export default UseSocketContext;
