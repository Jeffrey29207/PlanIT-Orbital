import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Home from "./Home.tsx";
import LandingPage from "./components/LandingPage/LandingPage.tsx";
import RegistrationPage from "./components/RegistrationPage/RegistrationPage.tsx";
import LoginPage from "./components/LoginPage/LoginPage.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/registration",
    element: <RegistrationPage />,
  },
  {
    path: "/Login",
    element: <LoginPage />,
  },
  {
    path: "/home",
    element: <Home />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
