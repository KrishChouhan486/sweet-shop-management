import { useState } from "react";
import api from "../api/axios";

const IconClose = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path
      d="M6 6l12 12M18 6l-12 12"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const EditSweet = ({ sweet, onClose, onUpdated }) => {
  const [name, setName] = useState(sweet.name);
  const [category, setCategory] = useState(sweet.category);
  const [price, setPrice] = useState(sweet.price);
  const [quantity, setQuantity] = useState(sweet.quantity);
  const [saving, setSaving] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put(`/sweets/${sweet._id}`, {
        name,
        category,
        price: Number(price),
        quantity: Number(quantity),
      });

      alert("Sweet updated successfully ✏️");
      onUpdated(res.data);
      onClose();
    } catch (error) {
      alert("Update failed (Admin only)");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center px-4 py-6 sm:px-6">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        onClick={saving ? undefined : onClose}
      />

      {/* card */}
      <div className="relative z-10 mt-20 w-full max-w-lg overflow-hidden rounded-3xl border border-white/15 bg-slate-900/80 shadow-[0_24px_60px_rgba(15,23,42,0.95)] backdrop-blur-2xl">
        <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-emerald-400 to-fuchsia-500" />

        <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-2 sm:px-6">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-50">Edit sweet</h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Update name, category, price, and stock. Changes reflect instantly in the dashboard.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-slate-900/60 text-slate-400 shadow-sm transition hover:bg-slate-800 hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <IconClose className="w-4 h-4" />
          </button>
        </div>

        <form
          onSubmit={submitHandler}
          className="space-y-4 px-5 pt-2 pb-5 sm:px-6 sm:pb-6"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-300">
                Sweet name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Gulab Jamun"
                className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500/70 focus:ring-1 focus:ring-sky-500/60 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-300">
                Category
              </label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Bengali, Dry fruit"
                className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500/70 focus:ring-1 focus:ring-emerald-500/60 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-300">
                Price (₹)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min={0}
                step="0.5"
                className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500/70 focus:ring-1 focus:ring-sky-500/60 focus:outline-none"
                placeholder="120"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-300">
                Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                min={0}
                className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500/70 focus:ring-1 focus:ring-emerald-500/60 focus:outline-none"
                placeholder="50"
              />
            </div>

            <div className="flex flex-col justify-end text-xs text-slate-400">
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 px-3 py-2">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Inventory impact
                </div>
                <p className="mt-1 text-[11px] leading-snug">
                  Price and quantity updates will refresh stats in real time.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="mt-1 inline-flex items-center justify-center rounded-full border border-white/10 bg-slate-900/80 px-4 py-2 text-xs sm:text-sm font-medium text-slate-200 shadow-sm transition hover:bg-slate-800 hover:text-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900/40 border-t-slate-950" />
                  Saving…
                </>
              ) : (
                "Save changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSweet;
