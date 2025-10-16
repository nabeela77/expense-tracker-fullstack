import { useNavigate } from "react-router-dom";

import { useExpenses } from "../context/ExpenseContext";
export function Logout() {
  const navigate = useNavigate();
  const { logout } = useExpenses();
  const handleLogout = () => {
    navigate("/login");
    logout();
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-1 rounded-md text-sm transition duration-300"
      style={{ minWidth: "80px" }}
    >
      Logout
    </button>
  );
}
