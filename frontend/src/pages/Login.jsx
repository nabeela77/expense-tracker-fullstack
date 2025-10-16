import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/api.js";
import { useExpenses } from "../context/ExpenseContext.jsx";
// import { useRecovery } from "../context/RecoveryContext.jsx";
import { useState } from "react";
const Login = () => {
  const { login, email, setEmail, password, setPassword, expense, setExpense } =
    useExpenses();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   setError("");
  //   setSuccess("");

  //   try {
  //     await loginUser({ email, password });
  //     await login(localStorage.getItem("token"));
  //     setSuccess("Logged in successfully!");
  //     setEmail("");
  //     setPassword("");
  //     navigate("/");
  //   } catch (err) {
  //     const message =
  //       err.response?.data?.message || "Login failed. Please try again.";
  //     setError(message);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      // 1. Get the token (returned as a string)
      const token = await loginUser({ email, password });

      // 2. Login with token — this fetches expenses
      const expenses = await login(token);

      setSuccess("Logged in successfully!");
      setEmail("");
      setPassword("");

      // 3. Optional: Only navigate if login was successful
      if (expenses.length >= 0) {
        navigate("/dashboard");
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again.";
      setError(message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-xl mt-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-center">
          {success}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block mb-1 font-medium text-lg">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full border border-gray-300 p-3 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1 font-medium text-lg">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full border border-gray-300 p-3 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-xl transition duration-300"
        >
          Login
        </button>
        <button
          type="button"
          className="text-purple-600 hover:underline text-sm mt-2"
        >
          Forgot password?
        </button>
      </form>
    </div>
  );
};

export default Login;
