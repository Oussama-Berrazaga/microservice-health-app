import { useEffect, useRef, useState } from "react";
import api from "../api/axios";
import StatusCard from "../components/StatusCard";
import toast from "react-hot-toast";
import { Modal } from "../components/Modal";

// Updated to match your Record/DTO from the Admin Service
interface Service {
  instanceId: string;
  serviceId: string;
  status: "UP" | "DOWN" | "LOADING";
  port?: number;
  details?: {
    db?: { status: string; details?: { database: string } };
    diskSpace?: { details: { free: number; total: number } };
    ping?: { status: string };
  };
}
interface LogEntry {
  timestamp: string;
  message: string;
  type: "info" | "warning" | "danger";
}
export default function HomePage({ onLogout }: { onLogout: () => void }) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmTarget, setConfirmTarget] = useState<{
    id: string;
    port: number;
  } | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const previousStatus = useRef<Record<string, string>>({});
  console.log("previousStatus", previousStatus);
  const triggerShutdown = (serviceId: string, port: number) => {
    setConfirmTarget({ id: serviceId, port });
  };
  const fetchRegistry = async () => {
    try {
      // Pointing to the new secured Admin Service route via Gateway
      const response = await api.get("/admin/registry");
      const servicesData: Service[] = response.data;
      servicesData.forEach((s) => {
        if (
          previousStatus.current[s.instanceId] === "UP" &&
          s.status === "DOWN"
        ) {
          addLog(
            `CRITICAL: ${s.serviceId} on port ${s.port} has disconnected.`,
            "danger",
          );
        }
        previousStatus.current[s.instanceId] = s.status;
      });
      setServices(servicesData);
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
  const executeShutdown = async () => {
    if (!confirmTarget) return;

    const { id, port } = confirmTarget;
    setConfirmTarget(null); // Close modal immediately

    const shutdownPromise = api.post(`/admin/shutdown/${id}/${port}`);
    toast.promise(
      shutdownPromise,
      {
        loading: `Terminating ${id}...`,
        success: (res) => {
          fetchRegistry(); // Refresh the list
          return `${id} shut down successfully!`;
        },
        error: (err) => {
          console.error(err);
          return `Failed to stop ${id}.`;
        },
      },
      {
        style: {
          minWidth: "250px",
          borderRadius: "10px",
          background: "#334155", // Slate-700
          color: "#fff",
          fontSize: "12px",
          fontWeight: "bold",
        },
        success: {
          duration: 4000,
          iconTheme: {
            primary: "#10b981", // Emerald-500
            secondary: "#fff",
          },
        },
      },
    );
  };
  const addLog = (message: string, type: LogEntry["type"] = "info") => {
    const newLog = {
      timestamp: new Date().toLocaleTimeString(),
      message,
      type,
    };
    console.log("new log", newLog);
    // Keep only the last 50 logs so the UI stays fast
    setLogs((prev) => {
      const updatedLogs = [newLog, ...prev].slice(0, 50);
      // Save to browser storage
      localStorage.setItem("admin_logs", JSON.stringify(updatedLogs));
      return updatedLogs;
    });
  };
  const getServiceVitals = (service: Service) => {
    if (service.status === "DOWN" || !service.details) {
      return { dbStatus: "OFFLINE", diskInfo: "N/A" };
    }

    // Extract DB Status
    const dbStatus = service.details.db?.status || "N/A";

    // Extract and Format Disk Info (Bytes to GB)
    let diskInfo = "N/A";
    if (service.details.diskSpace) {
      const freeGb = (
        service.details.diskSpace.details.free /
        1024 /
        1024 /
        1024
      ).toFixed(1);
      diskInfo = `${freeGb} GB Free`;
    }

    return { dbStatus, diskInfo };
  };
  useEffect(() => {
    fetchRegistry();
    const interval = setInterval(fetchRegistry, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const savedLogs = localStorage.getItem("admin_logs");
    if (savedLogs) setLogs(JSON.parse(savedLogs));
  }, []);
  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* The New Modal */}
      <Modal
        isOpen={!!confirmTarget}
        onClose={() => setConfirmTarget(null)}
        onConfirm={executeShutdown}
        title="System Override"
        message={`You are about to send a SIGTERM signal to ${confirmTarget?.id} on port ${confirmTarget?.port}. This action will immediately remove the node from the active registry.`}
      />
      <header className="mb-10 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">
              Architect <span className="text-blue-600">OS</span>
            </h1>
            {/* The Service Count Badge */}
            {!loading && (
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-200 shadow-sm">
                {services.length} NODES ACTIVE
              </span>
            )}
          </div>
          <p className="text-slate-500 font-medium mt-1">
            Node:{" "}
            <span className="text-blue-600 font-mono">Tunis-Central-01</span>
          </p>
        </div>

        <button
          onClick={onLogout}
          className="text-sm font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest border-b-2 border-transparent hover:border-red-200 pb-1"
        >
          Terminate Session
        </button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {loading ? (
          <div className="col-span-3 flex justify-center py-20">
            <p className="text-slate-400 font-mono animate-pulse uppercase tracking-widest">
              Initializing Discovery Protocol...
            </p>
          </div>
        ) : (
          services
            // Sorting by port (Ascending: 8080 -> 8081 -> 8082)
            .sort((a, b) => (a.port || 0) - (b.port || 0))
            .map((instance) => {
              const { dbStatus, diskInfo } = getServiceVitals(instance);
              return (
                <StatusCard
                  key={instance.instanceId}
                  name={`${instance.serviceId.replace("-", " ")} #${instance.port}`}
                  status={instance.status}
                  port={instance.port?.toString() || "N/A"}
                  handleShutdown={() =>
                    triggerShutdown(instance.serviceId, instance.port || 0)
                  }
                  details={
                    <div className="flex flex-col h-full">
                      {/* Vitals Section */}
                      <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100 space-y-2.5">
                        {/* Database Line */}
                        <div className="flex justify-between items-center text-[11px]">
                          <div className="flex items-center gap-1.5 text-slate-500 font-semibold uppercase tracking-wider">
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${dbStatus === "UP" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "bg-rose-500 animate-pulse"}`}
                            />
                            Database
                          </div>
                          <span
                            className={`font-mono font-bold ${dbStatus === "UP" ? "text-emerald-600" : "text-rose-600"}`}
                          >
                            {dbStatus}
                          </span>
                        </div>

                        {/* Storage Line */}
                        <div className="flex justify-between items-center text-[11px]">
                          <div className="flex items-center gap-1.5 text-slate-500 font-semibold uppercase tracking-wider">
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2.5"
                                d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                              />
                            </svg>
                            Storage
                          </div>
                          <span className="text-slate-600 font-mono font-bold">
                            {diskInfo}
                          </span>
                        </div>
                      </div>
                    </div>
                  }
                />
              );
            })
        )}
      </section>

      <footer className="bg-slate-900 p-6 rounded-2xl shadow-xl text-slate-300 font-mono text-xs border-t-4 border-blue-600">
        <h2 className="text-blue-400 font-bold uppercase mb-4 tracking-widest">
          Discovery Protocol v1.0
        </h2>
        <div className="space-y-1 opacity-80">
          {services.map((s) => (
            <p key={s.instanceId}>
              [{new Date().toLocaleTimeString()}] DISCOVERED: {s.serviceId} @
              PORT:{s.port} - STATUS: {s.status}
            </p>
          ))}
        </div>

        <div className="mt-12 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
          <div className="bg-slate-800/50 px-6 py-3 border-b border-slate-700 flex justify-between items-center">
            <h2 className="text-slate-300 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Live System Audit
            </h2>
            <button
              onClick={() => setLogs([])}
              className="text-[10px] text-slate-500 hover:text-slate-300 uppercase font-bold"
            >
              Clear Buffer
            </button>
          </div>

          <div className="h-48 overflow-y-auto p-4 font-mono text-[11px] space-y-1 custom-scrollbar">
            {logs.length === 0 ? (
              <p className="text-slate-600 italic">
                Waiting for system events...
              </p>
            ) : (
              logs.map((log, i) => (
                <div
                  key={i}
                  className="flex gap-4 animate-in slide-in-from-left duration-300"
                >
                  <span className="text-slate-500">[{log.timestamp}]</span>
                  <span
                    className={
                      log.type === "danger"
                        ? "text-rose-400"
                        : log.type === "warning"
                          ? "text-amber-400"
                          : "text-emerald-400"
                    }
                  >
                    {log.type.toUpperCase()}
                  </span>
                  <span className="text-slate-300">{log.message}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
