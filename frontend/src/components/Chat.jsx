import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import UseSocketContext from "../SocketContext";

const Chat = () => {
  const {
    socket,
    messages,
    setMessages,
    joinRoomHandler,
    roomName,
    setRoomName,
    handleSubmit
  } = UseSocketContext();

  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.on("welcome", (s) => {
      console.log(s);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
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
  );
};

export default Chat;
