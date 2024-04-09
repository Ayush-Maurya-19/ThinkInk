import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const FinalScore = () => {
  const [scoreData, setScoreData] = useState([]);
  const [noScoresAdded, setNoScoresAdded] = useState(false);

  const fetchScoreData = async () => {
    const res = await fetch("http://localhost:5000/score/getall");
    if (res.status === 200) {
      const data = await res.json();
      setScoreData(data);
    }
  };

  useEffect(() => {
    fetchScoreData();
  }, []);

  return (
    <div className="col-md-6 mx-auto mt-5">
      <div className="card shadow">
        <div className="card-body">
          <div>
            <h3 className="text-center">Final Score</h3>
            <hr />

            {scoreData.map((score) => (
              <div className="container mx-auto mt-3">
                <div className="row">
                  <div className="col-md-6 ">
                    <div className="card shadow">
                      <div className="card-body">
                        <h5>Player 1: {score.name}</h5>
                        <h5 className=" my-2">
                          Points:{" "}
                          <span className="text-success">{score.points}</span>
                        </h5>
                        <h5>
                          Rank:{" "}
                          <span className="text-success">{score.rank}</span>
                        </h5>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card shadow">
                      <div className="card-body">
                        <h5>Player 2: </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="d-grid mt-3">
              <button type="submit" className="btn text-white">
                Play Again
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalScore;
