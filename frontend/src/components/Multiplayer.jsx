import React from "react";
import SinglePlayer from "./SinglePlayer";
import Chat from "./Chat";

const Multiplayer = () => {
  return (
    <div>
      <div className="row">
        <div className="col-md-2">
          <h2>Players</h2>
        </div>
        <div className="col-md-7">
          {/* <SinglePlayer /> */}
        </div>
        <div className="col-md-2">
          <Chat />
        </div>
      </div>
    </div>
  );
};

export default Multiplayer;
