import { useNavigate } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Sidebar from "./components/Sidebar";

export default function App() {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="font-serif">
      <header>
        <h1
          className="text-4xl m-4 cursor-pointer font-bold text-purple-400"
          onClick={goHome}
          title="Go to Home"
        >
          Expense Tracker
        </h1>
      </header>
      <main className="flex">
        <Sidebar />
        <div className="p-4 w-full min-h-screen">
          <Home />
        </div>
      </main>
    </div>
  );
}
