import React from "react";

const Rules = () => {
  return (
    <div>
      <div className="background">
        <div className="container mx-auto px-5 py-5 text-white">
          <div className="col-md-4 mt-5 mx-auto">
            <div className="text-center my-3">
              <h1>How To Play</h1>
            </div>
            <hr />
            <div>
              <h2  className="my-3">Single Player</h2>
              <ul>
                <li>Draw the given word within 30sec.</li>
                <li>
                  If the drawning is recoginized by AI you will recive a
                  point.
                </li>
                <li>However if you don't you will lose the game.</li>
                <li>
                  Master the your drawing skills and beat your own high score
                  each time.
                </li>
              </ul>
              <h2 className="my-3">Multiplayer</h2>
              <ul>
                <li>
                  Compete with your friends or random player from all around the
                  world.
                </li>
                <li>Draw and guess to make score.</li>
                <li>
                  Make the most score among all the player and become a winner.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rules;
