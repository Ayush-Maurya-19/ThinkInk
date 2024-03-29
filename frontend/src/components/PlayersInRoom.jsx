import React, { useState } from "react";
import UseSocketContext from "../SocketContext";
import { Link } from "react-router-dom";

const PlayersInRoom = () => {
  const { roomList } = UseSocketContext();

  const [currentUser, setCurrentUser] = useState(
    JSON.parse(sessionStorage.getItem("user"))
  );

  return (
    <div className="col-md-3 mx-auto mt-5">
      <div className="card mb-3 shadow">
        <div className="card-body">
          <h3 className="mb-2">User Name:</h3>
          <h4 style={{ textTransform: "uppercase" }}>
            &#128073; {currentUser.name}
          </h4>
        </div>
      </div>
      <div className="card shadow">
        <div className="card-body">
          <h3 className="text-center">Player In Room</h3>
          <div className="card">
            <div className="card-body">
              {/*fetch data of users in all rooms */}

              {roomList.map((r, i) => (
                <div key={i} style={{ marginBottom: "0.5rem" }}>
                  <p>{r.roomName}</p>

                  {r.users.map((u, i) => (
                    <div key={i} style={{ marginBottom: "0.5rem" }}>
                      <p className="text-start text-sm">User: {u}</p>
                    </div>
                  ))}

                  <p>Total Joined Player: {r.users.length}</p>

                  {/* create if condition to check if user is in room or not */}
                  {r.users.length >= 2 ? (
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
  );
};

export default PlayersInRoom;
