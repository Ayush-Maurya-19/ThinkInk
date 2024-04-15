import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import UseSocketContext from "../SocketContext";
import { Button } from "@mantine/core";

const CreateRoom = () => {
  const {
    socket,
    socketID,
    messages,
    setMessages,
    joinRoomHandler,
    roomName,
    setRoomName,
    handleSubmit,
    message,
    setMessage,
    room,
    setRoom,
    roomList,
    setRoomList,
    joinexisitingRoomHandler,
    usersName,
    setUsersName,

    // createRoomHandler,
  } = UseSocketContext();

  // const [message, setMessage] = useState("");

  const [currentUser, setCurrentUser] = useState(
    JSON.parse(sessionStorage.getItem("user"))
  );

  useEffect(() => {
    socket.on("welcome", (s) => {
      console.log(s);
    });

    // socket.on("message", (message) => {
    //   setMessages((prev) => [...prev, message]);
    // });

    socket.emit("get-room-info");
    socket.on("notify-room", (createdRooms) => {
      console.log(createdRooms);
      setRoomList(createdRooms);
    });

    // return () => {
    //   socket.disconnect();
    // };
  }, []);

  return (
    <div className="row">
      <div className="col-md-3 mx-auto mt-5">
        <div className="card shadow">
          <div className="card-body">
            <h3 className="text-center mb-2">Room List</h3>
            <div className="card">
              <div className="card-body">
                {roomList.map(({ roomName, users }) => (
                  <div key={roomName} style={{ marginBottom: "0.5rem" }}>
                    <p>Room Name: {roomName}</p>

                    <p>Total Player: {users.length}</p>

                    {users.map(({ socketId, name }) => (
                      <div key={socketId} style={{ marginBottom: "0.5rem" }}>
                        <p className="text-start text-sm">
                          User: {name} ({socketId})
                        </p>
                      </div>
                    ))}

                    <div className="row mx-auto">
                      <div className="col-md-6 ">
                        {/*Join joinexisitingRoomHandler */}

                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => {
                            joinexisitingRoomHandler(roomName);
                          }}
                        >
                          Join Room
                        </button>
                      </div>
                      <div className="col-md-6">
                        {/*Leave Room*/}
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => {
                            socket.emit("leave-room", roomName);
                            toast.error("Room left successfully");
                          }}
                        >
                          Leave Room
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* -----------  Create room form  ------------------ */}
      <div className="col-md-4 mx-auto mt-5">
        <div className="card shadow">
          <div className="card-body">
            <h1 className="text-center">Manage Room</h1>

            <p className="text-center mt-2">Socket ID: {socketID}</p>

            <div className="justify-content-between mt-2">
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="form-control mb-3"
                placeholder="Enter Room Name"
              />
              <div className="d-grid gap-2">
                <button
                  type="button"
                  className="btn btn-primary "
                  onClick={joinRoomHandler}
                >
                  Create Room
                </button>
              </div>
            </div>

            <div className="text-center mt-3">
              <h5>Messages</h5>
              <div className="card">
                <div className="card-body bg-light">
                  {messages.map((m, i) => (
                    <div key={i} style={{ marginBottom: "1rem" }}>
                      <p className="text-start text-primary">
                        <span
                          className="text-secondary"
                          style={{
                            textTransform: "uppercase",
                            fontSize: "12px",
                          }}
                        >
                          {socketID}:{" "}
                        </span>
                        {m}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="mt-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="form-control mb-3"
                placeholder="Enter message"
              />
              <div className="d-grid">
                <button type="submit" className="btn text-white">
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* -----------  Players in room  ------------------ */}

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
                {roomList.map(({ roomName, users }) => (
                  <div key={roomName} style={{ marginBottom: "0.5rem" }}>
                    <p>Room Name: {roomName}</p>

                    {users.map(({ socketId, name }) => (
                      <div key={socketId} style={{ marginBottom: "0.5rem" }}>
                        <p className="text-start text-sm">
                          User: {name} ({socketId})
                        </p>
                      </div>
                    ))}

                    <p>Total Joined Player: {users.length}</p>

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
    </div>
  );
};

export default CreateRoom;
