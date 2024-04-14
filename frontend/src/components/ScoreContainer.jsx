import React, { useState } from "react";
import UseGameContext from "../GameContext";

const ScoreContainer = () => {
  const { score } = UseGameContext();

  // const [scoreData, setScoreData] = useState([]);

  const [currentUser, setCurrentUser] = useState(
    JSON.parse(sessionStorage.getItem("user"))
  );

  // const sendScoreData = async () => {
  //   const res = await fetch("http://localhost:5000/score/add");
  //   if (res.status === 200) {
  //     const data = await res.json();
  //     setScoreData(data);
  //   }
  // };

  return (
    <div className="p-3 pb-0 ">
      <div className="d-flex justify-content-between">
        <h5>Loggedin as: {currentUser.name}</h5>
        <h5>Score : {score}</h5>
      </div>
    </div>
  );
};

export default ScoreContainer;
