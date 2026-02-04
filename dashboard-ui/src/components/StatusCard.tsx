import { Activity, Server } from "lucide-react";

interface StatusCardProps {
  name: string;
  status: "UP" | "DOWN" | "LOADING";
  details: string;
  port: string;
}

export default function StatusCard({
  name,
  status,
  details,
  port,
}: StatusCardProps) {
  const isUp = status === "UP";
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${isUp ? "bg-green-50" : "bg-red-50"}`}>
          <Activity
            className={isUp ? "text-green-600" : "text-red-600"}
            size={24}
          />
        </div>
        <span
          className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
            isUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {status}
        </span>
      </div>
      <h3 className="text-lg font-bold text-slate-800 capitalize">{name}</h3>
      <p className="text-sm text-slate-500 mt-1 h-10">{details}</p>
      <div className="mt-6 pt-4 border-t border-slate-50 flex items-center gap-2 text-xs text-slate-400 font-mono">
        <Server size={14} />
        <span>Port: {port}</span>
      </div>
    </div>
  );
}
