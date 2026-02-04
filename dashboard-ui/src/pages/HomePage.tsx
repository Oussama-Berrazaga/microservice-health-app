import { useEffect, useState } from "react";
import api from "../api/axios";
import StatusCard from "../components/StatusCard";

// 1. Define the shape of our service data
interface Service {
  id: string;
  name: string;
  endpoint: string;
  port: string;
  status: "UP" | "DOWN" | "LOADING";
  details: string;
}

export default function HomePage({ onLogout }: { onLogout: () => void }) {
  // 2. State to hold our list of services
  const [services, setServices] = useState<Service[]>([
    {
      id: "health",
      name: "Health Service",
      endpoint: "/health/api/status",
      port: "8081",
      status: "LOADING",
      details: "Initializing...",
    },
    {
      id: "auth",
      name: "Auth Service",
      endpoint: "/actuator/health",
      port: "8080",
      status: "LOADING",
      details: "Checking token provider...",
    },
    {
      id: "resource",
      name: "Resource Service",
      endpoint: "/resource/status",
      port: "8082",
      status: "LOADING",
      details: "Checking assets...",
    },
  ]);

  // 3. Dynamic Health Check Function
  const checkAllServices = async () => {
    const updatedServices = await Promise.all(
      services.map(async (service) => {
        try {
          const response = await api.get(service.endpoint);
          return {
            ...service,
            status: response.status === 200 ? "UP" : "DOWN",
            details:
              response.status === 200 ? "System healthy." : "Service error.",
          } as Service;
        } catch (error) {
          return {
            ...service,
            status: "DOWN",
            details: "Unreachable.",
          } as Service;
        }
      }),
    );
    setServices(updatedServices);
  };

  useEffect(() => {
    checkAllServices();
    const interval = setInterval(checkAllServices, 15000); // Polling every 15s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Console
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

      {/* 4. The Dynamic Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {services.map((service) => (
          <StatusCard
            key={service.id}
            name={service.name}
            status={service.status}
            details={service.details}
            port={service.port}
          />
        ))}

        {/* The "Add New" button still lives at the end */}
        <div className="bg-slate-100 p-6 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors cursor-pointer group">
          <p className="text-sm font-bold uppercase tracking-tighter group-hover:scale-110 transition-transform">
            + Add Service
          </p>
        </div>
      </section>

      <footer className="bg-slate-900 p-6 rounded-2xl shadow-xl text-slate-300 font-mono text-xs">
        <h2 className="text-blue-400 font-bold uppercase mb-4 tracking-widest">
          Real-time Telemetry
        </h2>
        <div className="space-y-1 opacity-80">
          {services.map((s) => (
            <p key={s.id}>
              [{new Date().toLocaleTimeString()}] {s.name.toUpperCase()} -
              status: {s.status}
            </p>
          ))}
        </div>
      </footer>
    </div>
  );
}
