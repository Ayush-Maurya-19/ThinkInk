import { useNavigate } from "react-router-dom";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const socket = useMemo(() => io("http://localhost:5000"), []);

  const [currentUser, setCurrentUser] = useState(
    JSON.parse(sessionStorage.getItem("user"))
  );
  // console.log(currentUser);

  const hasRun = useRef(false);

  // const [socket, setSocket] = useState(io("http://localhost:5000", { autoConnect: false }));

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState([]);
  const [room, setRoom] = useState("");
  const [socketID, setSocketId] = useState("");
  const [roomName, setRoomName] = useState("");
  const [socketname, setSocketName] = useState("");
  const [usersName, setUsersName] = useState([]);

  const [roomList, setRoomList] = useState([]);
  const [currentDoodle, setCurrentDoodle] = useState(null);
  const [currentRoom, setCurrentRoom] = useState("");

  const [drawEnabled, setDrawEnabled] = useState(false);

  const navigate = useNavigate();

  socket.on("notify-room", (createdRooms) => {
    console.log("notified");
    console.log(createdRooms);
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };
  // socket.emit("get-room-info");
  const joinRoomHandler = () => {
    // e.preventDefault();
    console.log(room);
    if (room === "") {
      toast.error("Room name is required");
    } else {
      //check if user is in another room and also check if he leave the room then allow him to join another room
      if (
        roomList.find((r) =>
          r.users.map((user) => user.socketId).includes(socketID)
        )
      ) {
        toast.error("You are already in a room");
      } else {
        socket.emit("join-room", { room, username: currentUser.name });
        setRoomName("");
        setCurrentRoom(room);
        toast.success("Room created successfully");
        // socket.on("notify-room", (createdRooms) => console.log(createdRooms));
        navigate("/startgamescreen");
      }
    }
  };

  const joinexisitingRoomHandler = (room) => {
    if (
      roomList.find((r) =>
        r.users.map((user) => user.socketId).includes(socketID)
      )
    ) {
      toast.error("You are already in a room");
    } else {
      socket.emit("join-room", { room, username: currentUser.name });
      setRoomName("");
      setCurrentRoom(room);
      toast.success("Room created successfully");
      // socket.on("notify-room", (createdRooms) => console.log(createdRooms));
      navigate("/startgamescreen");
    }
  };

  roomList.map((r) => {
    console.log(r);
  });

  const getRoomInfo = () => {
    return roomList.find((r) => r.roomName === currentRoom);
  };

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      sessionStorage.setItem("socketID", socket.id);
      console.log("connected", socket.id);
    });

    //this is use to delete room from the room list
    socket.on("delete-room", (room) => {
      console.log(`User deleted room ${room}`);
      setRoomList((roomList) => roomList.filter((r) => r.roomName !== room));
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
    socket.on("receive-doodle", (data) => {
      console.log(data);
      setCurrentDoodle(data);
    });
  }, []);

  const getDoodle = () => {
    socket.emit("request-doodle", {socketId : socket.id, roomName: currentRoom});
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        socketID,
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
        getDoodle,
        currentDoodle,
        setCurrentDoodle,
        getRoomInfo,
        currentRoom,
        drawEnabled,
        setDrawEnabled,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

const UseSocketContext = () => useContext(SocketContext);

export default UseSocketContext;
