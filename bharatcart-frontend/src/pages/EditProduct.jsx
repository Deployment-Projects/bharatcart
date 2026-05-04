import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { getProductById, uploadProductImages, updateProduct } from "../api/productApi";

const BASE_URL = "http://localhost:8080";

const formatImageUrl = (url) => {
  if (!url) return null;
  if (typeof url !== 'string') return url; // handle data strings
  if (url.startsWith("http")) return url;
  if (url.startsWith("/")) return `${BASE_URL}${url}`;
  return `${BASE_URL}/${url}`;
};

const stripBaseUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  if (url.startsWith(BASE_URL)) {
    return url.substring(BASE_URL.length);
  }
  return url;
};

// ─── Upload Zone Component ───────────────────────────────────────────────────
const UploadZone = ({ label, hint, multiple, onChange, previews, required, onRemove, isExisting }) => {
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
                {onRemove && (
                  <button 
                    type="button" 
                    className="remove-btn" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(i);
                    }}
                  >
                    ×
                  </button>
                )}
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
const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
  });

  // Track new files to upload
  const [newCardImage, setNewCardImage]       = useState(null);
  const [newHoverImage, setNewHoverImage]     = useState(null);
  const [newDetailImages, setNewDetailImages] = useState([]); // This will hold new Files

  // Previews (can be URLs or data strings)
  const [cardPreview,   setCardPreview]   = useState([]);
  const [hoverPreview,  setHoverPreview]  = useState([]);
  const [detailPreviews, setDetailPreviews] = useState([]); // This will hold existing URLs + new previews

  // Keep track of existing images to retain or remove
  const [existingImages, setExistingImages] = useState({
    cardImageUrl: "",
    hoverImageUrl: "",
    detailImageUrls: []
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError]     = useState("");
  const [step, setStep]       = useState("form"); // 'form' | 'uploading' | 'done'

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await getProductById(id);
        setFormData({
          name: product.name,
          price: product.price,
          description: product.description || "",
          category: product.category || "",
        });
        
        setExistingImages({
          cardImageUrl: product.cardImageUrl || product.imageUrl,
          hoverImageUrl: product.hoverImageUrl || "",
          detailImageUrls: product.detailImageUrls || []
        });

        if (product.cardImageUrl || product.imageUrl) {
          setCardPreview([formatImageUrl(product.cardImageUrl || product.imageUrl)]);
        }
        if (product.hoverImageUrl) {
          setHoverPreview([formatImageUrl(product.hoverImageUrl)]);
        }
        if (product.detailImageUrls) {
          setDetailPreviews(product.detailImageUrls.map(formatImageUrl));
        }
        
        setFetching(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch product details.");
        setFetching(false);
      }
    };
    fetchProduct();
  }, [id]);

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
    setNewCardImage(file);
    setCardPreview([await toPreview(file)]);
  };

  const handleHoverImage = async (file) => {
    if (!file) return;
    setNewHoverImage(file);
    setHoverPreview([await toPreview(file)]);
  };

  const handleDetailImages = async (files) => {
    const filesArray = Array.isArray(files) ? files : [files];
    const totalCurrent = detailPreviews.length + filesArray.length;
    if (totalCurrent > 10) {
      setError("Maximum 10 detail images allowed.");
      return;
    }

    const newPreviews = await Promise.all(filesArray.map(toPreview));
    
    // Store files with their corresponding previews to make removal easier
    const newItems = filesArray.map((file, i) => ({ file, preview: newPreviews[i] }));
    
    setNewDetailImages([...newDetailImages, ...newItems]);
    setDetailPreviews([...detailPreviews, ...newPreviews]);
  };

  const removeDetailImage = (index) => {
    const previewToRemove = detailPreviews[index];
    
    // Remove from previews
    const updatedPreviews = detailPreviews.filter((_, i) => i !== index);
    setDetailPreviews(updatedPreviews);

    // Find the original relative path that matches this formatted preview
    const originalPath = existingImages.detailImageUrls.find(url => formatImageUrl(url) === previewToRemove);

    if (originalPath) {
      setExistingImages({
        ...existingImages,
        detailImageUrls: existingImages.detailImageUrls.filter(url => url !== originalPath)
      });
    } else {
      // If it was a new image
      setNewDetailImages(newDetailImages.filter(item => item.preview !== previewToRemove));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setStep("uploading");

    try {
      const uploaded = (newCardImage || newHoverImage || newDetailImages.length > 0) 
        ? await uploadFlexibleImages(newCardImage, newHoverImage, newDetailImages.map(item => item.file))
        : {};

      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        cardImageUrl:  stripBaseUrl(uploaded.cardImageUrl || existingImages.cardImageUrl),
        imageUrl:      stripBaseUrl(uploaded.cardImageUrl || existingImages.cardImageUrl),
        hoverImageUrl: stripBaseUrl(uploaded.hoverImageUrl || existingImages.hoverImageUrl),
        detailImageUrls: [
          ...existingImages.detailImageUrls.map(stripBaseUrl),
          ...(uploaded.detailImageUrls || [])
        ],
      };

      await updateProduct(id, payload);
      setStep("done");
      setTimeout(() => navigate(`/product/${id}`), 1200);
    } catch (err) {
      console.error("Full error object:", err);
      const serverMessage = err.response?.data?.message || err.response?.data;
      const errorMessage = typeof serverMessage === 'string' 
        ? serverMessage 
        : (err.message || "Update failed. Please check the console.");
      
      setError(errorMessage);
      setStep("form");
    } finally {
      setLoading(false);
    }
  };

  // Helper for flexible upload using axios
  const uploadFlexibleImages = async (card, hover, details) => {
    const fd = new FormData();
    if (card) fd.append("cardImage", card);
    if (hover) fd.append("hoverImage", hover);
    details.forEach(f => fd.append("detailImages", f));

    const response = await api.post("/products/upload", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  };

  if (fetching) return <div className="add-product-page"><div className="upload-status"><div className="spinner" /></div></div>;

  return (
    <>
      <style>{`
        /* Reuse styles from AddProduct */
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
        .page-header { text-align: center; margin-bottom: 48px; }
        .page-header h1 {
          font-size: 28px;
          font-weight: 300;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #fff;
          margin: 0 0 8px;
        }
        .page-header p { font-size: 13px; color: #666; letter-spacing: 1px; margin: 0; }
        .error-bar {
          background: rgba(220, 38, 38, 0.12);
          border: 1px solid rgba(220, 38, 38, 0.35);
          color: #f87171;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 13px;
          margin-bottom: 24px;
        }
        .form-grid { display: grid; gap: 20px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        @media (max-width: 580px) { .form-row { grid-template-columns: 1fr; } }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-label {
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #888;
          font-weight: 500;
        }
        .form-input, .form-textarea {
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
        .form-input:focus, .form-textarea:focus {
          border-color: #c9a96e;
          box-shadow: 0 0 0 3px rgba(201, 169, 110, 0.08);
        }
        .form-textarea { resize: vertical; min-height: 88px; }
        .section-divider { display: flex; align-items: center; gap: 16px; margin: 8px 0; }
        .section-divider::before, .section-divider::after { content: ''; flex: 1; height: 1px; background: #2a2a2a; }
        .section-title { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #555; white-space: nowrap; }
        .upload-zones { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 8px; }
        @media (max-width: 580px) { .upload-zones { grid-template-columns: 1fr; } }
        .upload-zone-wrapper { display: flex; flex-direction: column; gap: 8px; }
        .upload-zone-label { display: flex; align-items: baseline; gap: 8px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #888; font-weight: 500; }
        .required-star { color: #c9a96e; }
        .upload-hint { font-size: 10px; color: #444; font-weight: 400; }
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
          position: relative;
        }
        .upload-zone:hover, .upload-zone.drag-over { border-color: #c9a96e; background: rgba(201, 169, 110, 0.04); }
        .upload-placeholder { display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center; }
        .upload-icon { width: 36px; height: 36px; color: #444; }
        .upload-icon svg { width: 100%; height: 100%; }
        .upload-text { font-size: 13px; color: #555; margin: 0; }
        .upload-text span { color: #c9a96e; text-decoration: underline; }
        .preview-grid { display: flex; flex-wrap: wrap; gap: 8px; width: 100%; justify-content: center; }
        .preview-item {
          width: 72px;
          height: 90px;
          border-radius: 4px;
          overflow: hidden;
          border: 1px solid #333;
          flex-shrink: 0;
          position: relative;
        }
        .preview-item img { width: 100%; height: 100%; object-fit: cover; }
        .remove-btn {
          position: absolute;
          top: 2px;
          right: 2px;
          width: 18px;
          height: 18px;
          background: rgba(0,0,0,0.7);
          color: #fff;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          cursor: pointer;
          line-height: 1;
          transition: background 0.2s;
        }
        .remove-btn:hover { background: #dc2626; }
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
        .submit-btn:hover:not(:disabled) { background: #d4b97a; box-shadow: 0 8px 24px rgba(201, 169, 110, 0.25); transform: translateY(-1px); }
        .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .upload-status { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 40px; text-align: center; }
        .spinner { width: 40px; height: 40px; border: 2px solid #2a2a2a; border-top-color: #c9a96e; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .success-check { width: 48px; height: 48px; background: rgba(201, 169, 110, 0.15); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #c9a96e; font-size: 22px; }
      `}</style>

      <div className="add-product-page">
        <div className="add-product-container">

          <div className="page-header">
            <h1>Update Product</h1>
            <p>Modify details or manage product images</p>
          </div>

          {error && <div className="error-bar">{error}</div>}

          {step === "uploading" && (
            <div className="upload-status">
              <div className="spinner" />
              <p className="status-text">Saving changes...</p>
            </div>
          )}
          {step === "done" && (
            <div className="upload-status">
              <div className="success-check">✓</div>
              <p className="status-text">Product updated successfully!</p>
            </div>
          )}

          {step === "form" && (
            <form onSubmit={handleSubmit} className="form-grid">
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
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
                />
              </div>

              <div className="section-divider">
                <span className="section-title">Images</span>
              </div>

              <div className="upload-zones">
                <UploadZone
                  label="Card Image"
                  hint="Click to replace"
                  multiple={false}
                  required={false}
                  onChange={handleCardImage}
                  previews={cardPreview}
                />
                <UploadZone
                  label="Hover Image"
                  hint="Click to replace"
                  multiple={false}
                  required={false}
                  onChange={handleHoverImage}
                  previews={hoverPreview}
                />
              </div>

              <div className="detail-upload-zone">
                <UploadZone
                  label="Detail Gallery"
                  hint="Add up to 6 images · Click '×' to remove"
                  multiple={true}
                  required={false}
                  onChange={handleDetailImages}
                  previews={detailPreviews}
                  onRemove={removeDetailImage}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="submit-btn"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>

              <div style={{ marginTop: 20, textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={async () => {
                    if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
                      try {
                        setLoading(true);
                        const { deleteProduct } = await import("../api/productApi");
                        await deleteProduct(id);
                        navigate("/");
                      } catch (err) {
                        setError("Failed to delete product.");
                        setLoading(false);
                      }
                    }
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ff4d4d',
                    fontSize: 12,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    opacity: 0.7,
                    transition: 'opacity 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '0.7'}
                >
                  Delete Product
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </>
  );
};

export default EditProduct;
