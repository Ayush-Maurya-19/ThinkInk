import React from "react";
import { Link } from "react-router-dom";
import UseSocketContext from "../SocketContext";

const StartGameScreen = () => {
  const { roomList, roomName, socketId } = UseSocketContext();

  return (
    <div>
      <div className="card shadow">
        <div className="card-body">
          <h3 className="text-center">Player In Room</h3>
          <div className="card">
            <div className="card-body">
              {/*fetch data of users in all rooms */}

              {roomList.map(({ roomName, users }) => (
                <div key={roomName} style={{ marginBottom: "0.5rem" }}>
                  <p>{roomName}</p>

                  {users.map(({ username, socketId }) => (
                    <div key={socketId} style={{ marginBottom: "0.5rem" }}>
                      <p className="text-start text-sm">User: {username}</p>
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
  );
};

export default StartGameScreen;
