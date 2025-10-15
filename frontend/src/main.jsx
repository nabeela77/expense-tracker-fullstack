import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Dashboard from "./pages/Dashboard.jsx";
import SignUp from "./pages/SignUp.jsx";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import { ExpenseProvider } from "./context/ExpenseContext.jsx";
import ProtectedRoute from "./components/ProtectedRoutes.jsx";
// import { RecoveryProvider } from "./context/RecoveryContext.jsx";
const isAuthenticated = !!localStorage.getItem("token");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ExpenseProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route
              index
              element={
                isAuthenticated ? (
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                ) : (
                  <Home />
                )
              }
            />

            <Route path="signup" element={<SignUp />} />
            <Route
              path="login"
              element={
                // <RecoveryProvider>
                <Login />
                // </RecoveryProvider>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ExpenseProvider>
  </StrictMode>
);
