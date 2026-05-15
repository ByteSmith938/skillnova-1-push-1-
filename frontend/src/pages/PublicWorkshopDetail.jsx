import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, User, ArrowLeft, Zap, Star, Shield, Cpu, Users, QrCode } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import Navbar from "../components/Navbar";
import AppBackground from "../components/AppBackground";
import { API_BASE_URL, FRONTEND_URL } from "../services/apiConfig";
import { fetchWorkshopById } from "../services/workshopApi";
import "./Home.css";
import "./WorkshopDetail.css";

function PublicWorkshopDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const registerUrl = `${FRONTEND_URL}/register?workshop=${id}`;

  useEffect(() => {
    const loadWorkshop = async () => {
      try {
        const data = await fetchWorkshopById(id);
        setWorkshop(data);
      } catch (err) {
        console.error("Error fetching public workshop:", err);
        setError(err.message || "Failed to load workshop details.");
      } finally {
        setLoading(false);
      }
    };

    loadWorkshop();
  }, [id]);

  if (loading) {
    return (
      <div className="workshop-detail-page">
        <AppBackground />
        <Navbar />
        <div className="workshop-detail-content">
          <div className="workshop-loading-shell">
            <p className="workshop-loading-text">Loading workshop details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !workshop) {
    return (
      <div className="workshop-detail-page">
        <AppBackground />
        <Navbar />
        <div className="workshop-detail-content">
          <div className="workshop-error-shell">
            <p className="workshop-error-text">{error || "Workshop not found."}</p>
            <button className="btn btn-ghost" onClick={() => navigate("/")}>
              <ArrowLeft size={16} /> Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isClosed = workshop.status === "Closed" || workshop.status === "Full";

  return (
    <div className="workshop-detail-page">
      <AppBackground />
      <Navbar />

      <div className="workshop-detail-content">
        <motion.div 
          className="workshop-back-nav"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link to="/" className="back-link">
            <ArrowLeft size={16} /> Back to Exploration
          </Link>
        </motion.div>

        <section className="workshop-hero-section">
          <div className="workshop-hero-grid">
            <motion.div 
              className="workshop-hero-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="workshop-tag-badge">
                <Zap size={14} /> Technical Masterclass
              </div>
              <h1 className="workshop-display-title">{workshop.title}</h1>
              <p className="workshop-instructor-lead">Led by <span>{workshop.instructor}</span></p>
              
              <div className="workshop-quick-meta">
                <div className="meta-pill"><Calendar size={16} /> {workshop.date}</div>
                <div className="meta-pill"><Clock size={16} /> {workshop.time}</div>
                <div className="meta-pill"><MapPin size={16} /> {workshop.venue}</div>
              </div>

              <div className="workshop-action-bar">
                <div className="price-tag">
                  <span className="price-label">Registration Fee</span>
                  <span className="price-value">{workshop.price > 0 ? `₹${workshop.price}` : "FREE"}</span>
                </div>
                <button 
                  className={`btn-register-main ${isClosed ? 'disabled' : ''}`}
                  onClick={() => !isClosed && navigate(`/register/${id}`)}
                  disabled={isClosed}
                >
                  {isClosed ? workshop.status : "Secure Your Seat Now"}
                </button>
              </div>
            </motion.div>

            <motion.div 
              className="workshop-hero-visual"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="visual-card">
                <img 
                  src={workshop.coverImage || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop"} 
                  alt={workshop.title} 
                />
                <div className="visual-overlay"></div>
                <div className="capacity-indicator">
                  <Users size={16} />
                  <span>{workshop.seatsLeft !== null ? `${workshop.seatsLeft} Seats Left` : "Limited Seats"}</span>
                </div>
              </div>

              <div className="workshop-qr-card public-qr">
                <div className="qr-header">
                  <QrCode size={18} />
                  <span>Scan to Register</span>
                </div>
                <div className="workshop-qr-inner">
                  <QRCodeCanvas 
                    value={registerUrl} 
                    size={160}
                    level="H"
                    includeMargin={true}
                    style={{ borderRadius: '8px' }}
                  />
                </div>
                <p className="qr-hint">Quick registration via mobile device</p>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="workshop-body-section">
          <div className="workshop-body-grid">
            <div className="workshop-main-info">
              <div className="info-card">
                <h3>About this Workshop</h3>
                <p>{workshop.description}</p>
                
                <div className="learning-outcomes">
                  <h4>What you'll master:</h4>
                  <ul>
                    <li><Shield size={16} /> Industry-standard best practices</li>
                    <li><Cpu size={16} /> High-performance architecture</li>
                    <li><Star size={16} /> Real-world project implementation</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="workshop-sidebar-info">
              <div className="perks-card">
                <h4>What's Included</h4>
                <div className="perk-item">
                  <div className="perk-icon">📜</div>
                  <div className="perk-text">
                    <strong>Verified Certificate</strong>
                    <span>Prove your expertise with a digital credential.</span>
                  </div>
                </div>
                <div className="perk-item">
                  <div className="perk-icon">📁</div>
                  <div className="perk-text">
                    <strong>Resource Bundle</strong>
                    <span>Get exclusive access to code, assets, and slides.</span>
                  </div>
                </div>
                <div className="perk-item">
                  <div className="perk-icon">🤝</div>
                  <div className="perk-text">
                    <strong>Alumni Network</strong>
                    <span>Connect with industry pros and fellow learners.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default PublicWorkshopDetail;
