import React from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { BackendURL } from "./component/backendURL.jsx";

import { Home } from "./home.jsx";
import injectContext from "./store/appContext.jsx";

//create your first component
const Layout = () => {
  //the basename is used when your project is published in a subdirectory and not in the root of the domain
  // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
  const basename = import.meta.env.BASENAME || "";

  if (!import.meta.env.BACKEND_URL || import.meta.env.BACKEND_URL == "")
    return <BackendURL />;

  return (
    <div>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<h1>Not found!</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default injectContext(Layout);
