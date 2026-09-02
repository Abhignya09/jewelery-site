import React, { useState } from "react";
import api from "../utils/api";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Design = () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setResult(null);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please choose a sketch image first");
      return;
    }
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("sketch", file);
    formData.append("title", title || "Untitled Design");

    try {
      const { data } = await api.post("/api/design", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(data.design);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to process sketch");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="design-page">
      <h1>Design Studio</h1>
      <p className="dashboard-intro">
        Upload a jewelry sketch and get an AI-generated 3D gold-finish preview.
      </p>

      <form className="design-form" onSubmit={handleSubmit}>
        <label>Design title (optional)</label>
        <input
          type="text"
          placeholder="e.g. Floral Gold Pendant"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Sketch image</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />

        {error && <div className="error-msg">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Generate 3D Gold Preview"}
        </button>
      </form>

      <div className="design-preview-grid">
        <div className="preview-card">
          <h3>Your Sketch</h3>
          {preview ? (
            <img src={preview} alt="Sketch preview" />
          ) : (
            <div className="placeholder-box">No sketch selected yet</div>
          )}
        </div>

        <div className="preview-card">
          <h3>AI Gold Render</h3>
          {result?.generatedImage ? (
            <>
              <img
                src={`${API_URL}${result.generatedImage}`}
                alt="Generated gold render"
              />
              <p className="mock-note">
                ⚠️ This is a placeholder render. The real GAN-based gold
                rendering will appear here once the Flask AI microservice is
                connected.
              </p>
            </>
          ) : (
            <div className="placeholder-box">
              {loading ? "Generating..." : "Result will appear here"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Design;
