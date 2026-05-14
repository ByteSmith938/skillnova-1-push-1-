import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  ShieldCheck,
  Users,
  Calendar,
  BarChart3,
  Activity
} from "lucide-react";
import Navbar from "../components/Navbar";
import AppBackground from "../components/AppBackground";
import { useAuth } from "../components/auth/AuthContext";
import "../pages/Home.css";
import "./Login.css";

/* ── animation variants ── */
const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }
  })
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

const floatAnim = (dur = 7) => ({
  y: [0, -12, 0],
  transition: { duration: dur, ease: "easeInOut", repeat: Infinity }
});

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });

  const errors = {
    email: touched.email && !form.email
      ? "Username or Email is required"
      : "",
    password: touched.password && !form.password
      ? "Password is required"
      : ""
  };

  const canSubmit = form.email && form.password;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!canSubmit) return;

    setLoading(true);
    setLoginError("");
    // simulate network call
    await new Promise((r) => setTimeout(r, 800));
    
    const result = await login(form.email, form.password);
    setLoading(false);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setLoginError(result.message);
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  /* ── render ── */
  return (
    <div className="login-page">
      <AppBackground />
      <Navbar />

      <div className="login-layout">
        {/* ──────── LEFT PANEL ──────── */}
        <motion.div
          className="login-left"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <div className="login-left-content">
            <motion.div className="login-welcome-tag" variants={fadeInUp} custom={0}>
              <div className="login-welcome-tag-inner">
                <Shield
                  size={14}
                  style={{ color: "var(--accent-blue)", filter: "drop-shadow(0 0 5px var(--accent-blue))" }}
                />
                Restricted Access
              </div>
            </motion.div>

            <motion.h1 className="login-heading" variants={fadeInUp} custom={1}>
              <span className="text-gradient">Admin Control Center</span>
            </motion.h1>

            <motion.p className="login-subheading" variants={fadeInUp} custom={2}>
              Secure access for SkillNova administrators, workshop coordinators, and
              internal staff.
            </motion.p>

            <motion.div className="login-features" variants={stagger}>
              {[
                { icon: <Shield size={20} />, text: "Workshop Management" },
                { icon: <Users size={20} />, text: "Staff Access Control" },
                { icon: <Calendar size={20} />, text: "Session Scheduling" },
                { icon: <BarChart3 size={20} />, text: "Registration Analytics" }
              ].map((f, i) => (
                <motion.div key={f.text} className="login-feature-item" variants={fadeInUp} custom={3 + i}>
                  <div className="login-feature-icon">{f.icon}</div>
                  <span className="login-feature-text">{f.text}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div className="login-stats" variants={fadeInUp} custom={7}>
              <div className="login-stat">
                <span className="login-stat-num">124</span>
                <span className="login-stat-label">Active Workshops</span>
              </div>
              <div className="login-stat">
                <span className="login-stat-num">18</span>
                <span className="login-stat-label">Admin Staff</span>
              </div>
              <div className="login-stat">
                <span className="login-stat-num">2,840</span>
                <span className="login-stat-label">Registrations</span>
              </div>
            </motion.div>
          </div>

          {/* Floating decorative card */}
          <div className="login-floating-cards">
            <motion.div className="login-float-card login-float-card-2" animate={floatAnim(9)}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div className="lfc-icon">
                  <Activity size={14} />
                </div>
                <div className="lfc-text">Live Operations</div>
              </div>
              <div className="lfc-bar-track">
                <div className="lfc-bar-fill" style={{ width: "78%" }}></div>
              </div>
              <div className="lfc-bar-track">
                <div className="lfc-bar-fill" style={{ width: "54%" }}></div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ──────── RIGHT PANEL ──────── */}
        <div className="login-right">
          <div className="login-personnel-chip" role="note">
            AUTHORIZED PERSONNEL ONLY
          </div>

          <motion.div
            className="login-card"
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="login-card-header">
              <div className="login-card-title-row">
                <span className="login-card-title-icon-wrap" aria-hidden>
                  <ShieldCheck size={26} strokeWidth={1.75} />
                </span>
                <h2 className="login-card-title">Administrator Login</h2>
              </div>
              <p className="login-card-staff-warning">
                Only authorized SkillNova staff members can access this portal.
              </p>
              <p className="login-card-subtitle">
                Sign in to the SkillNova management dashboard
              </p>
            </div>

            {loginError && (
              <div style={{
                backgroundColor: "rgba(255, 80, 80, 0.1)",
                border: "1px solid rgba(255, 80, 80, 0.3)",
                color: "#ff5050",
                padding: "10px 14px",
                borderRadius: "8px",
                fontSize: "13px",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <Shield size={16} />
                {loginError}
              </div>
            )}

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div className={`login-input-group ${errors.email ? "has-error" : ""}`}>
                <Mail size={18} className="login-input-icon" />
                <input
                  id="login-email"
                  type="email"
                  className={`login-input ${errors.email ? "input-error" : ""}`}
                  placeholder="Admin email or username"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  onBlur={() => handleBlur("email")}
                  autoComplete="email"
                />
                {errors.email && <div className="login-field-error">{errors.email}</div>}
              </div>

              {/* Password */}
              <div className={`login-input-group ${errors.password ? "has-error" : ""}`}>
                <Lock size={18} className="login-input-icon" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  className={`login-input login-input-password ${errors.password ? "input-error" : ""}`}
                  placeholder="Enter secure password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  onBlur={() => handleBlur("password")}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-eye-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {errors.password && <div className="login-field-error">{errors.password}</div>}
              </div>

              {/* Submit */}
              <button type="submit" className="login-submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="login-spinner"></span>
                    Verifying access…
                  </>
                ) : (
                  <>
                    Access Secure Dashboard <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <p className="login-form-monitored">Unauthorized access is monitored</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Login;
