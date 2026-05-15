import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Monitor, Award, Cpu, Users, CheckCircle, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import AppBackground from "../components/AppBackground";
import SearchableDropdown from "../components/SearchableDropdown";
import { fetchWorkshops, registerStudent } from "../services/studentService";
import "./Home.css";
import "./Register.css";

function Register() {
  const { id: paramId } = useParams();
  const location = useLocation();
  const queryId = new URLSearchParams(location.search).get("workshop");
  const preselectedId = paramId || queryId || "";

  const [workshops, setWorkshops]               = useState([]);
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState("");
  const [loading, setLoading]                   = useState(true);
  const [submitting, setSubmitting]             = useState(false);
  const [submitResult, setSubmitResult]         = useState(null); // { ok: bool, message: string }

  const [form, setForm] = useState({
    name:               "",
    college:            "",
    phone:              "",
    email:              "",
    selectedWorkshopId: preselectedId,
    upiId:              "",
  });

  const selectedWorkshop = useMemo(
    () => workshops.find((w) => w._id === form.selectedWorkshopId),
    [form.selectedWorkshopId, workshops]
  );
  const selectedPrice = Number(selectedWorkshop?.price || 0);
  const isPaid        = selectedPrice > 0;
  const amountLabel   = selectedWorkshop ? (isPaid ? `₹${selectedPrice}` : "FREE") : "";

  // ── Load workshops ──────────────────────────────────────────────────────────
  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const list = await fetchWorkshops();
        if (!alive) return;
        setWorkshops(list);
        // Auto-select if the preselected ID exists in the list
        if (preselectedId && list.some((w) => w._id === preselectedId)) {
          setForm((prev) => ({ ...prev, selectedWorkshopId: preselectedId }));
        }
      } catch (err) {
        console.error("Error fetching workshops:", err);
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    return () => { alive = false; };
  }, [preselectedId]);

  // ── Field handlers ──────────────────────────────────────────────────────────
  const handleChange = useCallback((e) => {
    setSubmitResult(null);
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleScreenshotChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setSubmitResult({ ok: false, message: "Payment screenshot must be JPG, PNG, or WEBP." });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setSubmitResult({ ok: false, message: "Screenshot must be under 5 MB." });
      return;
    }
    setSubmitResult(null);
    setPaymentScreenshot(file);
    setScreenshotPreview(URL.createObjectURL(file));
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitResult(null);

    // Validation
    if (!form.selectedWorkshopId) {
      setSubmitResult({ ok: false, message: "Please select a workshop." });
      return;
    }
    if (!form.name.trim()) {
      setSubmitResult({ ok: false, message: "Please enter your name." });
      return;
    }
    if (!form.college.trim()) {
      setSubmitResult({ ok: false, message: "Please enter your college name." });
      return;
    }
    if (!form.phone.trim()) {
      setSubmitResult({ ok: false, message: "Please enter your phone number." });
      return;
    }
    if (!form.email.trim()) {
      setSubmitResult({ ok: false, message: "Please enter your email address." });
      return;
    }
    if (isPaid && !form.upiId.trim()) {
      setSubmitResult({ ok: false, message: "UPI Transaction ID is required for paid workshops." });
      return;
    }
    if (isPaid && !paymentScreenshot) {
      setSubmitResult({ ok: false, message: "Payment screenshot is required for paid workshops." });
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append("name",               form.name.trim());
    formData.append("college",            form.college.trim());
    formData.append("phone",              form.phone.trim());
    formData.append("email",              form.email.trim());
    formData.append("selectedWorkshopId", form.selectedWorkshopId);
    formData.append("selectedWorkshopTitle", selectedWorkshop?.title || selectedWorkshop?.name || "");
    formData.append("utrId",  isPaid ? form.upiId.trim() : "");
    formData.append("upiId",  isPaid ? form.upiId.trim() : "");
    if (isPaid && paymentScreenshot) {
      formData.append("paymentScreenshot", paymentScreenshot);
    }

    try {
      const message = await registerStudent(formData);
      setSubmitResult({ ok: true, message: message || "Registration successful!" });
      // Reset form on success
      setForm({ name: "", college: "", phone: "", email: "", selectedWorkshopId: preselectedId, upiId: "" });
      setPaymentScreenshot(null);
      setScreenshotPreview("");
    } catch (err) {
      console.error("Registration error:", err);
      setSubmitResult({
        ok: false,
        message: err.message || "Registration failed. Please check your connection and try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="register-page">
      <AppBackground />
      <Navbar />

      <div className="register-layout">
        {/* Left panel */}
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
              {[
                { icon: <Monitor size={20} />, label: "Live Expert Sessions" },
                { icon: <Award size={20} />,   label: "Verified Certificates" },
                { icon: <Cpu size={20} />,     label: "Hands-on Learning" },
                { icon: <Users size={20} />,   label: "Premium Community Access" },
              ].map(({ icon, label }) => (
                <div className="register-feature-item" key={label}>
                  <div className="register-feature-icon">{icon}</div>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            <div className="register-stats">
              {[
                { num: "15,000+", label: "Learners" },
                { num: "300+",    label: "Workshops" },
                { num: "99%",     label: "Satisfaction" },
              ].map(({ num, label }) => (
                <div className="register-stat" key={label}>
                  <span className="register-stat-num">{num}</span>
                  <span className="register-stat-label">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right panel — form */}
        <div className="register-right">
          <motion.form
            onSubmit={handleSubmit}
            className="register-card"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            noValidate
          >
            {/* Card header */}
            <div className="register-card-header">
              {selectedWorkshop?.workshopImage && (
                <div className="workshop-image-container">
                  <img
                    src={selectedWorkshop.workshopImage}
                    alt={selectedWorkshop.title || selectedWorkshop.name}
                    className="workshop-image"
                  />
                </div>
              )}
              <h2 className="register-card-title">Complete Registration</h2>
              <p className="register-card-subtitle">
                {selectedWorkshop
                  ? (selectedWorkshop.title || selectedWorkshop.name)
                  : preselectedId
                    ? `Workshop ID: ${preselectedId}`
                    : "Choose your workshop"}
              </p>
            </div>

            {/* Feedback banner */}
            <AnimatePresence mode="wait">
              {submitResult && (
                <motion.div
                  key={submitResult.ok ? "success" : "error"}
                  className={`register-feedback ${submitResult.ok ? "register-feedback--success" : "register-feedback--error"}`}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {submitResult.ok
                    ? <CheckCircle size={16} />
                    : <AlertCircle size={16} />}
                  <span>{submitResult.message}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Workshop selector */}
            <div className="register-field-group">
              <label>SELECT WORKSHOP</label>
              <SearchableDropdown
                options={workshops}
                value={form.selectedWorkshopId}
                onChange={handleChange}
                placeholder="Select a workshop"
                loading={loading}
              />
            </div>

            {/* Amount (paid only) */}
            {isPaid && (
              <div className="register-field-group">
                <label>AMOUNT TO PAY</label>
                <input
                  value={amountLabel}
                  className="register-input"
                  readOnly
                  aria-label="Amount to pay"
                />
              </div>
            )}

            {/* Personal details */}
            {[
              { id: "name",    label: "Name",    placeholder: "Enter your full name",    type: "text" },
              { id: "college", label: "College", placeholder: "Enter your college name", type: "text" },
              { id: "phone",   label: "Phone",   placeholder: "Enter phone number",      type: "tel" },
              { id: "email",   label: "Email",   placeholder: "Enter email address",     type: "email" },
            ].map(({ id, label, placeholder, type }) => (
              <div className="register-field-group" key={id}>
                <label htmlFor={`reg-${id}`}>{label}</label>
                <input
                  id={`reg-${id}`}
                  name={id}
                  type={type}
                  placeholder={placeholder}
                  value={form[id]}
                  onChange={handleChange}
                  className="register-input"
                  autoComplete={id === "email" ? "email" : id === "phone" ? "tel" : "off"}
                />
              </div>
            ))}

            {/* Payment fields (paid only) */}
            {isPaid && (
              <>
                <div className="register-field-group">
                  <label htmlFor="reg-upiId">UTR / TRANSACTION ID</label>
                  <input
                    id="reg-upiId"
                    name="upiId"
                    type="text"
                    placeholder="Enter UTR or Transaction ID"
                    value={form.upiId}
                    onChange={handleChange}
                    className="register-input"
                    autoComplete="off"
                  />
                </div>

                <div className="register-field-group">
                  <label htmlFor="reg-screenshot">PAYMENT SCREENSHOT</label>
                  <label className="register-upload-box" htmlFor="reg-screenshot">
                    <input
                      id="reg-screenshot"
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                      className="register-upload-input"
                      onChange={handleScreenshotChange}
                    />
                    {screenshotPreview ? (
                      <img
                        src={screenshotPreview}
                        alt="Payment screenshot preview"
                        className="register-upload-preview"
                      />
                    ) : (
                      <span className="register-upload-text">Upload JPG, PNG, or WEBP · max 5 MB</span>
                    )}
                  </label>
                </div>
              </>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="register-submit"
              disabled={submitting}
              aria-busy={submitting}
            >
              {submitting ? "Registering…" : "Complete Registration"}
            </button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}

export default Register;
