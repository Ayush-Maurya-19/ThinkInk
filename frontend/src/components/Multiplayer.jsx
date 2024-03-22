import React from "react";
import SinglePlayer from "./SinglePlayer";
import Chat from "./Chat";

const Multiplayer = () => {
  return (
    <div class="container mx-auto mt-4">
  <div class="grid grid-cols-12 gap-4">
    <div class="col-span-2">
      <h2 class="text-xl font-bold">Players</h2>
      
    </div>
    <div class="col-span-8 	">
        <SinglePlayer/>      
    </div>
    <div class="col-span-2">
      <div class="bg-gray-100 p-4">
    <Chat />
     </div>
    </div>
  </div>
</div>

    // <div className="">
    //   <div className="row">
    //     <div className="col-md-2">
    //       <h2>Players</h2>
    //     </div>
    //     <div className="col-md-8">
    //       <SinglePlayer />
    //     </div>
    //     <div className="col-md-2">
    //       <Chat />
    //     </div>
    //   </div>
    // </div>
  );
};

export default Multiplayer;
