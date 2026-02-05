// Components/Modal.tsx
export const Modal = ({ isOpen, onClose, onConfirm, title, message }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-2 uppercase italic">
            {title}
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed">{message}</p>
        </div>
        <div className="bg-slate-50 p-4 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors"
          >
            Abort
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-rose-500 text-white text-xs font-black uppercase tracking-widest rounded-lg shadow-lg shadow-rose-200 hover:bg-rose-600 active:scale-95 transition-all"
          >
            Confirm Termination
          </button>
        </div>
      </div>
    </div>
  );
};
