import React, { useRef, useContext, useState } from "react";
import { Context } from "../store/appContext.jsx";
import { useNavigate, Link } from "react-router";

export function Login() {
  const navigate = useNavigate();
  const { actions } = useContext(Context);
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const resp = await actions.login(email, password);

    if (resp) {
      navigate("/");
    } else {
      setError("The provided credentials are incorrect.");
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md"
      >
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-700 text-center mb-4">
            Login
          </h1>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-600"
          >
            Email address
          </label>
          <input
            type="email"
            id="email"
            ref={emailRef}
            className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your email"
            required
          />
          {error ? (
            <div className="mt-2 text-sm text-red-500">
              <p>{error}</p>
            </div>
          ) : (
            <div className="mt-2 text-xs text-gray-500">
              We&apos;ll never share your email with anyone else.
            </div>
          )}
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-600"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            ref={passwordRef}
            className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your password"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Submit
        </button>
      </form>

      <button
        type="button"
        className="mt-4 text-sm font-medium text-blue-500 hover:underline"
      >
        <Link to={"/register"}>
          If you don&apos;t have an account, click here!!
        </Link>
      </button>
    </section>
  );
}
