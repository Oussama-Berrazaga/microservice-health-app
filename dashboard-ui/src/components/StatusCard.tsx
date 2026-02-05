import { Activity, Server } from "lucide-react";

interface StatusCardProps {
  name: string;
  status: "UP" | "DOWN" | "LOADING";
  details: React.ReactNode; // Change from string to ReactNode
  port: string;
  handleShutdown: () => void;
}

export default function StatusCard({
  name,
  status,
  details,
  port,
  handleShutdown,
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
      <div className="text-sm text-slate-500 mt-1 h-10">{details}</div>
      <div className="mt-6 pt-4 border-t border-slate-50 flex items-center gap-2 text-xs text-slate-400 font-mono">
        {/* Action Area */}
        {/* <div className="mt-4 pt-3 border-t border-slate-100"> */}
        <button
          onClick={handleShutdown}
          className="group w-full flex items-center justify-center gap-2 py-2 bg-white text-rose-500 text-[10px] font-black uppercase tracking-[0.15em] rounded-lg border border-rose-100 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-200 active:scale-[0.97]"
        >
          <svg
            className="w-3 h-3 transition-transform group-hover:rotate-90"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Terminate Node
        </button>
        {/* </div> */}
      </div>
    </div>
  );
}
