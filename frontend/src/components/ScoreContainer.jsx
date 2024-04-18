import React, { useEffect, useState } from "react";
import UseGameContext from "../GameContext";

const ScoreContainer = () => {
  const { score } = UseGameContext();

  // const [scoreData, setScoreData] = useState([]);

  const [currentUser, setCurrentUser] = useState(
    JSON.parse(sessionStorage.getItem("user"))
  );

  const [userScore, setUserScore] = useState(0);

  const uploadScore = async () => {
    const response = await fetch("http://localhost:5000/score/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: currentUser._id,
        points: score,
      }),
    });

    const data = await response.json();
    console.log(data);
  };

  useEffect(() => {
    uploadScore();
  }, [score]);

  return (
    <div className="p-5 pb-0 pt-1 ">
      <div className="d-flex justify-content-between">
        <h5>Player: {currentUser.name}</h5>
        <h5>Score : {score}</h5>
      </div>
    </div>
  );
};

export default ScoreContainer;
