import React from "react";
import SinglePlayer from "./SinglePlayer";
import Chat from "./Chat";
import PlayGame from "./PlayGame";
import DrawingPage from "./DrawingPage";

const Multiplayer = () => {
  return (
    <div class="container mx-auto mt-4">
      <div class="grid grid-cols-12 gap-3">
        <div className="col-span-2 mt-16">
          <div className="card shadow">
            <div className="card-body">
              <h3 className="text-center">Player In Room</h3>
              <div className="card">
                {/* call the users in the room here */}
              </div>
            </div>
          </div>
        </div>

        <div class="col-span-8">
          <PlayGame />
        </div>
        <div class="col-span-2">
          <div class="bg-gray-100  mt-16">
            <Chat />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Multiplayer;
