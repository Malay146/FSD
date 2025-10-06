import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("user");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("All fields are required");
      setSuccess("");
      return;
    }
    // Check for duplicate email
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some(u => u.email === email)) {
      setError("Email already registered");
      setSuccess("");
      return;
    }
    // Add new user
    const newUser = { name, email, password, userType };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    setError("");
    setSuccess("Registration successful! Redirecting to login...");
    setTimeout(() => {
      setName(""); setEmail(""); setPassword(""); setUserType("user"); setSuccess("");
      navigate("/login");
    }, 1200);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#f0fdfa] via-[#e0e7ff] to-[#f9fafb] p-4">
      <div className="w-full max-w-sm bg-white/80 rounded-3xl shadow-2xl p-10 flex flex-col items-center border border-gray-100 backdrop-blur-md">
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight mb-8 font-sans">Create Account</h1>
        <form onSubmit={handleSubmit} className="w-full">
          <h2 className="text-lg font-semibold mb-4 text-center text-gray-600">Sign up to get started</h2>
          {error && <div className="text-red-500 mb-3 text-center text-sm font-medium">{error}</div>}
          {success && <div className="text-green-600 mb-3 text-center text-sm font-medium">{success}</div>}
          <input
            type="text"
            placeholder="Name"
            className="mb-3 p-3 border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-green-300 bg-gray-50 placeholder-gray-400 transition"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="mb-3 p-3 border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-green-300 bg-gray-50 placeholder-gray-400 transition"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="mb-3 p-3 border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-green-300 bg-gray-50 placeholder-gray-400 transition"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <select
            className="mb-6 p-3 border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-green-300 bg-gray-50 transition"
            value={userType}
            onChange={e => setUserType(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" className="bg-green-600 text-white py-3 rounded-xl w-full font-semibold hover:bg-green-700 transition shadow-md">Signup</button>
          <div className="mt-6 text-center">
            <Link to="/login" className="text-green-600 underline hover:text-green-800 font-medium">Already have an account? Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup; 