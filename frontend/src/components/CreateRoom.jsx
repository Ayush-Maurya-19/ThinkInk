import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import UseSocketContext from "../SocketContext";

const CreateRoom = () => {
  const {
    socket,
    messages,
    setMessages,
    joinRoomHandler,
    roomName,
    setRoomName,
    handleSubmit,
    message,
    setMessage,
    room, setRoom
    // createRoomHandler,
  } = UseSocketContext();

  // const [message, setMessage] = useState("");


  useEffect(() => {
    socket.on("welcome", (s) => {
      console.log(s);
    });

    socket.on("new user", (users) => {
      console.log(users);
    });

    // return () => {
    //   socket.disconnect();
    // };
  }, []);

  return (
    <div>
      {/* join room form */}
      <div className="col-md-5 mx-auto mt-5">
        <div className="card shadow">
          <div className="card-body">
            <h1 className="text-center">Manage Room</h1>

            <p className="text-center mt-2">Socket ID: {socket.id}</p>

            {/* <p className="text-center mt-2">Socket name: {socketname}</p> */}

            <div className="justify-content-between d-flex ">
              <form  className="mt-3">
                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className="form-control mb-3"
                />
                <div className="d-grid gap-2">
                  <button type="button" className="btn btn-primary " onClick={joinRoomHandler}>
                    Create Room
                  </button>
                </div>
              </form>

              <form className="mt-3">
                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className="form-control mb-3"
                />
                <div className="d-grid gap-2">
                  <button type="button" className="btn btn-primary" onClick={joinRoomHandler}>
                    Join Room
                  </button>
                </div>
              </form>
            </div>

            <div className="text-center mt-3">
              <h5>Messages</h5>
              <div className="card">
                <div className="card-body">
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
    </div>
  );
};

export default CreateRoom;
