import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  useEffect(() => {
    const all = document.querySelectorAll(".wobble");

    // Iterate through each "wobble"
    all.forEach((el) => {
      // Get the text content of the element
      let text = el.textContent;
      // Create an array of separate letters
      text = text.split("");
      // Iterate through each letter and give it its own span element and individual animation delay offset
      const textCode = text.map((x, idx) => {
        let delay = (idx + 1) * 50;
        return `<span style="animation-delay: ${delay}ms">${x}</span>`;
      });
      // replace the element's html with our dynamically created html
      el.innerHTML = textCode.join("");
    });
  }, []);
  6;
  return (
    <div>
      <div className="background">
        <div className="container-fluid pt-5 mb-0 text-white ">
          <div className="header">
            <div>
              <Link to="/rules" className=" text-white">
                Rules
              </Link>
            </div>
            <div>
              <Link to="/login" className=" text-white">
                Login
              </Link>
            </div>
          </div>
          <div className="col-md-5 mt-4 mx-auto">
            <div className=" text-white text-center">
              <span>
                <h1>
                  ThinkInk
                  <img
                    src="./Assets/hui.gif"
                    alt="pencil"
                    width={40}
                    height={40}
                  />
                </h1>
              </span>
            </div>
            <div className="card shadow bg-transparent text-white">
              <div className="card-body">
                <h2 className="text-center mb-3">Let's Play</h2>
                <hr />
                <h3 className="text-center my-5">
                  <Link
                    to="/singleplayer"
                    className="text-decoration-none wobble text-white "
                  >
                    Single Player
                  </Link>
                </h3>
                <h3 className="text-center mt-5 mb-3">
                  <Link
                    to="/createroom"
                    className="text-decoration-none wobble text-white "
                  >
                    Multi Player
                  </Link>
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
