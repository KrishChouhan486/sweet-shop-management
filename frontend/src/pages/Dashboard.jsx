import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import AddSweet from "../admin/AddSweet";
import EditSweet from "../admin/EditSweet";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const currency = (v) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(v);

const IconSearch = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 8 0 000 16z"
    />
  </svg>
);

const IconReset = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 4h7M4 9h7M4 14h7M4 19h7M15 5l5 5-5 5"
    />
  </svg>
);

const IconPlus = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const IconEdit = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

const IconRestock = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
    />
  </svg>
);

export default function Dashboard() {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSweet, setEditingSweet] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  // search/filter
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const role = localStorage.getItem("role");

  const fetchSweets = async () => {
    setLoading(true);
    try {
      const res = await api.get("/sweets");
      setSweets(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch sweets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  const stats = useMemo(() => {
    const total = sweets.length;
    const outOfStock = sweets.filter((s) => s.quantity <= 0).length;
    const totalValue = sweets.reduce((acc, s) => acc + s.price * s.quantity, 0);
    return { total, outOfStock, totalValue };
  }, [sweets]);

  const purchaseSweet = async (id) => {
    setSweets((prev) =>
      prev.map((s) => (s._id === id ? { ...s, quantity: s.quantity - 1 } : s))
    );
    try {
      await api.post(`/sweets/${id}/purchase`);
    } catch (err) {
      setSweets((prev) =>
        prev.map((s) => (s._id === id ? { ...s, quantity: s.quantity + 1 } : s))
      );
      alert("Purchase failed");
    }
  };

  const deleteSweet = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this sweet?");
    if (!ok) return;

    try {
      await api.delete(`/sweets/${id}`);
      setSweets((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  const searchSweets = async () => {
    setLoading(true);
    try {
      const res = await api.get("/sweets/search", {
        params: {
          name: q || undefined,
          category: category || undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
        },
      });
      setSweets(res.data || []);
    } catch {
      alert("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setQ("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    fetchSweets();
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-950 text-slate-900 relative">
        {/* background gradients */}
        <div className="pointer-events-none fixed inset-0 opacity-40">
          <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-gradient-to-br from-sky-500/40 via-cyan-400/20 to-purple-500/30 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-gradient-to-tr from-fuchsia-500/30 via-emerald-400/15 to-blue-500/30 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          {/* header */}
          <header className="mb-8 lg:mb-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200 backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Smart inventory · AI-ready UX
                </div>
                <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight bg-gradient-to-r from-sky-300 via-emerald-200 to-fuchsia-300 bg-clip-text text-transparent">
                  Sweet Shop Control Center
                </h1>
                <p className="mt-3 max-w-xl text-sm sm:text-base text-slate-300">
                  Search, manage, and optimize your sweet inventory with a clean, effortless
                  interface inspired by Google design language.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 md:gap-4 min-w-[260px]">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-sm backdrop-blur-md">
                  <div className="text-[11px] uppercase tracking-wide text-slate-400">
                    Total sweets
                  </div>
                  <div className="mt-1 text-lg font-semibold text-slate-50">{stats.total}</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-sm backdrop-blur-md">
                  <div className="text-[11px] uppercase tracking-wide text-slate-400">
                    Out of stock
                  </div>
                  <div className="mt-1 text-lg font-semibold text-rose-300">
                    {stats.outOfStock}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-sm backdrop-blur-md">
                  <div className="text-[11px] uppercase tracking-wide text-slate-400">
                    Inventory value
                  </div>
                  <div className="mt-1 text-sm font-semibold text-emerald-300">
                    {currency(stats.totalValue)}
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* search / controls */}
          <section className="mb-8 lg:mb-10 rounded-3xl border border-white/10 bg-slate-900/70 p-5 sm:p-6 lg:p-7 shadow-[0_22px_40px_rgba(15,23,42,0.55)] backdrop-blur-xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-slate-50">
                  Find the perfect sweet
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-400">
                  Combine name, category, and price filters to narrow down your selection.
                </p>
              </div>

              {role === "Admin" && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSweet(null);
                      setShowAdd(true);
                    }}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-sky-500/25 transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                  >
                    <IconPlus className="h-4 w-4" />
                    Add sweet
                  </button>
                </div>
              )}
            </div>

            {/* main search row */}
            <div className="mt-5 flex flex-col gap-4">
              <div className="flex flex-col gap-3 md:flex-row">
                <div className="md:flex-[1.9] flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-2.5 shadow-inner shadow-slate-900/60 focus-within:border-sky-400/70 focus-within:ring-1 focus-within:ring-sky-500/60">
                  <IconSearch className="h-5 w-5 text-slate-400" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search by name · e.g. Gulab Jamun"
                    className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
                  />
                </div>

                <div className="flex flex-1 flex-col gap-3 sm:flex-row">
                  <input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Category"
                    className="flex-1 rounded-2xl border border-white/10 bg-slate-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500/70 focus:ring-1 focus:ring-sky-500/50 focus:outline-none"
                  />
                  <input
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min ₹"
                    type="number"
                    className="w-full sm:w-28 rounded-2xl border border-white/10 bg-slate-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500/70 focus:ring-1 focus:ring-sky-500/50 focus:outline-none"
                  />
                  <input
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max ₹"
                    type="number"
                    className="w-full sm:w-28 rounded-2xl border border-white/10 bg-slate-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500/70 focus:ring-1 focus:ring-sky-500/50 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={searchSweets}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-blue-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-sky-500/30 transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                >
                  <IconSearch className="h-4 w-4" />
                  Search
                </button>

                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/50 px-4 py-2.5 text-sm font-medium text-slate-200 shadow-sm transition hover:bg-slate-800/90 hover:text-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/70"
                >
                  <IconReset className="h-4 w-4" />
                  Reset
                </button>

                {(q || category || minPrice || maxPrice) && (
                  <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                    {q && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-800/80 px-3 py-1">
                        Name: <span className="font-medium text-sky-300">{q}</span>
                      </span>
                    )}
                    {category && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-800/80 px-3 py-1">
                        Category:{" "}
                        <span className="font-medium text-emerald-300">{category}</span>
                      </span>
                    )}
                    {minPrice && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-800/80 px-3 py-1">
                        Min:{" "}
                        <span className="font-medium text-sky-300">₹{minPrice}</span>
                      </span>
                    )}
                    {maxPrice && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-800/80 px-3 py-1">
                        Max:{" "}
                        <span className="font-medium text-sky-300">₹{maxPrice}</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* content */}
          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, n) => (
                <div
                  key={n}
                  className="animate-pulse rounded-3xl border border-white/5 bg-slate-900/70 p-5 shadow-[0_18px_32px_rgba(15,23,42,0.8)] backdrop-blur-xl"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="h-4 w-24 rounded-full bg-slate-700/60" />
                    <div className="h-4 w-16 rounded-full bg-slate-700/60" />
                  </div>
                  <div className="mb-3 h-3 w-40 rounded-full bg-slate-800/80" />
                  <div className="h-3 w-full rounded-full bg-slate-800/80" />
                  <div className="mt-6 flex flex-col gap-3">
                    <div className="h-8 w-full rounded-xl bg-slate-800/80" />
                    <div className="flex gap-3">
                      <div className="h-9 w-full rounded-xl bg-slate-900/80" />
                      <div className="h-9 w-full rounded-xl bg-slate-900/80" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : sweets.length === 0 ? (
            <div className="mt-4 rounded-3xl border border-dashed border-slate-700 bg-slate-900/70 px-6 py-12 text-center shadow-[0_18px_32px_rgba(15,23,42,0.8)] backdrop-blur-xl">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/20 text-2xl">
                🍬
              </div>
              <h3 className="text-lg font-semibold text-slate-50">No sweets found</h3>
              <p className="mt-1 text-sm text-slate-400">
                Try changing the filters or, if you're an admin, add a new sweet to the
                collection.
              </p>
              {role === "Admin" && (
                <div className="mt-5 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowAdd(true)}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-sky-500/25 transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                  >
                    <IconPlus className="h-4 w-4" />
                    Add sweet
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sweets.map((sweet) => (
                <article
                  key={sweet._id}
                  className="group flex flex-col rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-[0_18px_32px_rgba(15,23,42,0.85)] backdrop-blur-xl transition duration-300 hover:-translate-y-1.5 hover:border-sky-400/60 hover:shadow-[0_26px_50px_rgba(56,189,248,0.45)]"
                >
                  {/* header */}
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold text-slate-50 group-hover:text-sky-300">
                        {sweet.name}
                      </h3>
                      <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-slate-800/80 px-2.5 py-1 text-[11px] font-medium text-slate-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        {sweet.category || "Uncategorized"}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <div className="text-[11px] uppercase tracking-wide text-slate-400">
                        Price
                      </div>
                      <div className="mt-0.5 text-sm font-semibold text-emerald-300">
                        {currency(sweet.price)}
                      </div>
                    </div>
                  </div>

                  {/* body */}
                  <div className="mb-4 flex-1">
                    <p className="line-clamp-3 text-xs sm:text-sm text-slate-300/90">
                      {sweet.description || "A delightful treat to brighten your day."}
                    </p>
                  </div>

                  {/* footer */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-400">Stock</span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                          sweet.quantity > 10
                            ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/40"
                            : sweet.quantity > 0
                            ? "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/40"
                            : "bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/40"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            sweet.quantity > 10
                              ? "bg-emerald-400"
                              : sweet.quantity > 0
                              ? "bg-amber-400"
                              : "bg-rose-400"
                          }`}
                        />
                        {sweet.quantity} left
                      </span>
                    </div>

                    <button
                      onClick={() => purchaseSweet(sweet._id)}
                      disabled={sweet.quantity === 0}
                      className={`w-full rounded-xl py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/80 ${
                        sweet.quantity === 0
                          ? "cursor-not-allowed border border-slate-700 bg-slate-900/80 text-slate-500"
                          : "bg-gradient-to-r from-emerald-500 to-sky-500 text-slate-950 shadow-md shadow-emerald-500/30 hover:-translate-y-0.5 hover:shadow-lg"
                      }`}
                    >
                      {sweet.quantity === 0 ? "Out of stock" : "Purchase now"}
                    </button>

                    {role === "Admin" && (
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              if (showAdd) return;
                              setEditingSweet(sweet);
                            }}
                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-sky-500/60 bg-transparent px-3 py-2 text-xs sm:text-sm font-medium text-sky-300 transition hover:bg-sky-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/80"
                          >
                            <IconEdit />
                            Edit
                          </button>
                          <button
                            onClick={async () => {
                              const qty = Number(prompt("Add quantity:", "10"));
                              if (!qty || qty <= 0) return;
                              try {
                                await api.post(`/sweets/${sweet._id}/restock`, {
                                  quantity: qty,
                                });
                                setSweets((prev) =>
                                  prev.map((s) =>
                                    s._id === sweet._id
                                      ? { ...s, quantity: s.quantity + qty }
                                      : s
                                  )
                                );
                              } catch {
                                alert("Restock failed");
                              }
                            }}
                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-900/60 px-3 py-2 text-xs sm:text-sm font-medium text-slate-200 transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/80"
                          >
                            <IconRestock />
                            Restock
                          </button>
                        </div>

                        <button
                          onClick={() => deleteSweet(sweet._id)}
                          className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-rose-500/70 bg-rose-500/10 px-3 py-2 text-xs sm:text-sm font-medium text-rose-200 transition hover:bg-rose-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/80"
                        >
                          <span className="text-sm leading-none">×</span>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}

          <Footer
            role={role}
            onQuickAdd={() => {
              setEditingSweet(null);
              setShowAdd(true);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />

          {/* MODALS */}
          {showAdd && (
            <AddSweet
              onSweetAdded={(newSweet) => {
                setSweets((prev) => [newSweet, ...prev]);
              }}
              onClose={() => setShowAdd(false)}
            />
          )}

          {editingSweet && !showAdd && (
            <EditSweet
              sweet={editingSweet}
              onClose={() => setEditingSweet(null)}
              onUpdated={(updated) => {
                setSweets((prev) => prev.map((s) => (s._id === updated._id ? updated : s)));
                setEditingSweet(null);
              }}
            />
          )}
        </div>
      </main>
    </>
  );
}
