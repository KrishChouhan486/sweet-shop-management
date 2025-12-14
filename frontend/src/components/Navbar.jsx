import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "Guest";

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Left: logo + name */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-emerald-400 to-fuchsia-500 shadow-[0_0_30px_rgba(56,189,248,0.6)]">
            <span className="text-lg">🍬</span>
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-slate-50">
              Sweet Shop
            </p>
            <p className="text-[11px] text-slate-400">
              Control Center
            </p>
          </div>
        </div>

        {/* Right: role + logout */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex flex-col items-end text-[11px] leading-tight">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-slate-900/80 px-2.5 py-0.5 text-[11px] font-medium text-slate-100">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {role}
            </span>
          </div>

          {/* mobile: compact role pill */}
          <span className="sm:hidden inline-flex items-center gap-1 rounded-full border border-white/10 bg-slate-900/80 px-2.5 py-1 text-[11px] font-medium text-slate-100">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {role}
          </span>

          <button
            onClick={logoutHandler}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-600 bg-slate-900/80 px-3 py-1.5 text-[11px] sm:text-xs font-medium text-slate-100 shadow-sm transition hover:border-rose-500/70 hover:bg-rose-500/10 hover:text-rose-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/70"
          >
            <span className="hidden sm:inline">Logout</span>
            <span className="sm:hidden">Exit</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
