import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import UseSocketContext from "../SocketContext";
import { motion } from "framer-motion";

const StartGameScreen = () => {
  const { roomList, setRoomList, socketId, socket } = UseSocketContext();
  console.log(roomList);
  console.log(socketId);

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

                    {/* create if condition to check if user is in room or not */}
                    {users.length >= 2 ? (
                      <Link to="/multiplayer">
                        <div className="d-grid mt-3">
                          <button type="submit" className="btn text-white">
                            Start Game
                          </button>
                        </div>
                      </Link>
                    ) : (
                      <div className="d-grid mt-3">
                        <button type="submit" className="btn text-white">
                          Mini 2 Players required to Start
                        </button>
                      </div>
                    )}
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
