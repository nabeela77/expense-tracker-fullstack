import { useNavigate, Outlet } from "react-router-dom";
import "./App.css";

import Sidebar from "./components/Sidebar.jsx";
import { Logout } from "./components/Logout.jsx";
export default function App() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token");
  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="font-serif">
      <header>
        <nav className="flex items-center justify-between px-4 py-3 border-b border-gray-300">
          <h1
            className="text-4xl cursor-pointer font-bold text-purple-400"
            onClick={goHome}
            title="Go to Home"
          >
            Expense Tracker
          </h1>

          {/* Show Logout only if authenticated */}
          {isAuthenticated && <Logout />}
        </nav>
      </header>

      <main className="flex">
        {!isAuthenticated && <Sidebar />}

        <div className="p-4 w-full min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
