// src/components/Footer.jsx

const Footer = ({ role, onQuickAdd }) => {
  return (
    <footer className="mt-10 border-t border-white/5 pt-5 pb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-400">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-emerald-500 text-[13px] font-bold text-slate-950">
          SS
        </span>
        <div>
          <p className="font-medium text-slate-200">Sweet Stack Dashboard</p>
          <p className="text-[11px] text-slate-500">
            Built for modern Indian sweet shops · realtime inventory &amp; insights.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {role === "Admin" && (
          <button
            type="button"
            onClick={onQuickAdd}
            className="inline-flex items-center gap-2 rounded-full border border-sky-500/70 bg-slate-900/80 px-3.5 py-1.5 text-[11px] font-medium text-sky-300 shadow-sm transition hover:bg-sky-500/10"
          >
            <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-emerald-400 text-[9px] text-slate-950">
              +
            </span>
            Quick add sweet
          </button>
        )}

        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium text-slate-400 hover:text-slate-100 hover:bg-slate-800/80"
        >
          ↑ Back to top
        </button>
      </div>
    </footer>
  );
};

export default Footer;
