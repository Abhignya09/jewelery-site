import React, { useEffect, useState } from "react";
import api from "../utils/api";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const History = () => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const { data } = await api.get("/api/design");
        setDesigns(data.designs);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load history");
      } finally {
        setLoading(false);
      }
    };
    fetchDesigns();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this design?")) return;
    try {
      await api.delete(`/api/design/${id}`);
      setDesigns((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete");
    }
  };

  if (loading) return <div>Loading history...</div>;

  return (
    <div className="history-page">
      <h1>Design History</h1>
      {error && <div className="error-msg">{error}</div>}
      {designs.length === 0 && !error && (
        <p className="dashboard-intro">
          You haven't created any designs yet. Head to Design Studio to upload your first sketch.
        </p>
      )}

      <div className="history-grid">
        {designs.map((d) => (
          <div className="history-card" key={d._id}>
            <div className="history-images">
              <img src={`${API_URL}${d.sketchImage}`} alt="sketch" />
              {d.generatedImage && <img src={`${API_URL}${d.generatedImage}`} alt="generated" />}
            </div>
            <h4>{d.title}</h4>
            <span className={`status-badge status-${d.status}`}>{d.status}</span>
            <p className="history-date">{new Date(d.createdAt).toLocaleString()}</p>
            <button className="delete-btn" onClick={() => handleDelete(d._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
