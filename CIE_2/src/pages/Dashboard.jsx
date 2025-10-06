import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get all users from localStorage
    const usersData = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(usersData);
    // Get current user from sessionStorage
    const authUser = JSON.parse(sessionStorage.getItem("authUser"));
    setCurrentUser(authUser);
    if (!authUser) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("authUser");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdfa] via-[#e0e7ff] to-[#f9fafb] p-4 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white/80 rounded-3xl shadow-2xl p-10 mb-8 flex flex-col md:flex-row md:justify-between items-center border border-gray-100 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center gap-2 w-full justify-between">
          <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight mb-2 md:mb-0 font-sans">Dashboard</h2>
          {currentUser && (
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <span className="text-gray-700">Logged in as: <b>{currentUser.name}</b> <span className={`ml-1 px-2 py-0.5 rounded text-xs font-semibold ${currentUser.userType === 'admin' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>{currentUser.userType}</span></span>
              <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">Logout</button>
            </div>
          )}
        </div>
      </div>
      <div className="w-full max-w-2xl bg-white/80 rounded-3xl shadow-lg p-10 border border-gray-100 backdrop-blur-md">
        <h3 className="text-lg font-semibold mb-6 text-gray-700">Registered Users</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-indigo-50">
              <tr>
                <th className="border px-4 py-2 font-semibold text-gray-700">Name</th>
                <th className="border px-4 py-2 font-semibold text-gray-700">Email</th>
                <th className="border px-4 py-2 font-semibold text-gray-700">Type</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={idx} className="text-center even:bg-indigo-50/40">
                  <td className="border px-4 py-2">{user.name}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${user.userType === 'admin' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>{user.userType}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 