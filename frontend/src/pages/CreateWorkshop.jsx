import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Plus } from "lucide-react";
import AppBackground from "../components/AppBackground";
import { createWorkshop } from "../services/workshopApi";
import "./CreateWorkshop.css";

const WORKSHOP_IMAGE_CACHE_KEY = "skillnovaWorkshopImages";

function CreateWorkshop() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    instructor: "",
    description: "",
    price: "",
    workshopImage: ""
  });
  const [imagePreview, setImagePreview] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getImageCacheKey = (workshop) =>
    [workshop.title, workshop.date, workshop.time, workshop.instructor].join("|");

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      alert("Please upload a JPG, PNG, or WEBP image.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = typeof reader.result === "string" ? reader.result : "";
      setImagePreview(base64Image);
      setForm((prev) => ({ ...prev, workshopImage: base64Image }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("SUBMIT FIRED");

    const formEl = e.currentTarget;
    if (!formEl.reportValidity()) {
      return;
    }
    console.log("VALIDATION PASSED");

    const payload = {
      title: form.title,
      date: form.date,
      time: form.time,
      location: form.location,
      instructor: form.instructor,
      description: form.description,
      price: Number(form.price),
      workshopImage: form.workshopImage
    };

    let createdWorkshop = null;
    try {
      console.log("ABOUT TO FETCH", payload);

      createdWorkshop = await createWorkshop(payload);
      console.log("WORKSHOP CREATED", createdWorkshop);
    } catch (err) {
      console.error("Workshop creation failed:", err);
      alert("Failed to create workshop. Please try again.");
      return;
    }

    if (payload.workshopImage) {
      try {
        const cacheRaw = localStorage.getItem(WORKSHOP_IMAGE_CACHE_KEY);
        const cache = cacheRaw ? JSON.parse(cacheRaw) : {};
        cache[getImageCacheKey(createdWorkshop || payload)] = payload.workshopImage;
        localStorage.setItem(WORKSHOP_IMAGE_CACHE_KEY, JSON.stringify(cache));
      } catch (err) {
        console.error("Error caching workshop image:", err);
      }
    }

    alert("Workshop Created!");
    navigate("/dashboard");
  };

  return (
    <div className="create-workshop-page">
      <AppBackground />

      <motion.div 
        className="create-workshop-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="create-workshop-header">
          <button type="button" className="back-btn" onClick={() => navigate("/dashboard")}>
            <ArrowLeft size={18} /> Back to Dashboard
          </button>
          <h2 className="create-workshop-title">Create New Workshop</h2>
        </div>

        <form className="create-workshop-form" noValidate onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Workshop Title</label>
            <input 
              name="title" 
              className="form-input" 
              placeholder="e.g. Next.js 14 Architecture" 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input 
                name="date" 
                type="date" 
                className="form-input" 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Time</label>
              <input 
                name="time" 
                type="time" 
                className="form-input" 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">College / Venue</label>
              <input 
                name="location" 
                className="form-input" 
                placeholder="College / Venue" 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Instructor</label>
              <input 
                name="instructor" 
                className="form-input" 
                placeholder="e.g. David Chen" 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              name="description" 
              className="form-input form-textarea" 
              placeholder="What will students learn in this workshop?" 
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">WORKSHOP PRICE (₹)</label>
            <input
              name="price"
              type="number"
              min="0"
              step="1"
              className="form-input"
              placeholder="e.g. 499"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Workshop Cover Image</label>
            <label className="image-upload-box" htmlFor="workshop-cover-image">
              <input
                id="workshop-cover-image"
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                className="image-upload-input"
                onChange={handleImageChange}
              />
              {imagePreview ? (
                <img src={imagePreview} alt="Workshop cover preview" className="image-preview" />
              ) : (
                <div className="image-upload-text">
                  <p>Upload Workshop Cover Image</p>
                  <span>Supported: JPG, PNG, WEBP</span>
                </div>
              )}
            </label>
          </div>

          <button type="submit" className="submit-btn">
            <Plus size={20} style={{ marginRight: "8px", verticalAlign: "middle" }} />
            Create Workshop
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default CreateWorkshop;
