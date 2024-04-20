import React from "react";
import UseSocketContext from "../SocketContext";

const Chat = () => {
  const { messages, setMessages, message, setMessage, handleSubmit } =
    UseSocketContext();

  return (
    <div className="card shadow mx-auto ">
      <div className="card-body">
        <div className="text-center mb-4 text-white">
          <h5>type</h5>
        </div>
        <div className="card">
          <div className="card-body bg-light">
            {messages.map((m, i) => (
              <div key={i} style={{ marginBottom: "1rem" }}>
                <p className="text-end">{m}</p>
              </div>
            ))}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="mt-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="form-control mb-3"
            // placeholder="Enter message"
          />
          <div className="d-grid gap-2">
              {/* <button type="submit" className="btn btn-primary">
                Send
              </button> */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
