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

  const [roomList, setRoomList] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    socket.on("notify-room", (createdRooms) => console.log(createdRooms));
  }, [])
  

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };

  // const createRoomHandler = () => {
  //   // e.preventDefault();
  //   socket.emit("join-room", room);
  //   setRoom("");

  //   if (room === "") {
  //     toast.error("Room name is required");
  //   } else {
  //     navigate("/multiplayer");
  //   }
  // }

  const joinRoomHandler = () => {
    // e.preventDefault();
    console.log(room);
    if (room === "") {
      toast.error("Room name is required");
    } else {
      socket.emit("join-room", room);
      setRoomName("");
      toast.success("Room created successfully");
      socket.on("notify-room", (createdRooms) => console.log(createdRooms));
      // navigate("/multiplayer");
    }
  };

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("connected", socket.id);
    });

    socket.on("receive-message", (data) => {
      console.log(data);
      setMessages((messages) => [...messages, data]);
    });
  }, []);

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
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

const UseSocketContext = () => useContext(SocketContext);

export default UseSocketContext;
