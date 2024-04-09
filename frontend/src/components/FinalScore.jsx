import React from "react";

const FinalScore = () => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(sessionStorage.getItem("user"))
  );

  return (
    <div className="col-md-6 mx-auto mt-5">
      <div className="card shadow">
        <div className="card-body">
          <div>
            <h3 className="text-center">Final Score</h3>
            <hr />
            <div className="container mx-auto mt-3">
              <div className="row">
                <div className="col-md-6 ">
                  <div className="card shadow">
                    <div className="card-body">
                      <h5>Player 1: </h5>
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
