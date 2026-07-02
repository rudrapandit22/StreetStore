import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useproduct } from '../hooks/useproducts';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';
import { useCart } from '../../cart/hook/useCart';
const CURRENCY_SYMBOLS = { INR: '₹', USD: '$', EUR: '€', GBP: '£', AED: 'د.إ', JPY: '¥' };

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { handlegetproductbyid } = useproduct();
  const user = useSelector((state) => state.auth.user);
  const {handleAdditem} = useCart();

  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState({});

  // Helper to parse variant attributes into a plain JS object
  const getParsedAttributes = (variant) => {
    if (!variant || !variant.attributes) return {};
    const raw = variant.attributes;
    if (typeof raw.toJSON === 'function') return raw.toJSON();
    if (raw instanceof Map) return Object.fromEntries(raw.entries());
    if (Array.isArray(raw)) {
      const obj = {};
      raw.forEach(item => { obj[item.key] = item.value; });
      return obj;
    }
    return raw;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const prod = await handlegetproductbyid(productId);
        setProduct(prod);
        if (prod?.images?.length > 0) {
          setSelectedImage(prod.images[0].url);
        }
        if (prod?.variants?.length > 0) {
          const firstVar = prod.variants[0];
          setSelectedVariant(firstVar);
          if (firstVar.images?.length > 0) {
            setSelectedImage(firstVar.images[0].url);
          }
          
          const initialAttrs = {};
          const parsed = getParsedAttributes(firstVar);
          Object.entries(parsed).forEach(([k, v]) => {
            initialAttrs[k] = v;
          });
          setSelectedAttributes(initialAttrs);
        }
      } catch (err) {
        setError('Failed to load product details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const displayImages = [
    ...(selectedVariant?.images || []),
    ...(product?.images || [])
  ].filter((img, idx, self) => 
    self.findIndex(i => i.url === img.url) === idx
  );

  const handlePrevImage = () => {
    if (!displayImages.length) return;
    const currentIndex = displayImages.findIndex(img => img.url === selectedImage);
    const prevIndex = (currentIndex - 1 + displayImages.length) % displayImages.length;
    setSelectedImage(displayImages[prevIndex].url);
  };

  const handleNextImage = () => {
    if (!displayImages.length) return;
    const currentIndex = displayImages.findIndex(img => img.url === selectedImage);
    const nextIndex = (currentIndex + 1) % displayImages.length;
    setSelectedImage(displayImages[nextIndex].url);
  };

  const handleAction = async (actionType) => {
    if (!user) {
      alert("Please log in to continue.");
      navigate('/login');
      return;
    }

    const variantId = selectedVariant?._id || "";
    if (actionType === 'cart') {
      setAddingToCart(true);
      try {
        await handleAdditem(product._id, variantId, 1);
        alert(`${product.title} has been added to your cart.`);
      } catch (err) {
        alert(err.response?.data?.message || err.message || "Failed to add item to cart");
      } finally {
        setAddingToCart(false);
      }
    } else if (actionType === 'buy') {
      setBuyingNow(true);
      try {
        await handleAdditem(product._id, variantId, 1);
        navigate('/cart');
      } catch (err) {
        alert(err.response?.data?.message || err.message || "Failed to add item to cart");
        setBuyingNow(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-[#6B5A47]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] flex flex-col items-center justify-center p-6">
        <div className="text-center p-8 border border-[#E6E1D8] rounded-3xl bg-white max-w-md">
          <p className="text-red-600 font-semibold text-sm">{error || "Product not found"}</p>
          <Link to="/" className="mt-4 inline-block bg-[#1C1917] text-white text-xs uppercase font-bold tracking-widest px-4 py-2.5 rounded-lg hover:bg-[#2C2927] transition-all">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F5] font-sans">
      {/* Premium Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#EBE7DF] px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-extrabold tracking-widest uppercase font-serif text-[#1C1917]">
          SNITCH
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xs uppercase tracking-wider font-bold text-[#6B5A47] hover:text-[#1C1917] transition-colors">
            Shop
          </Link>
          {user ? (
            <span className="text-xs uppercase tracking-wider font-bold text-[#6B5A47]">
              Hi, {user.fullname.split(' ')[0]}
            </span>
          ) : (
            <Link to="/login" className="text-xs uppercase tracking-wider font-bold text-[#1C1917] hover:text-[#8C7A65] transition-colors">
              Login
            </Link>
          )}
          {/* Cart Icon */}
          <Link to="/cart" className="relative text-[#1C1917] hover:text-[#8C7A65] transition-colors p-1" aria-label="Cart">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="absolute top-0 right-0 w-2 h-2 bg-[#8C7A65] rounded-full"></span>
          </Link>
        </div>
      </nav>

      {/* Main product view */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Images Section */}
          <div className="space-y-3 max-w-[360px] mx-auto w-full">
            <div className="aspect-[3/4] bg-white border border-[#EBE7DF] rounded-2xl overflow-hidden shadow-sm relative group">
              <img
                src={selectedImage || 'https://placehold.co/600x800?text=No+Image'}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {displayImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#1C1917] p-1.5 rounded-full shadow-md transition-all hover:scale-105 active:scale-95"
                    aria-label="Previous image"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#1C1917] p-1.5 rounded-full shadow-md transition-all hover:scale-105 active:scale-95"
                    aria-label="Next image"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>
            {displayImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {displayImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img.url)}
                    className={`w-14 aspect-[3/4] rounded-lg overflow-hidden border-2 bg-white flex-shrink-0 transition-all
                      ${selectedImage === img.url ? 'border-[#8C7A65]' : 'border-[#EBE7DF] hover:border-[#C5BEB2]'}`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="flex flex-col justify-between py-1 h-full min-h-[360px]">
            <div>
              <h1 className="text-xl md:text-2xl font-bold font-serif tracking-wide text-[#1C1917]">
                {product.title}
              </h1>
              <div className="mt-2 text-base font-extrabold tracking-wider text-[#8C7A65]">
                {CURRENCY_SYMBOLS[selectedVariant?.price?.currency || product.price?.currency] || selectedVariant?.price?.currency || product.price?.currency || '₹'} {(selectedVariant?.price?.amount ?? product.price?.amount)?.toLocaleString()}
              </div>

              {user && product && (
                ((typeof product.seller === 'string' && product.seller === user._id) ||
                 (product.seller?._id && product.seller._id === user._id) ||
                 (product.seller === user._id))
              ) && (
                <div className="mt-4 bg-[#FAF9F5] border border-[#EBE7DF] rounded-2xl p-4 flex items-center justify-between shadow-sm">
                  <div className="text-xs text-[#6B5A47] font-semibold">
                    You listed this product.
                  </div>
                  <Link 
                    to={`/seller/product/${product._id}`}
                    className="bg-[#1C1917] hover:bg-[#2C2927] text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all"
                  >
                    Manage Variants & Stock
                  </Link>
                </div>
              )}

              {/* Variants Selector */}
              {product.variants?.length > 0 && (() => {
                const attributeKeys = Array.from(
                  new Set(
                    product.variants.flatMap(v => Object.keys(getParsedAttributes(v)))
                  )
                );

                const getValuesForAttribute = (key) => {
                  return Array.from(
                    new Set(
                      product.variants.map(v => getParsedAttributes(v)[key]).filter(Boolean)
                    )
                  );
                };

                const isOptionSelectable = (key, val) => {
                  const testAttrs = { ...selectedAttributes, [key]: val };
                  return product.variants.some(v => {
                    const vAttrs = getParsedAttributes(v);
                    return Object.entries(testAttrs).every(([k, vVal]) => vAttrs[k] === vVal);
                  });
                };

                const handleSelectAttribute = (key, value) => {
                  const nextAttrs = { ...selectedAttributes, [key]: value };
                  setSelectedAttributes(nextAttrs);

                  let match = product.variants.find(v => {
                    const vAttrs = getParsedAttributes(v);
                    return Object.entries(nextAttrs).every(([k, val]) => vAttrs[k] === val);
                  });

                  if (!match) {
                    // Fallback: find first variant matching the clicked attribute value
                    match = product.variants.find(v => getParsedAttributes(v)[key] === value);
                    if (match) {
                      const parsed = getParsedAttributes(match);
                      const newAttrs = {};
                      Object.entries(parsed).forEach(([k, v]) => {
                        newAttrs[k] = v;
                      });
                      setSelectedAttributes(newAttrs);
                    }
                  }

                  if (match) {
                    setSelectedVariant(match);
                    if (match.images && match.images.length > 0) {
                      setSelectedImage(match.images[0].url);
                    }
                  } else {
                    setSelectedVariant(null);
                  }
                };

                const getVariantImageForValue = (key, val) => {
                  const testAttrs = { ...selectedAttributes, [key]: val };
                  let match = product.variants.find(v => {
                    const vAttrs = getParsedAttributes(v);
                    return Object.entries(testAttrs).every(([k, vVal]) => vAttrs[k] === vVal);
                  });

                  if (!match || !match.images?.length) {
                    match = product.variants.find(v => getParsedAttributes(v)[key] === val && v.images?.length > 0);
                  }

                  if (match && match.images?.length > 0) {
                    return match.images[0].url;
                  }

                  return product.images?.[0]?.url || 'https://placehold.co/100x130?text=No+Image';
                };

                const sortedKeys = [...attributeKeys].sort((a, b) => {
                  const aSize = a.toLowerCase().includes('size');
                  const bSize = b.toLowerCase().includes('size');
                  if (aSize && !bSize) return -1;
                  if (!aSize && bSize) return 1;
                  return 0;
                });

                return (
                  <div className="mt-4 border-t border-[#EBE7DF] pt-4 space-y-4">
                    {sortedKeys.map(key => {
                      const values = getValuesForAttribute(key);
                      const isColorKey = key.toLowerCase().includes('color') || key.toLowerCase().includes('colour');

                      return (
                        <div key={key}>
                          <h3 className="text-xs uppercase tracking-wider font-bold text-[#1C1917] mb-2">{key}</h3>
                          <div className="flex flex-wrap gap-3">
                            {values.map(val => {
                              const isSelected = selectedAttributes[key] === val;
                              const isAvailable = isOptionSelectable(key, val);

                              if (isColorKey) {
                                const imageUrl = getVariantImageForValue(key, val);
                                return (
                                  <button
                                    key={val}
                                    onClick={() => handleSelectAttribute(key, val)}
                                    className="group flex flex-col items-center gap-1 focus:outline-none"
                                  >
                                    <div className={`w-12 h-16 rounded-xl overflow-hidden border-2 bg-white flex-shrink-0 transition-all shadow-sm
                                      ${isSelected
                                        ? 'border-[#8C7A65] ring-2 ring-[#8C7A65]/30 scale-105'
                                        : isAvailable
                                          ? 'border-[#EBE7DF] hover:border-[#C5BEB2]'
                                          : 'border-[#EBE7DF]/45 opacity-40'
                                      }`}
                                    >
                                      <img src={imageUrl} alt={val} className="w-full h-full object-cover" />
                                    </div>
                                    <span className={`text-[10px] font-medium transition-colors ${
                                      isSelected 
                                        ? 'text-[#8C7A65] font-bold' 
                                        : isAvailable 
                                          ? 'text-[#6B5A47]' 
                                          : 'text-[#6B5A47]/45 line-through'
                                    }`}>
                                      {val}
                                    </span>
                                  </button>
                                );
                              }

                              return (
                                <button
                                  key={val}
                                  onClick={() => handleSelectAttribute(key, val)}
                                  className={`text-xs px-3 py-1.5 rounded-xl border transition-all font-medium ${
                                    isSelected
                                      ? 'border-[#8C7A65] bg-[#FAF9F5] text-[#8C7A65] ring-1 ring-[#8C7A65]'
                                      : isAvailable
                                        ? 'border-[#EBE7DF] bg-white text-[#6B5A47] hover:border-[#C5BEB2]'
                                        : 'border-[#EBE7DF]/45 bg-white/40 text-[#6B5A47]/45 line-through cursor-pointer hover:border-[#C5BEB2]'
                                  }`}
                                >
                                  {val}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                    {!selectedVariant && (
                      <p className="text-red-500 text-xs font-semibold mt-2">
                        ⚠️ Selected combination is unavailable. Please choose another option.
                      </p>
                    )}
                  </div>
                );
              })()}

              <div className="mt-4 border-t border-[#EBE7DF] pt-4">
                <h3 className="text-xs uppercase tracking-wider font-bold text-[#1C1917]">Description</h3>
                <p className="mt-2 text-[#6B5A47] text-xs leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Actions CTA */}
            <div className="mt-6 border-t border-[#EBE7DF] pt-6">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleAction('cart')}
                  disabled={addingToCart || buyingNow || !selectedVariant || selectedVariant.stock === 0}
                  className="bg-white border border-[#1C1917] text-[#1C1917] hover:bg-[#FAF9F5] text-[10px] uppercase font-bold tracking-widest py-3 px-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {addingToCart ? "Adding..." : !selectedVariant ? "Unavailable" : selectedVariant.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
                <button
                  onClick={() => handleAction('buy')}
                  disabled={addingToCart || buyingNow || !selectedVariant || selectedVariant.stock === 0}
                  className="bg-[#1C1917] text-white hover:bg-[#2C2927] text-[10px] uppercase font-bold tracking-widest py-3 px-4 rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {buyingNow ? "Processing..." : !selectedVariant ? "Unavailable" : selectedVariant.stock === 0 ? "Out of Stock" : "Buy Now"}
                </button>
              </div>
              <p className="text-[9px] text-center text-[#B5ADA2] uppercase tracking-wider font-semibold mt-3">
                Free shipping &amp; simple returns nationwide
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
