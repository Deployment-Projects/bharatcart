import { useState, useRef } from "react";
import { uploadProductImages, createProduct } from "../api/productApi";
import { useNavigate } from "react-router-dom";

// ─── Upload Zone Component ───────────────────────────────────────────────────
const UploadZone = ({ label, hint, multiple, onChange, previews, required }) => {
  const inputRef = useRef();

  return (
    <div className="upload-zone-wrapper">
      <div className="upload-zone-label">
        {label} {required && <span className="required-star">*</span>}
        <span className="upload-hint">{hint}</span>
      </div>
      <div
        className="upload-zone"
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("drag-over"); }}
        onDragLeave={(e) => e.currentTarget.classList.remove("drag-over")}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove("drag-over");
          const files = Array.from(e.dataTransfer.files);
          onChange(multiple ? files : files[0]);
        }}
      >
        {previews && previews.length > 0 ? (
          <div className="preview-grid">
            {previews.map((src, i) => (
              <div key={i} className="preview-item">
                <img src={src} alt={`Preview ${i + 1}`} />
              </div>
            ))}
          </div>
        ) : (
          <div className="upload-placeholder">
            <div className="upload-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.338-2.32 5.25 5.25 0 0 1 1.4 10.324V19.5h-10.33Z" />
              </svg>
            </div>
            <p className="upload-text">Drag & drop or <span>click to browse</span></p>
            {multiple && <p className="upload-subtext">Select up to 6 images</p>}
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        required={required}
        style={{ display: "none" }}
        onChange={(e) => {
          const files = Array.from(e.target.files);
          onChange(multiple ? files : files[0]);
        }}
      />
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
  });

  const [cardImage, setCardImage]       = useState(null);
  const [hoverImage, setHoverImage]     = useState(null);
  const [detailImages, setDetailImages] = useState([]);

  const [cardPreview,   setCardPreview]   = useState([]);
  const [hoverPreview,  setHoverPreview]  = useState([]);
  const [detailPreviews, setDetailPreviews] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [step, setStep]       = useState("form"); // 'form' | 'uploading' | 'done'

  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const toPreview = (file) =>
    new Promise((res) => {
      const reader = new FileReader();
      reader.onloadend = () => res(reader.result);
      reader.readAsDataURL(file);
    });

  const handleCardImage = async (file) => {
    if (!file) return;
    setCardImage(file);
    setCardPreview([await toPreview(file)]);
  };

  const handleHoverImage = async (file) => {
    if (!file) return;
    setHoverImage(file);
    setHoverPreview([await toPreview(file)]);
  };

  const handleDetailImages = async (files) => {
    const capped = files.slice(0, 6);
    setDetailImages(capped);
    const previews = await Promise.all(capped.map(toPreview));
    setDetailPreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cardImage) {
      setError("A card image is required.");
      return;
    }
    setLoading(true);
    setError("");
    setStep("uploading");

    try {
      // 1. Upload all images
      const uploaded = await uploadProductImages(cardImage, hoverImage, detailImages);

      // 2. Build product payload
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        imageUrl:      uploaded.cardImageUrl,   // legacy compat
        cardImageUrl:  uploaded.cardImageUrl,
        hoverImageUrl: uploaded.hoverImageUrl || null,
        detailImageUrls: uploaded.detailImageUrls || [],
      };

      await createProduct(payload);
      setStep("done");
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        "Upload failed. Please try again."
      );
      setStep("form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        /* ── Page ── */
        .add-product-page {
          min-height: 100vh;
          background: #0d0d0d;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          padding: 48px 16px;
          color: #e8e8e8;
        }
        .add-product-container {
          max-width: 800px;
          margin: 0 auto;
        }

        /* ── Header ── */
        .page-header {
          text-align: center;
          margin-bottom: 48px;
        }
        .page-header h1 {
          font-size: 28px;
          font-weight: 300;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #fff;
          margin: 0 0 8px;
        }
        .page-header p {
          font-size: 13px;
          color: #666;
          letter-spacing: 1px;
          margin: 0;
        }

        /* ── Error ── */
        .error-bar {
          background: rgba(220, 38, 38, 0.12);
          border: 1px solid rgba(220, 38, 38, 0.35);
          color: #f87171;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 13px;
          margin-bottom: 24px;
        }

        /* ── Form Grid ── */
        .form-grid {
          display: grid;
          gap: 20px;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        @media (max-width: 580px) {
          .form-row { grid-template-columns: 1fr; }
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .form-label {
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #888;
          font-weight: 500;
        }
        .form-input,
        .form-textarea {
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-radius: 6px;
          padding: 12px 14px;
          font-size: 14px;
          color: #e8e8e8;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: inherit;
          width: 100%;
          box-sizing: border-box;
        }
        .form-input:focus,
        .form-textarea:focus {
          border-color: #c9a96e;
          box-shadow: 0 0 0 3px rgba(201, 169, 110, 0.08);
        }
        .form-input::placeholder,
        .form-textarea::placeholder {
          color: #444;
        }
        .form-textarea {
          resize: vertical;
          min-height: 88px;
        }

        /* ── Section Divider ── */
        .section-divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 8px 0;
        }
        .section-divider::before,
        .section-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #2a2a2a;
        }
        .section-title {
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #555;
          white-space: nowrap;
        }

        /* ── Upload Zones ── */
        .upload-zones {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 8px;
        }
        @media (max-width: 580px) {
          .upload-zones { grid-template-columns: 1fr; }
        }
        .upload-zone-wrapper {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .upload-zone-label {
          display: flex;
          align-items: baseline;
          gap: 8px;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #888;
          font-weight: 500;
        }
        .required-star { color: #c9a96e; }
        .upload-hint {
          font-size: 10px;
          letter-spacing: 0;
          text-transform: none;
          color: #444;
          font-weight: 400;
        }
        .upload-zone {
          border: 1.5px dashed #2a2a2a;
          border-radius: 8px;
          padding: 20px;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          min-height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .upload-zone:hover,
        .upload-zone.drag-over {
          border-color: #c9a96e;
          background: rgba(201, 169, 110, 0.04);
        }
        .upload-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          text-align: center;
        }
        .upload-icon {
          width: 36px;
          height: 36px;
          color: #444;
        }
        .upload-icon svg { width: 100%; height: 100%; }
        .upload-text {
          font-size: 13px;
          color: #555;
          margin: 0;
        }
        .upload-text span { color: #c9a96e; text-decoration: underline; }
        .upload-subtext {
          font-size: 11px;
          color: #444;
          margin: 0;
        }

        /* ── Preview Grid ── */
        .preview-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          width: 100%;
          justify-content: center;
        }
        .preview-item {
          width: 72px;
          height: 90px;
          border-radius: 4px;
          overflow: hidden;
          border: 1px solid #333;
          flex-shrink: 0;
        }
        .preview-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* ── Detail Upload Zone ── */
        .detail-upload-zone {
          width: 100%;
        }
        .detail-upload-zone .upload-zone {
          min-height: 100px;
        }

        /* ── Submit Button ── */
        .submit-btn {
          width: 100%;
          padding: 16px;
          background: #c9a96e;
          color: #0d0d0d;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          margin-top: 8px;
          font-family: inherit;
        }
        .submit-btn:hover:not(:disabled) {
          background: #d4b97a;
          box-shadow: 0 8px 24px rgba(201, 169, 110, 0.25);
          transform: translateY(-1px);
        }
        .submit-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        /* ── Upload Status ── */
        .upload-status {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 40px;
          text-align: center;
        }
        .spinner {
          width: 40px;
          height: 40px;
          border: 2px solid #2a2a2a;
          border-top-color: #c9a96e;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .status-text {
          font-size: 13px;
          color: #888;
          letter-spacing: 1px;
        }
        .success-check {
          width: 48px;
          height: 48px;
          background: rgba(201, 169, 110, 0.15);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #c9a96e;
          font-size: 22px;
        }
      `}</style>

      <div className="add-product-page">
        <div className="add-product-container">

          {/* Header */}
          <div className="page-header">
            <h1>Add Product</h1>
            <p>Fill in product details and upload images</p>
          </div>

          {/* Error */}
          {error && <div className="error-bar">{error}</div>}

          {/* Upload Status Overlay */}
          {step === "uploading" && (
            <div className="upload-status">
              <div className="spinner" />
              <p className="status-text">Optimizing & uploading images...</p>
            </div>
          )}
          {step === "done" && (
            <div className="upload-status">
              <div className="success-check">✓</div>
              <p className="status-text">Product added successfully!</p>
            </div>
          )}

          {/* Form */}
          {step === "form" && (
            <form onSubmit={handleSubmit} className="form-grid">

              {/* Basic Info */}
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., Elegant Gold Necklace"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="1999"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g., Necklaces"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Describe the product — material, style, occasion..."
                />
              </div>

              {/* Image Upload Section */}
              <div className="section-divider">
                <span className="section-title">Images</span>
              </div>

              {/* Card + Hover */}
              <div className="upload-zones">
                <UploadZone
                  label="Card Image"
                  hint="600×750 · 4:5 ratio"
                  multiple={false}
                  required={true}
                  onChange={handleCardImage}
                  previews={cardPreview}
                />
                <UploadZone
                  label="Hover Image"
                  hint="Model / lifestyle shot"
                  multiple={false}
                  required={false}
                  onChange={handleHoverImage}
                  previews={hoverPreview}
                />
              </div>

              {/* Detail Images */}
              <div className="detail-upload-zone">
                <UploadZone
                  label="Detail Gallery"
                  hint="High-res · up to 6 images · shown on product page"
                  multiple={true}
                  required={false}
                  onChange={handleDetailImages}
                  previews={detailPreviews}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="submit-btn"
              >
                {loading ? "Uploading..." : "Publish Product"}
              </button>
            </form>
          )}

        </div>
      </div>
    </>
  );
};

export default AddProduct;
