import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import UseSocketContext from "../SocketContext";

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
      <Link to='/multiplayer'>Start Game</Link>
      <div className="col-md-3 mx-auto mt-5">
        <div className="card shadow">
          <div className="card-body">
            <h3 className="text-center mb-2">Room List</h3>
            <div className="card">
              <div className="card-body">
                {roomList.map((r, i) => (
                  <div key={i} style={{ marginBottom: "0.5rem" }}>
                    <p>{r.roomName}</p>

                    <p>Total Joined Player: {r.users.length}</p>

                    {r.users.map((u, i) => (
                      <div key={i} style={{ marginBottom: "0.5rem" }}>
                        <p className="text-start text-sm">User: {u}</p>
                      </div>
                    ))}

                    <div className="row mx-auto">
                      <div className="col-md-6 ">
                        {/*Join joinexisitingRoomHandler */}

                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => {
                            joinexisitingRoomHandler(r.roomName);
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
                            socket.emit("leave-room", r.roomName);
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

            {/*user need to enter their name that should be unique */}
            {/* 
            <form className="mt-3">
              <input
                type="text"
                value={usersName}
                onChange={(e) => setUsersName(e.target.value)}
                className="form-control mb-3"
              />
              <div className="d-grid gap-2">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    socket.emit("name-set", usersName);
                  }}
                >
                  Set Name
                </button>
              </div>
            </form> */}

            <div className="justify-content-between  d-flex">
              {/* <form className="mt-3"> */}
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
              {/* </form> */}

              {/* <form className="mt-3">
                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className="form-control mb-3"
                />
                <div className="d-grid gap-2">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={joinRoomHandler}
                  >
                    Join Room
                  </button>
                </div>
              </form> */}
            </div>

            <div className="text-center mt-3">
              <h5>Messages</h5>
              <div className="card">
                <div className="card-body bg-light">
                  {messages.map((m, i) => (
                    <div key={i} style={{ marginBottom: "1rem" }}>
                      <p className="text-end">{m}</p>
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
              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary">
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
            <h3>Loggedin as : {currentUser.name}</h3>
          </div>
        </div>
        <div className="card shadow">
          <div className="card-body">
            <h3 className="text-center">Player In Room</h3>
            <div className="card">
              <div className="card-body">
                {/*fetch data of users in a single room */}
                {roomList.map((r, i) => (
                  <div key={i} style={{ marginBottom: "0.5rem" }}>
                    <p>{r.roomName}</p>

                    {r.users.map((u, i) => (
                      <div key={i} style={{ marginBottom: "0.5rem" }}>
                        <p className="text-start text-sm">User: {u}</p>
                      </div>
                    ))}
                    <p>Total Joined Player: {r.users.length}</p>
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
