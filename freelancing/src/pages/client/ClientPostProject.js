import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";

export default function ClientPostProject() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    requiredSkills: "",
    budget: "",
    deadline: "",
    experienceLevel: "Intermediate"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Convert skills comma separated to array
      const skillsArray = formData.requiredSkills
        .split(",")
        .map(s => s.trim())
        .filter(s => s !== "");

      const payload = {
        ...formData,
        requiredSkills: skillsArray,
        budget: Number(formData.budget)
      };

      const res = await api.post("/projects", payload);

      if (res.data.success) {
        setSuccess("Project posted successfully!");
        setTimeout(() => {
          navigate("/client/dashboard");
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-content">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '8px' }}>Post a New Project</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
          Fill out the form below to post your project and start receiving proposals.
        </p>

        {error && <div className="error-banner">{error}</div>}
        {success && (
          <div style={{ background: '#ecfdf5', color: '#065f46', border: '1px solid #10b981', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="dashboard-card">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Project Title</label>
              <input 
                type="text" 
                name="title" 
                placeholder="e.g. Build an E-commerce Website"
                value={formData.title}
                onChange={handleChange}
                required 
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Description</label>
              <textarea 
                name="description"
                placeholder="Describe your project in detail..."
                rows="5"
                value={formData.description}
                onChange={handleChange}
                required 
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Category</label>
              <select name="category" value={formData.category} onChange={handleChange} required>
                <option value="">Select a category</option>
                <option value="Web Development">Web Development</option>
                <option value="Mobile Development">Mobile Development</option>
                <option value="Design">Design</option>
                <option value="Writing">Writing</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Experience Level</label>
              <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} required>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Required Skills (comma separated)</label>
              <input 
                type="text" 
                name="requiredSkills" 
                placeholder="e.g. React, Node.js, MongoDB"
                value={formData.requiredSkills}
                onChange={handleChange}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Budget (₹)</label>
              <input 
                type="number" 
                name="budget" 
                placeholder="e.g. 50000"
                min="0"
                value={formData.budget}
                onChange={handleChange}
                required 
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Deadline</label>
              <input 
                type="date" 
                name="deadline" 
                value={formData.deadline}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div style={{ gridColumn: '1 / -1', marginTop: '16px' }}>
              <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '14px' }}>
                {loading ? "Posting Project..." : "Post Project"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}