import { useNavigate } from "react-router-dom";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const socket = useMemo(() => io("http://localhost:5000"), []);

  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("");
  const [socketID, setSocketId] = useState("");
  const [roomName, setRoomName] = useState("");
  const [socketname, setSocketName] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    // setMessage("");
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");

    if (roomName === "") {
      toast.error("Room name is required");
    } else {
      navigate("/multiplayer");
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
        
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

const UseSocketContext = () => useContext(SocketContext);

export default UseSocketContext;
