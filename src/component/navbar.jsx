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
    <nav className="bg-gray-800 p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link className="text-white text-2xl font-semibold" to="/">
          TaskFlow
        </Link>
        <button
          className="text-white md:hidden"
          type="button"
          aria-label="Toggle navigation"
          onClick={() => document.getElementById("navbarLinks").classList.toggle("hidden")}
        >
          <span className="block w-6 h-0.5 bg-white my-1"></span>
          <span className="block w-6 h-0.5 bg-white my-1"></span>
          <span className="block w-6 h-0.5 bg-white my-1"></span>
        </button>
        <div id="navbarLinks" className="hidden md:flex space-x-4">
          {token ? (
            <button
              className="text-white hover:text-gray-400"
              onClick={handleSignIn}
            >
              <i className="fa-solid fa-right-to-bracket"></i> Logout
            </button>
          ) : (
            <Link className="text-white hover:text-gray-400" to="/login">
              <i className="fa-solid fa-right-to-bracket"></i> Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
