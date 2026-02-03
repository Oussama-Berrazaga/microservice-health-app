import { useState } from "react";
import api from "./api/axios";
import { loginApi } from "./api/authentication";

function App() {
  const [username, setUsername] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const handleLogin = async () => {
    try {
      // Calling our Gateway route to Identity Service
      const response = await loginApi({ username, password: "dummyPassword" });
      const token = response.data.token;

      localStorage.setItem("token", token);
      setToken(token);
      alert("Login Successful! Token stored.");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-8">Microservices Dashboard</h1>

      {!token ? (
        <div className="bg-white p-8 rounded shadow-md">
          <input
            className="border p-2 mr-2"
            type="text"
            placeholder="Enter name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-green-600 mb-4">Logged in as {username}!</p>
          <button
            className="bg-red-400 text-white px-2 py-1 text-sm rounded"
            onClick={() => {
              localStorage.clear();
              setToken("");
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
