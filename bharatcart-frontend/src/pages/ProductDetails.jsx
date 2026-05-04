import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useCart } from "../context/CartContext";
import api from "../api/axios";

import { FaStar } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { FiTruck, FiShield, FiShare2, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const BASE_URL = "http://localhost:8080";

const formatImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  if (url.startsWith("/")) return `${BASE_URL}${url}`;
  return `${BASE_URL}/${url}`;
};

// ─── Zoom-on-hover image component ──────────────────────────────────────────
const ZoomImage = ({ src, alt }) => {
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin({ x, y });
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setZoom(true)}
      onMouseLeave={() => setZoom(false)}
      onMouseMove={handleMouseMove}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        cursor: zoom ? "zoom-in" : "default",
      }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          transition: zoom ? "none" : "transform 0.3s ease",
          transform: zoom ? `scale(2.2)` : "scale(1)",
          transformOrigin: `${origin.x}% ${origin.y}%`,
        }}
      />
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch {
        console.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div style={{ background: "#fafafa", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 44, height: 44, border: "2px solid #eee", borderTopColor: "#cc0f39", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ background: "#fafafa", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#999", fontSize: 15 }}>Product not found.</p>
      </div>
    );
  }

  // ── Build gallery: detailImageUrls first, then card image as fallback ──────
  const rawGallery = product.detailImageUrls && product.detailImageUrls.length > 0
    ? product.detailImageUrls
    : [product.cardImageUrl || product.imageUrl].filter(Boolean);

  const gallery = rawGallery.map(formatImageUrl).filter(Boolean);

  // If still empty, use unsplash placeholder
  if (gallery.length === 0) {
    gallery.push("https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=1200&auto=format&fit=crop");
  }

  const currentImage = gallery[selectedIdx];
  const prevImage = () => setSelectedIdx((i) => (i - 1 + gallery.length) % gallery.length);
  const nextImage = () => setSelectedIdx((i) => (i + 1) % gallery.length);

  const originalPrice = Math.round((product.price || 1899) * 2.5);
  const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  return (
    <>
      <style>{`
        .pd-zoom-container {
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .pd-thumb-btn {
          width: 72px;
          height: 72px;
          border: 2px solid transparent;
          border-radius: 4px;
          overflow: hidden;
          cursor: pointer;
          transition: border-color 0.2s, transform 0.15s;
          background: #f8f6f0;
          padding: 0;
          flex-shrink: 0;
        }
        .pd-thumb-btn.active { border-color: #111; }
        .pd-thumb-btn:hover:not(.active) { border-color: #bbb; transform: translateY(-1px); }
        .pd-thumb-btn img { width: 100%; height: 100%; object-fit: cover; }
        .pd-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.9);
          border: 1px solid #eee;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: background 0.2s, box-shadow 0.2s;
        }
        .pd-nav-btn:hover { background: #fff; box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
        .pd-nav-btn.prev { left: 12px; }
        .pd-nav-btn.next { right: 12px; }
      `}</style>

      <div style={{ background: "#fff", minHeight: "100vh", fontFamily: "'Inter', -apple-system, sans-serif" }}>
        <main style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>

          <div style={{ display: "grid", gridTemplateColumns: "1fr min(450px, 40%)", gap: 48, alignItems: "start" }}
            className="product-detail-grid">
            
            {/* ── LEFT: Image Gallery ─────────────────────────────────────── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

              {/* Main Image with Zoom */}
              <div
                style={{
                  background: "#f8f6f0",
                  borderRadius: 4,
                  aspectRatio: "1/1",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <ZoomImage src={currentImage} alt={product.name} />

                {/* Prev / Next arrows (only if >1 image) */}
                {gallery.length > 1 && (
                  <>
                    <button className="pd-nav-btn prev" onClick={prevImage} aria-label="Previous image">
                      <FiChevronLeft size={18} />
                    </button>
                    <button className="pd-nav-btn next" onClick={nextImage} aria-label="Next image">
                      <FiChevronRight size={18} />
                    </button>
                  </>
                )}

                {/* Image count badge */}
                {gallery.length > 1 && (
                  <div style={{
                    position: "absolute", bottom: 12, right: 12,
                    background: "rgba(0,0,0,0.4)", color: "#fff",
                    fontSize: 11, padding: "3px 8px", borderRadius: 20, backdropFilter: "blur(4px)"
                  }}>
                    {selectedIdx + 1} / {gallery.length}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {gallery.length > 1 && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {gallery.map((img, idx) => (
                    <button
                      key={idx}
                      className={`pd-thumb-btn ${idx === selectedIdx ? "active" : ""}`}
                      onClick={() => setSelectedIdx(idx)}
                      aria-label={`View image ${idx + 1}`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── RIGHT: Product Info ─────────────────────────────────────── */}
            <div style={{ display: "flex", flexDirection: "column", paddingTop: 8 }}>

              {/* Title + Share */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 12 }}>
                <h1 style={{ fontSize: 24, fontWeight: 400, color: "#111", lineHeight: 1.3, margin: 0 }}>
                  {product.name}
                </h1>
                <button
                  style={{ padding: "8px", background: "#f5f5f5", borderRadius: "50%", border: "none", cursor: "pointer", flexShrink: 0 }}
                  aria-label="Share"
                >
                  <FiShare2 size={18} color="#555" />
                </button>
              </div>

              {/* Deal Badge */}
              <div style={{ background: "#c2002f", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 8px", width: "max-content", marginBottom: 16 }}>
                Limited time deal
              </div>

              {/* Pricing */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                <span style={{ fontSize: 26, fontWeight: 600, color: "#111" }}>
                  ₹{product.price?.toLocaleString("en-IN")}
                </span>
                <span style={{ fontSize: 16, color: "#aaa", textDecoration: "line-through" }}>
                  ₹{originalPrice.toLocaleString("en-IN")}
                </span>
                <span style={{ background: "#f2ece4", color: "#111", fontSize: 12, fontWeight: 700, padding: "3px 8px", borderRadius: 2 }}>
                  SAVE {discountPercent}%
                </span>
              </div>
              <p style={{ fontSize: 11, color: "#aaa", marginBottom: 20 }}>(inclusive of all taxes)</p>

              {/* Admin Actions */}
              <div style={{ marginBottom: 20, display: "flex", gap: 12 }}>
                <Link
                  to={`/edit-product/${product.id}`}
                  style={{
                    fontSize: 11,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    fontWeight: 600,
                    color: "#c9a96e",
                    textDecoration: "none",
                    border: "1px solid #c9a96e",
                    padding: "6px 12px",
                    borderRadius: 4,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6
                  }}
                >
                  Edit Product
                </Link>
              </div>

              {/* Ratings */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                <div style={{ display: "flex", color: "#fbbd08", gap: 2 }}>
                  {[...Array(5)].map((_, i) => <FaStar key={i} size={13} />)}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#111" }}>
                  <MdVerified color="#00a859" size={16} />
                  <span>Verified Reviews</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div style={{ display: "flex", borderTop: "1px solid #eee", borderBottom: "1px solid #eee", padding: "16px 0", marginBottom: 24, gap: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, paddingRight: 12 }}>
                  <FiShield color="#c2002f" size={22} strokeWidth={1.5} />
                  <span style={{ fontSize: 11, color: "#333", lineHeight: 1.4 }}>250,000+ Satisfied Customers</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, paddingLeft: 12, borderLeft: "1px solid #eee" }}>
                  <FiTruck color="#c2002f" size={22} strokeWidth={1.5} />
                  <span style={{ fontSize: 11, color: "#333", lineHeight: 1.4 }}>FREE &amp; FAST Delivery: 2–3 Days</span>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div style={{ marginBottom: 24 }}>
                  <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7, margin: 0 }}>
                    {product.description}
                  </p>
                </div>
              )}

              {/* Stock Indicator */}
              <div style={{ marginBottom: 28 }}>
                <p style={{ fontSize: 13, color: "#111", marginBottom: 8 }}>
                  Hurry! Only <strong>8</strong> left in stock
                </p>
                <div style={{ height: 6, background: "#eee", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: "15%", background: "#c2002f", borderRadius: 99 }} />
                </div>
              </div>

              {/* Special Offer */}
              <div style={{ background: "#f8f6f0", borderRadius: 8, padding: "12px 16px", marginBottom: 28 }}>
                <p style={{ fontSize: 12, color: "#555", margin: 0 }}>
                  <strong style={{ color: "#c2002f" }}>SPECIAL OFFER 🎉</strong>{" "}
                  Get Extra 10% off using code <strong>BHARAT10</strong> at checkout.
                </p>
              </div>

              {/* Quantity + Add to Cart */}
              <div style={{ display: "flex", gap: 12, alignItems: "stretch" }}>
                <div style={{ display: "flex", border: "1px solid #ddd", borderRadius: 4, overflow: "hidden", width: 120 }}>
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    style={{ flex: 1, background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#555", padding: "10px 0" }}
                  >−</button>
                  <span style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 500, color: "#111", fontSize: 15 }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    style={{ flex: 1, background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#555", padding: "10px 0" }}
                  >+</button>
                </div>
                <button
                  onClick={() => { for (let i = 0; i < quantity; i++) addToCart(product); }}
                  style={{
                    flex: 1, background: "#232323", color: "#fff",
                    border: "none", borderRadius: 4, cursor: "pointer",
                    fontSize: 13, fontWeight: 700, letterSpacing: 2,
                    textTransform: "uppercase", transition: "background 0.2s",
                    fontFamily: "inherit", padding: "0 20px",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#000"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "#232323"}
                >
                  Add to Cart
                </button>
              </div>

            </div>
          </div>
        </main>
      </div>
    </>
  );
}