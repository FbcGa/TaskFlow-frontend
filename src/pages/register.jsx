import React, { useRef, useContext, useState } from "react";
import { Context } from "../store/appContext.jsx";
import { Link, useNavigate } from "react-router";

export function Register() {
  const { actions } = useContext(Context);
  const [error, setError] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const resp = await actions.register(email, password);
    if (resp) {
      navigate("/");
    } else {
      setError("This email is already in use");
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-8 bg-gray-800 rounded-lg shadow-lg"
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-center mb-4">Register</h1>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            Email address
          </label>
          <input
            type="email"
            id="email"
            ref={emailRef}
            className="w-full px-4 py-2 text-sm border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            required
          />
          {error ? (
            <div className="mt-2 text-sm text-red-500">
              <p>{error}</p>
            </div>
          ) : (
            <div className="mt-2 text-xs text-gray-400">
              We&apos;ll never share your email with anyone else.
            </div>
          )}
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            ref={passwordRef}
            className="w-full px-4 py-2 text-sm border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </form>

      <button
        type="button"
        className="mt-4 text-sm font-medium text-blue-500 hover:underline"
      >
        <Link to={"/login"}>If you have an account, click here!!</Link>
      </button>
    </section>
  );
}
