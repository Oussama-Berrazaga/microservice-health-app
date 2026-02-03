import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Activity, ShieldCheck, Server } from "lucide-react";

interface ServiceStatus {
  name: string;
  status: "UP" | "DOWN" | "LOADING";
  details: string;
}

const Dashboard = () => {
  const [healthStatus, setHealthStatus] = useState<ServiceStatus>({
    name: "Health Service",
    status: "LOADING",
    details: "Checking connectivity...",
  });

  const checkHealth = async () => {
    try {
      // Remember: Gateway routes /health/** to Health Service
      const response = await api.get("/health/api/status");
      if (response.status === 200) {
        setHealthStatus({
          name: "Health Service",
          status: "UP",
          details: "System is healthy and responsive.",
        });
      }
    } catch (error) {
      setHealthStatus({
        name: "Health Service",
        status: "DOWN",
        details: "Service unreachable via Gateway.",
      });
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Infrastructure Monitor
          </h1>
          <p className="text-slate-500">Real-time microservice telemetry</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-slate-600">
            Gateway Active
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Health Service Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div
              className={`p-3 rounded-xl ${healthStatus.status === "UP" ? "bg-green-50" : "bg-red-50"}`}
            >
              <Activity
                className={
                  healthStatus.status === "UP"
                    ? "text-green-600"
                    : "text-red-600"
                }
                size={24}
              />
            </div>
            <span
              className={`text-xs font-bold px-2 py-1 rounded-full uppercase ${
                healthStatus.status === "UP"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {healthStatus.status}
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            {healthStatus.name}
          </h3>
          <p className="text-sm text-slate-500 mt-1">{healthStatus.details}</p>

          <div className="mt-6 pt-4 border-t border-slate-50 flex items-center gap-2 text-xs text-slate-400">
            <Server size={14} />
            <span>Port: 8081 (via Gateway)</span>
          </div>
        </div>

        {/* Placeholder for future services */}
        <div className="bg-slate-100 p-6 rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
          <p className="text-sm font-medium">Add New Service</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
