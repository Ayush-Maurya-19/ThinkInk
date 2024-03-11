import React from "react";
import { NavLink } from "react-router-dom";


const Navbar = () => {
  return (
    <nav className="navbar p-0 bg-cyan-700">
      <div className="container-fluid">
        {/* if i enter # it showing warning and nothing is shown in homepage*/}
        <a className="navbar-brand " href="/">
          <h4 className="p-0 m-0 text-neutral-950">ThinkInk</h4>
        </a>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="rules">
                Rules
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
