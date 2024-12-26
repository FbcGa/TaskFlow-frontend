import React from "react";
import { Link, useNavigate } from "react-router";

export const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSignIn = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark">
      <Link className="navbar-brand ms-3" to="/">
        <span>SparkTasks </span>
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav ms-auto">
          {token ? (
            <li className="nav-item">
              <button className="btn btn-link nav-link" onClick={handleSignIn}>
                <i className="fa-solid fa-right-to-bracket"></i> Logout
              </button>
            </li>
          ) : (
            <li className="nav-item">
              <Link className="nav-link" to="/login">
                <i className="fa-solid fa-right-to-bracket"></i> Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};
