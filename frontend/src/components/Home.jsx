import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UseAppContext from "../AppContext";

const Home = () => {
  const userJSON = sessionStorage.user;
  const user = userJSON ? JSON.parse(userJSON) : null;

  const { loggedin, logout } = UseAppContext();

  const displayUserOption = () => {
    if (loggedin) {
      return (
        <>
          <div
            className="  cursor-pointer text-warning wobblee"
            onClick={logout}
          >
            Logout
          </div>
        </>
      );
    } else {
      return (
        <>
          <Link to="/login" className="text-white wobblee">
            Login
          </Link>
        </>
      );
    }
  };

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
        let delay = (idx + 1) * 60;
        return `<span style="animation-delay: ${delay}ms">${x}</span>`;
      });
      // replace the element's html with our dynamically created html
      el.innerHTML = textCode.join("");
    });

    const all1 = document.querySelectorAll(".wobblee");

    // Iterate through each "wobble"
    all1.forEach((el) => {
      // Get the text content of the element
      let text = el.textContent;
      // Create an array of separate letters
      text = text.split("");
      // Iterate through each letter and give it its own span element and individual animation delay offset
      const textCode = text.map((x, idx) => {
        let delay = (idx + 1) * 30;
        return `<span style="animation-delay: ${delay}ms">${x}</span>`;
      });
      // replace the element's html with our dynamically created html
      el.innerHTML = textCode.join("");
    });
  }, []);

  return (
    <div>
      <div className="background">
        <div className="container-fluid pt-5 mb-0 text-white ">
          <div className="header">
            <div>
              <Link to="/rules" className=" text-white wobblee">
                Rules
              </Link>
            </div>
            <div>{displayUserOption()}</div>
          </div>
          <div className="col-md-5 mt-5 mx-auto">
            <div className=" text-white text-center mx-auto mb-2 ">
              <h1 className="row justify-content-center text-center mx-auto ">
                <div className="col-sm-5 wobblee "> ThinkInk</div>
                <div className="col-sm-2">
                  <img
                    className="mx-auto"
                    src="./Assets/hui.gif"
                    alt="pencil"
                    width={60}
                    height={60}
                  />
                </div>
              </h1>
            </div>
            <div className="card shadow intro-card">
              <div className="card-body">
                <h2 className="text-center mb-3">Let's Play</h2>
                <hr />
                <h3 className="text-center my-5">
                  <Link
                    to="/singleplayer"
                    className="text-decoration-none wobble theme-text"
                  >
                    Single Player
                  </Link>
                </h3>
                <h3 className="text-center mt-5 mb-3">
                  <Link
                    to="/createroom"
                    className="text-decoration-none wobble theme-text"
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
