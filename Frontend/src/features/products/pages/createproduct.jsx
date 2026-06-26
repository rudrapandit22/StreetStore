import React, { useState, useRef } from 'react';
import { useproduct } from '../hooks/useproducts';

const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD', 'JPY'];
const MAX_IMAGES = 7;

const CreateProduct = () => {
  const { handlecreateproduct } = useproduct();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceAmount: '',
    priceCurrency: 'INR',
  });

  const [images, setImages] = useState([]); // Array of { file, preview }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef(null);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const addFiles = (files) => {
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) return;
    const accepted = Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .slice(0, remaining);
    const newImages = accepted.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
    setError('');
  };

  const handleFileInput = (e) => addFiles(e.target.files);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const removeImage = (index) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title.trim()) return setError('Product title is required.');
    if (!formData.description.trim()) return setError('Description is required.');
    if (!formData.priceAmount || isNaN(Number(formData.priceAmount)) || Number(formData.priceAmount) <= 0)
      return setError('Please enter a valid price.');
    if (images.length === 0) return setError('Please upload at least one product image.');

    const fd = new FormData();
    fd.append('title', formData.title.trim());
    fd.append('description', formData.description.trim());
    fd.append('priceAmount', formData.priceAmount);
    fd.append('priceCurrency', formData.priceCurrency);
    images.forEach(({ file }) => fd.append('images', file));

    try {
      setLoading(true);
      await handlecreateproduct(fd);
      setSuccess('Product listed successfully!');
      setFormData({ title: '', description: '', priceAmount: '', priceCurrency: 'INR' });
      setImages([]);
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen w-full bg-[#FAF9F5] flex items-start justify-center px-4 py-12 overflow-hidden font-sans">
      {/* Ambient blobs */}
      <div className="absolute top-[-8%] left-[-8%] w-[420px] h-[420px] rounded-full bg-[#EAE3D2]/35 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-8%] right-[-8%] w-[420px] h-[420px] rounded-full bg-[#E3D9C6]/30 blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-2xl">
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 bg-[#F5F1E9] border border-[#E2D8C6] rounded-2xl flex items-center justify-center mb-4 shadow-sm">
            <svg className="w-6 h-6 text-[#6B5A47]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
            </svg>
          </div>
          <h1 className="text-[#1A1817] text-3xl font-extrabold tracking-widest text-center uppercase font-serif">
            List a Product
          </h1>
          <p className="text-[#4C453C] text-[10px] mt-2.5 text-center uppercase tracking-widest font-semibold">
            Snitch · Premium Apparel & Streetwear
          </p>
        </div>

        {/* ── Card ───────────────────────────────────────────── */}
        <div className="relative bg-white border border-[#EBE7DF] rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(230,225,215,0.25)] overflow-hidden">
          {/* Linen texture */}
          <div
            className="absolute inset-0 opacity-[0.12] bg-cover bg-center pointer-events-none"
            style={{ backgroundImage: "url('/card_bg_texture.jpg')" }}
          />

          {/* ── Alerts ─────────────────────────────────────── */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-start gap-3">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{success}</span>
            </div>
          )}

          {/* ── Form ───────────────────────────────────────── */}
          <form onSubmit={handleSubmit} className="space-y-7">

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-[#1C1A17] text-[10px] font-bold uppercase tracking-wider mb-2">
                Product Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="e.g. Oversized Cargo Tee – Olive"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full bg-[#FAF8F5] border border-[#E6E1D8] rounded-xl px-4 py-3 text-[#1C1A17] placeholder-neutral-400 focus:outline-none focus:border-[#8C7A65] focus:ring-1 focus:ring-[#8C7A65]/20 transition-all text-sm"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-[#1C1A17] text-[10px] font-bold uppercase tracking-wider mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Describe the material, fit, sizing, and any other details…"
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full bg-[#FAF8F5] border border-[#E6E1D8] rounded-xl px-4 py-3 text-[#1C1A17] placeholder-neutral-400 focus:outline-none focus:border-[#8C7A65] focus:ring-1 focus:ring-[#8C7A65]/20 transition-all text-sm resize-none leading-relaxed"
              />
            </div>

            {/* Price row */}
            <div className="grid grid-cols-5 gap-4">
              {/* Currency */}
              <div className="col-span-2">
                <label htmlFor="priceCurrency" className="block text-[#1C1A17] text-[10px] font-bold uppercase tracking-wider mb-2">
                  Currency
                </label>
                <div className="relative">
                  <select
                    id="priceCurrency"
                    name="priceCurrency"
                    value={formData.priceCurrency}
                    onChange={handleChange}
                    className="w-full appearance-none bg-[#FAF8F5] border border-[#E6E1D8] rounded-xl px-4 py-3 text-[#1C1A17] focus:outline-none focus:border-[#8C7A65] focus:ring-1 focus:ring-[#8C7A65]/20 transition-all text-sm pr-9 cursor-pointer"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9C9188]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Amount */}
              <div className="col-span-3">
                <label htmlFor="priceAmount" className="block text-[#1C1A17] text-[10px] font-bold uppercase tracking-wider mb-2">
                  Price
                </label>
                <input
                  id="priceAmount"
                  name="priceAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.priceAmount}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#FAF8F5] border border-[#E6E1D8] rounded-xl px-4 py-3 text-[#1C1A17] placeholder-neutral-400 focus:outline-none focus:border-[#8C7A65] focus:ring-1 focus:ring-[#8C7A65]/20 transition-all text-sm"
                />
              </div>
            </div>

            {/* Image upload */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[#1C1A17] text-[10px] font-bold uppercase tracking-wider">
                  Product Images
                </label>
                <span className="text-[10px] text-[#9C9188] font-semibold tabular-nums">
                  {images.length} / {MAX_IMAGES}
                </span>
              </div>

              {/* Drop zone */}
              {images.length < MAX_IMAGES && (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-2xl py-10 px-6 cursor-pointer transition-all duration-200
                    ${dragOver
                      ? 'border-[#8C7A65] bg-[#F5F1E9]'
                      : 'border-[#E6E1D8] bg-[#FAF8F5] hover:border-[#C5BEB2] hover:bg-[#F5F2ED]'
                    }`}
                >
                  <svg className="w-8 h-8 text-[#B5ADA2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-[#6B5A47] text-xs font-semibold tracking-wide">
                    Drop images here or <span className="underline underline-offset-2">browse</span>
                  </p>
                  <p className="text-[#B5ADA2] text-[11px]">
                    PNG, JPG, WEBP · up to {MAX_IMAGES} images
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileInput}
                  />
                </div>
              )}

              {/* Thumbnail grid */}
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {images.map((img, i) => (
                    <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-[#E6E1D8] bg-[#FAF8F5]">
                      <img
                        src={img.preview}
                        alt={`Product image ${i + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {/* Badge for first image */}
                      {i === 0 && (
                        <span className="absolute top-1.5 left-1.5 bg-[#1C1917]/80 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full backdrop-blur-sm">
                          Cover
                        </span>
                      )}
                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/90 border border-[#E6E1D8] text-[#6B5A47] hover:bg-red-50 hover:border-red-200 hover:text-red-500 flex items-center justify-center transition-all duration-150 opacity-0 group-hover:opacity-100 shadow-sm"
                        aria-label={`Remove image ${i + 1}`}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}

                  {/* Add more slot */}
                  {images.length < MAX_IMAGES && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-xl border-2 border-dashed border-[#E6E1D8] bg-[#FAF8F5] hover:border-[#C5BEB2] hover:bg-[#F5F2ED] flex flex-col items-center justify-center gap-1 transition-all duration-200 group"
                    >
                      <svg className="w-5 h-5 text-[#B5ADA2] group-hover:text-[#8C7A65] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-[10px] text-[#B5ADA2] group-hover:text-[#8C7A65] font-semibold transition-colors">Add</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#E6E1D8]" />
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="submit-product"
              disabled={loading}
              className="w-full bg-[#1C1917] hover:bg-[#2C2927] text-white font-semibold py-3.5 px-4 rounded-xl shadow-md transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-center select-none"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Listing product…</span>
                </div>
              ) : (
                'List Product'
              )}
            </button>
          </form>
        </div>

        {/* Footer note */}
        <p className="text-center text-[11px] text-[#B5ADA2] mt-6 tracking-wide">
          Products are reviewed before going live · Snitch Seller Hub
        </p>
      </div>
    </div>
  );
};

export default CreateProduct;
