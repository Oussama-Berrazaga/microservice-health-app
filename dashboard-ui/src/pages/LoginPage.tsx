import { useState } from "react";
import { Lock } from "lucide-react";
import { loginApi } from "../api/authentication";

export default function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await loginApi({ username, password });

      // Artificial delay of 800ms to appreciate your UI work
      setTimeout(() => {
        const token = response.data.token;
        localStorage.setItem("token", token);
        setIsLoading(false);
        setUsername("");
        setPassword("");
        onLogin();
      }, 800);
    } catch (error) {
      setIsLoading(false);
      console.error("Login failed", error);
      alert("Check console - login failed.");
    }
  };

  return (
    <div className="bg-white p-10 rounded-xl shadow-xl border border-slate-200 flex flex-col gap-4 w-full max-w-sm">
      <div className="flex justify-center mb-6">
        <div className="p-3 bg-blue-100 rounded-full">
          <Lock className="text-blue-600" size={32} />
        </div>
      </div>
      <h2 className="text-xl font-semibold text-slate-700">System Login</h2>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-600">Username</label>
        <input
          className="border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 bg-slate-50"
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label className="text-sm font-medium text-slate-600">Password</label>
        <div className="relative flex items-center">
          <input
            className="border border-slate-300 p-3 pr-12 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 bg-slate-50 w-full transition-all"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3  p-0! bg-transparent! text-slate-400 hover:text-blue-600 transition-colors border-none! outline-none! flex items-center justify-center"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              /* Slashed Eye (Hide) */
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            ) : (
              /* Normal Eye (Show) */
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
      <button
        disabled={isLoading}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all shadow-md active:scale-95 
            ${isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
        onClick={handleLogin}
        type="submit"
      >
        {isLoading ? (
          <>
            {/* The Spinner */}
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Authenticating...</span>
          </>
        ) : (
          "Authenticate"
        )}
      </button>
    </div>
  );
}
