import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("user");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("All fields are required");
      return;
    }
    // Auth logic
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.email === email && u.password === password && u.userType === userType);
    if (!user) {
      setError("Invalid credentials or user type");
      return;
    }
    // Store auth state
    sessionStorage.setItem("authUser", JSON.stringify(user));
    setError("");
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#e0e7ff] via-[#f0fdfa] to-[#f9fafb] p-4">
      <div className="w-full max-w-sm bg-white/80 rounded-3xl shadow-2xl p-10 flex flex-col items-center border border-gray-100 backdrop-blur-md">
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight mb-8 font-sans">Welcome Back</h1>
        <form onSubmit={handleSubmit} className="w-full">
          <h2 className="text-lg font-semibold mb-4 text-center text-gray-600">Login to your account</h2>
          {error && <div className="text-red-500 mb-3 text-center text-sm font-medium">{error}</div>}
          <input
            type="email"
            placeholder="Email"
            className="mb-3 p-3 border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-gray-50 placeholder-gray-400 transition"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="mb-3 p-3 border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-gray-50 placeholder-gray-400 transition"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <select
            className="mb-6 p-3 border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-gray-50 transition"
            value={userType}
            onChange={e => setUserType(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" className="bg-indigo-600 text-white py-3 rounded-xl w-full font-semibold hover:bg-indigo-700 transition shadow-md">Login</button>
          <div className="mt-6 text-center">
            <Link to="/signup" className="text-indigo-500 underline hover:text-indigo-700 font-medium">Don't have an account? Signup</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 