import React, { useState } from "react";
import { signupUser } from "../../api/api.js";

function SignupForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await signupUser({
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      setMessage("Account created successfully!");
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to create account. Try again.";
      setMessage(errorMsg);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl mt-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>

      {message && (
        <div
          className={`mb-4 p-3 rounded border text-sm ${
            message.toLowerCase().includes("success")
              ? "bg-green-100 text-green-700 border-green-400"
              : "bg-red-100 text-red-700 border-red-400"
          }`}
        >
          {message}
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
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
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
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="At least 8 characters, letters & numbers"
            className="w-full border border-gray-300 p-3 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block mb-1 font-medium text-lg"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter your password"
            className="w-full border border-gray-300 p-3 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-xl transition duration-300"
          >
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignupForm;
