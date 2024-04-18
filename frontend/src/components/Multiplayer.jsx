import React from "react";
import SinglePlayer from "./SinglePlayer";
import Chat from "./Chat";
import PlayGame from "./PlayGame";
import DrawingPage from "./DrawingPage";
import UseSocketContext from "../SocketContext";

const Multiplayer = () => {
  const { getRoomInfo } = UseSocketContext();
  console.log(getRoomInfo());
  return (
    <div className="container mx-auto mt-1">
      <div className="row">
        <div className="col-md-2 mt-16">
          <div className="card shadow">
            <div className="card-body">
              <h3 className="text-center mb-2">Player In Room</h3>
              <div className="card px-2 py-2">
                {getRoomInfo().users.map(({ name }) => (
                  <h6 className="my-1">&#128073; {name}</h6>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <PlayGame />
        </div>
        <div className="col-md-2">
          <div className="bg-gray-100  mt-16">
            <Chat />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Multiplayer;
