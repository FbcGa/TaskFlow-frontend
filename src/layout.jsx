import { BrowserRouter, Route, Routes } from "react-router";
import { BackendURL } from "./component/backendURL.jsx";

import { Home } from "./pages/home.jsx";
import { Login } from "./pages/login.jsx";
import { Register } from "./pages/register.jsx";
import { Navbar } from "./component/navbar.jsx";
import ProtectedRoute from "./component/protectedRoute.jsx";
import StoreWrapper from "./store/appContext.jsx";

//create your first component
export const Layout = () => {
  const basename = import.meta.env.VITE_BASENAME || "";
  if (
    !import.meta.env.VITE_BACKEND_URL ||
    import.meta.env.VITE_BACKEND_URL == ""
  )
    return <BackendURL />;

  return (
    <StoreWrapper>
      <BrowserRouter basename={basename}>
        <Navbar />
        <Routes>
          <Route
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
            path="/"
          />
          <Route element={<Login />} path="/login" />
          <Route element={<Register />} path="/register" />
          <Route path="*" element={<h1>Not found!</h1>} />
        </Routes>
      </BrowserRouter>
    </StoreWrapper>
  );
};
