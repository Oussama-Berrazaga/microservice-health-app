import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ErrorPage from "./pages/ErrorPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";

function App() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const handleLogout = () => {
    localStorage.clear();
    setToken("");
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="min-h-screen w-screen bg-slate-100 flex flex-col items-center justify-center m-0 p-0">
        <h1 className="text-4xl font-extrabold mb-8 text-slate-800 tracking-tight">
          Microservices <span className="text-blue-600">Architect</span>
        </h1>

        <BrowserRouter>
          <Routes>
            {/* Public Route */}
            <Route
              path="/login"
              element={
                !token ? (
                  <LoginPage
                    onLogin={() => setToken(localStorage.getItem("token"))}
                  />
                ) : (
                  <Navigate to="/" />
                )
              }
            />

            {/* Protected Route */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage onLogout={handleLogout} />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </BrowserRouter>

        {/* Footer to verify page extent */}
        <p className="mt-8 text-slate-400 text-sm font-mono">
          Gateway Node: Active
        </p>
      </div>
    </>
  );
}

export default App;
