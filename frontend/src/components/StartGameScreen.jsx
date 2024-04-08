import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import UseSocketContext from "../SocketContext";
import { motion } from "framer-motion";
import { io } from "socket.io-client";

const StartGameScreen = () => {
  const { roomList, setRoomList, socketID, socket, currentRoom } =
    UseSocketContext();
  console.log(roomList);
  console.log(socketID);

  socket.on("room-start-game", () => {
    console.log("Game Start from server");
    navigate("/multiplayer");
  });

  const navigate = useNavigate();

  const startGameHandler = () => {
    socket.emit("command-start-game", currentRoom);
    navigate("/multiplayer");
  };

  useEffect(() => {
    socket.emit("get-room-info");
    socket.on("notify-room", (createdRooms) => {
      console.log(createdRooms);
      setRoomList(createdRooms);
    });
  }, []);

  return (
    <motion.div
      initial={{ y: "-100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.6 }}
      className="py-5 my-2 container-fluid"
    >
      <div className="col-md-3 mx-auto ">
        <div className="card shadow ">
          <div className="card-body ">
            <h3 className="text-center mb-2">Player In Room</h3>
            <hr />
            <div className="card ">
              <div className="card-body ">
                {/*fetch data of users in all rooms */}

                {roomList.map(({ roomName, users }) => (
                  <div key={roomName} style={{ marginBottom: "0.5rem" }}>
                    <p>{roomName}</p>

                    {users.map(({ name, socketId }) => (
                      <div key={socketId} style={{ marginBottom: "0.5rem" }}>
                        <p className="text-start text-sm">User: {name}</p>
                      </div>
                    ))}

                    <p>Total Joined Player: {users.length}</p>

                    <div className="">
                      <div className=" ">
                        {users.length >= 2 ? (
                          <div className="d-grid mt-3">
                            <button
                              type="submit"
                              className="btn text-white"
                              onClick={startGameHandler}
                            >
                              start
                            </button>
                          </div>
                        ) : (
                          <div className="d-grid mt-3">
                            <button type="submit" className="btn text-white">
                              Mini 2 Players required to Start
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="  mt-1">
                        {/*Leave Room*/}
                        <Link to="/createroom" className="d-grid">
                          <button
                            type="button"
                            className="btn text-white "
                            onClick={() => {
                              socket.emit("leave-room", roomName);
                              toast.error("Room left successfully");
                            }}
                          >
                            Leave Room
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StartGameScreen;
