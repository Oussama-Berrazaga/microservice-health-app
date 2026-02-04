import { useEffect, useState } from "react";
import api from "../api/axios";
import StatusCard from "../components/StatusCard";

// Updated to match your Record/DTO from the Admin Service
interface Service {
  serviceId: string;
  status: "UP" | "DOWN" | "LOADING";
  uri?: string;
  port?: number;
}

export default function HomePage({ onLogout }: { onLogout: () => void }) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRegistry = async () => {
    try {
      // Pointing to the new secured Admin Service route via Gateway
      const response = await api.get("/admin/services");
      setServices(response.data);
      setLoading(false);
    } catch (error: any) {
      console.error("Registry fetch failed:", error);
      if (error.response?.status === 403) {
        // Handle unauthorized access (maybe show a warning toast)
        alert("Session expired. Please log in again.");
        onLogout();
      }
    }
  };

  useEffect(() => {
    fetchRegistry();
    const interval = setInterval(fetchRegistry, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">
            Architect <span className="text-blue-600">OS</span>
          </h1>
          <p className="text-slate-500 font-medium">
            Node: <span className="text-blue-600">Tunis-Central-01</span>
          </p>
        </div>
        <button
          onClick={onLogout}
          className="text-sm font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest"
        >
          Terminate Session
        </button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {loading ? (
          <p className="text-slate-400 font-mono animate-pulse">
            Scanning network...
          </p>
        ) : (
          services
            .sort((a, b) => (a.port || 0) - (b.port || 0))
            .map((service) => (
              <StatusCard
                key={service.serviceId}
                name={service.serviceId.replace("-", " ")} // Prettify name
                status={service.status}
                details={
                  service.status === "UP"
                    ? "System Operational"
                    : "Service Offline"
                }
                port={service.port?.toString() || "N/A"}
              />
            ))
        )}
      </section>

      <footer className="bg-slate-900 p-6 rounded-2xl shadow-xl text-slate-300 font-mono text-xs border-t-4 border-blue-600">
        <h2 className="text-blue-400 font-bold uppercase mb-4 tracking-widest">
          Discovery Protocol v1.0
        </h2>
        <div className="space-y-1 opacity-80">
          {services.map((s) => (
            <p key={s.serviceId}>
              [{new Date().toLocaleTimeString()}] DISCOVERED: {s.serviceId} @
              PORT:{s.port} - STATUS: {s.status}
            </p>
          ))}
        </div>
      </footer>
    </div>
  );
}
