import { useNavigate } from "react-router-dom";

export function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
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
