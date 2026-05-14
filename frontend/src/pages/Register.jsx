import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Monitor, Award, Cpu, Users } from "lucide-react";
import Navbar from "../components/Navbar";
import AppBackground from "../components/AppBackground";
import { API_BASE_URL } from "../services/apiConfig";
import { fetchWorkshops } from "../services/workshopApi";
import "./Home.css";
import "./Register.css";

function Register() {
  const { id } = useParams();
  const [workshops, setWorkshops] = useState([]);
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    college: "",
    phone: "",
    email: "",
    selectedWorkshopId: id || "",
    upiId: ""
  });

  const selectedWorkshop = useMemo(
    () => workshops.find((workshop) => workshop._id === form.selectedWorkshopId),
    [form.selectedWorkshopId, workshops]
  );
  const selectedPrice = Number(selectedWorkshop?.price || 0);
  const isPaid = selectedPrice > 0;
  const amountLabel = selectedWorkshop ? (isPaid ? `₹${selectedPrice}` : "FREE") : "";

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const data = await fetchWorkshops();
        if (!isMounted) return;
        
        const workshopList = data;
        setWorkshops(workshopList);

        if (id && workshopList.some((workshop) => workshop._id === id)) {
          setForm((prev) => ({ ...prev, selectedWorkshopId: id }));
        }
      } catch (err) {
        console.error("Error fetching workshops:", err);
        if (isMounted) setWorkshops([]);
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleScreenshotChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Payment screenshot must be a JPG, PNG, or WEBP image.");
      return;
    }

    setError("");
    setPaymentScreenshot(file);
    setScreenshotPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.selectedWorkshopId) {
      setError("Please select a workshop.");
      return;
    }

    if (isPaid && !form.upiId.trim()) {
      setError("UPI Transaction ID is required for paid workshops.");
      return;
    }

    if (isPaid && !paymentScreenshot) {
      setError("Payment screenshot is required for paid workshops.");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("college", form.college);
    formData.append("phone", form.phone);
    formData.append("email", form.email);
    formData.append("selectedWorkshopId", form.selectedWorkshopId);
    
    if (isPaid) {
      formData.append("utrId", form.upiId);
      formData.append("upiId", form.upiId);
      if (paymentScreenshot) {
        formData.append("paymentScreenshot", paymentScreenshot);
      }
    } else {
      formData.append("utrId", "");
      formData.append("upiId", "");
    }

    try {
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        body: formData
      });

      const data = await res.text();
      if (!res.ok) {
        setError(data || "Error submitting form");
        return;
      }

      alert(data);
    } catch (err) {
      alert("Error submitting form");
    }
  };

  return (
    <div className="register-page">
      <AppBackground />
      <Navbar />

      <div className="register-layout">
        <motion.div
          className="register-left"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="register-left-content">
            <div className="register-tag">
              <div className="register-tag-inner">
                <Zap size={14} className="register-tag-icon" />
                Join SkillNova
              </div>
            </div>

            <h1 className="register-heading">Register for Your Workshop</h1>
            <p className="register-subheading">
              Secure your seat for immersive real-world workshops led by industry experts.
            </p>

            <div className="register-features">
              <div className="register-feature-item">
                <div className="register-feature-icon"><Monitor size={20} /></div>
                <span>Live Expert Sessions</span>
              </div>
              <div className="register-feature-item">
                <div className="register-feature-icon"><Award size={20} /></div>
                <span>Verified Certificates</span>
              </div>
              <div className="register-feature-item">
                <div className="register-feature-icon"><Cpu size={20} /></div>
                <span>Hands-on Learning</span>
              </div>
              <div className="register-feature-item">
                <div className="register-feature-icon"><Users size={20} /></div>
                <span>Premium Community Access</span>
              </div>
            </div>

            <div className="register-stats">
              <div className="register-stat">
                <span className="register-stat-num">15,000+</span>
                <span className="register-stat-label">Learners</span>
              </div>
              <div className="register-stat">
                <span className="register-stat-num">300+</span>
                <span className="register-stat-label">Workshops</span>
              </div>
              <div className="register-stat">
                <span className="register-stat-num">99%</span>
                <span className="register-stat-label">Satisfaction</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="register-right">
          <motion.form
            onSubmit={handleSubmit}
            className="register-card"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="register-card-header">
              <h2 className="register-card-title">Complete Registration</h2>
              <p className="register-card-subtitle">
                {selectedWorkshop ? selectedWorkshop.title : id ? `Workshop ID: ${id}` : "Choose your workshop"}
              </p>
            </div>

            {error && <div className="register-error">{error}</div>}

            <div className="register-field-group">
              <label htmlFor="selectedWorkshopId">SELECT WORKSHOP</label>
              <select
                id="selectedWorkshopId"
                name="selectedWorkshopId"
                value={form.selectedWorkshopId}
                onChange={handleChange}
                className="register-input register-select"
                required
              >
                <option value="">Select a workshop</option>
                {workshops.map((workshop) => (
                  <option key={workshop._id} value={workshop._id}>
                    {workshop.title}
                  </option>
                ))}
              </select>
            </div>

            {isPaid && (
              <div className="register-field-group">
                <label htmlFor="amountToPay">AMOUNT TO PAY</label>
                <input
                  id="amountToPay"
                  value={amountLabel}
                  placeholder="Select a workshop"
                  className="register-input"
                  readOnly
                />
              </div>
            )}

            <div className="register-field-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                className="register-input"
              />
            </div>

            <div className="register-field-group">
              <label htmlFor="college">College</label>
              <input
                id="college"
                name="college"
                placeholder="Enter your college name"
                value={form.college}
                onChange={handleChange}
                className="register-input"
              />
            </div>

            <div className="register-field-group">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                placeholder="Enter phone number"
                value={form.phone}
                onChange={handleChange}
                className="register-input"
              />
            </div>

            <div className="register-field-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                placeholder="Enter email address"
                value={form.email}
                onChange={handleChange}
                className="register-input"
              />
            </div>

            {isPaid && (
              <>
                <div className="register-field-group">
                  <label htmlFor="upiId">UTR / TRANSACTION ID</label>
                  <input
                    id="upiId"
                    type="text"
                    name="upiId"
                    placeholder="Enter UTR or Transaction ID"
                    value={form.upiId}
                    onChange={handleChange}
                    className="register-input"
                    required={isPaid}
                  />
                </div>

                <div className="register-field-group">
                  <label htmlFor="paymentScreenshot">PAYMENT SCREENSHOT</label>
                  <label className="register-upload-box" htmlFor="paymentScreenshot">
                    <input
                      id="paymentScreenshot"
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                      className="register-upload-input"
                      onChange={handleScreenshotChange}
                      required={isPaid}
                    />
                    {screenshotPreview ? (
                      <img src={screenshotPreview} alt="Payment screenshot preview" className="register-upload-preview" />
                    ) : (
                      <span className="register-upload-text">Upload JPG, PNG, or WEBP</span>
                    )}
                  </label>
                </div>
              </>
            )}

            <button type="submit" className="register-submit">
              Complete Registration
            </button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}

export default Register;
