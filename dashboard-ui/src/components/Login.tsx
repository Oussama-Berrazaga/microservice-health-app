import { useState } from "react";
import api from "../api/axios";
import { Lock, User } from "lucide-react";

const Login = ({
  onLoginSuccess,
}: {
  onLoginSuccess: (token: string) => void;
}) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Using the Gateway route we set up yesterday
      const response = await api.get(`/auth/token?name=${name}`);
      const token = response.data;
      localStorage.setItem("token", token);
      onLoginSuccess(token);
    } catch (err) {
      alert("Login failed. Is the Gateway & Identity Service running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <div className="p-8 bg-white shadow-xl rounded-2xl w-96 border border-slate-100">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-blue-100 rounded-full">
            <Lock className="text-blue-600" size={32} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-8">
          Service Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Username"
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors disabled:bg-blue-300"
          >
            {loading ? "Authenticating..." : "Generate Token"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
