import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  Search, Code, Smartphone, Database, Shield, Monitor, Layout, Cpu,
  CheckCircle, ArrowRight, Quote, MessageCircle, Share2, Globe,
  Star, Clock, Zap, Terminal, Box, Activity
} from "lucide-react";
import Navbar from "../components/Navbar";
import AppBackground from "../components/AppBackground";
import SkillNovaAI from "../components/SkillNovaAI";
import { API_BASE_URL } from "../services/apiConfig";
import { fetchWorkshops } from "../services/workshopApi";
import "./Home.css";

const Counter = ({ from, to, duration = 2.5 }) => {
  const nodeRef = React.useRef(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-100px" });

  React.useEffect(() => {
    if (isInView) {
      let startTime;
      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        const currentCount = Math.floor(progress * (to - from) + from);
        if (nodeRef.current) {
          nodeRef.current.textContent = currentCount.toLocaleString() + "+";
        }
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [from, to, duration, isInView]);

  return <span ref={nodeRef}>{from}+</span>;
};

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const floatAnim = {
  animate: {
    y: [0, -15, 0],
    transition: { duration: 6, ease: "easeInOut", repeat: Infinity }
  }
};

const WORKSHOP_IMAGE_CACHE_KEY = "skillnovaWorkshopImages";

function Home() {
  const navigate = useNavigate();

  const [mousePos, setMousePos] = React.useState({ x: 50, y: 50 });
  const [workshops, setWorkshops] = React.useState([]);
  const [imageCache, setImageCache] = React.useState({});
  const heroRef = React.useRef(null);

  React.useEffect(() => {
    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  React.useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      try {
        const data = await fetchWorkshops();
        if (isMounted) setWorkshops(data);
      } catch (err) {
        console.error("Error fetching workshops:", err);
        if (isMounted) setWorkshops([]);
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, []);

  React.useEffect(() => {
    try {
      const imageCacheRaw = localStorage.getItem(WORKSHOP_IMAGE_CACHE_KEY);
      const parsed = imageCacheRaw ? JSON.parse(imageCacheRaw) : {};
      setImageCache(parsed && typeof parsed === "object" ? parsed : {});
    } catch {
      setImageCache({});
    }
  }, []);

  const fallbackImages = [
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop"
  ];
  const getImageCacheKey = (workshop) =>
    [workshop.title, workshop.date, workshop.time, workshop.instructor].join("|");

  const accentPalette = ["#00D2FF", "#7000FF", "#FF00AA"];

  return (
    <div className="home-container">
      <AppBackground />
      <Navbar />

      <div className="content-wrapper">
        {/* HERO SECTION */}
        <section 
          className="hero" 
          ref={heroRef}
          style={{
            "--mouse-x": `${mousePos.x}%`,
            "--mouse-y": `${mousePos.y}%`
          }}
        >
          <div className="hero-content">
            <motion.div
              className="hero-left"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div className="hero-tag" variants={fadeInUp}>
                <div className="tag-inner">
                  <Zap size={14} className="tag-icon" />
                  Introducing SkillNova AI 2.0
                </div>
              </motion.div>
              <motion.h1 className="hero-title" variants={fadeInUp}>
                Master the Future.<br />
                Learn with <span className="text-gradient">Real Workshops.</span>
              </motion.h1>
              <motion.p className="hero-subtitle" variants={fadeInUp}>
                The premium education platform for modern teams and students. High-performance, practical workshops designed by industry leaders.
              </motion.p>
              <motion.div className="hero-buttons" variants={fadeInUp}>
                <button className="btn btn-primary">Start Exploring <ArrowRight size={16} /></button>
                <button className="btn btn-ghost">View Curriculum</button>
              </motion.div>
            </motion.div>

            <motion.div
              className="hero-right"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="visual-area">
                <div className="floating-card-3d fc-main">
                  <div className="fc-header">
                    <div className="fc-icon-box"><Terminal size={24} /></div>
                    <div className="fc-info">
                      <h4>Production Architecture</h4>
                      <p>Live Code • Next.js 14</p>
                    </div>
                  </div>
                  <div className="fc-body">
                    <div className="code-snippet">
                      <div className="code-line"><span>const</span> api = <span>useAI</span>();</div>
                      <div className="code-line"><span>await</span> api.<span>deploy</span>();</div>
                    </div>
                  </div>
                </div>
                <div className="floating-card-3d fc-sub">
                  <div className="fc-header" style={{ marginBottom: "12px" }}>
                    <div className="fc-icon-box" style={{ width: 36, height: 36 }}><Activity size={18} /></div>
                    <div className="fc-info">
                      <h4 style={{ fontSize: "14px" }}>System Health</h4>
                    </div>
                  </div>
                  <div className="fc-body health-stats">
                    <div className="stat-row"><div className="stat-bar" style={{ width: '85%' }}></div></div>
                    <div className="stat-row"><div className="stat-bar" style={{ width: '60%' }}></div></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="features section-padding">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <div className="section-header">
              <motion.h2 className="section-title text-gradient" variants={fadeInUp}>Engineered for Mastery</motion.h2>
              <motion.p className="section-subtitle" variants={fadeInUp}>Experience a learning environment that feels like a next-generation workspace.</motion.p>
            </div>

            <motion.div className="features-grid" variants={staggerContainer}>
              {[
                { icon: <Monitor size={28} />, title: "Interactive Canvas", desc: "Code, design, and build directly within our immersive browser-based IDE." },
                { icon: <Shield size={28} />, title: "Verified Credentials", desc: "Earn cryptographic certificates that prove your skills to top-tier employers." },
                { icon: <Database size={28} />, title: "Global Network", desc: "Collaborate with a curated community of elite mentors and ambitious peers." }
              ].map((feature, i) => (
                <motion.div key={i} className="feature-card" variants={fadeInUp}>
                  <div className="f-icon">{feature.icon}</div>
                  <h3 className="f-title">{feature.title}</h3>
                  <p className="f-desc">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* TRENDING WORKSHOPS */}
        <section className="workshops section-padding">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <div className="section-header">
              <motion.h2 className="section-title text-gradient" variants={fadeInUp}>Trending Sprints</motion.h2>
              <motion.p className="section-subtitle" variants={fadeInUp}>Accelerate your career with our most demanded technical deep-dives.</motion.p>
            </div>

            <motion.div className="workshops-grid" variants={staggerContainer}>
              {workshops.map((workshop, i) => {
                const accent = accentPalette[i % accentPalette.length];
                const cachedImage = imageCache[getImageCacheKey(workshop)];
                const image =
                  workshop.workshopImage ||
                  workshop.image ||
                  workshop.img ||
                  cachedImage ||
                  fallbackImages[i % fallbackImages.length];
                const category = workshop.category || workshop.tag || "Workshop";
                return (
                <motion.div
                  key={workshop._id || getImageCacheKey(workshop) || i}
                  className="workshop-card"
                  variants={fadeInUp}
                  onClick={() => workshop._id && navigate(`/workshop/${workshop._id}`)}
                  style={{ cursor: workshop._id ? "pointer" : "default" }}
                >
                  <div className="w-thumb">
                    <img src={image} alt={workshop.title} className="w-thumb-img" />
                    <div className="w-overlay" style={{ background: `linear-gradient(to bottom, transparent, ${accent}20)` }}></div>
                    <div className="w-badge"><Star size={14} style={{ color: "#FFD700" }} /> Top Rated</div>
                  </div>
                  <div className="w-content">
                    <div className="w-tags">
                      <span className="w-tag" style={{ background: `${accent}15`, color: accent }}>{category}</span>
                    </div>
                    <h3 className="w-title">{workshop.title}</h3>
                    <div className="w-meta">
                      <span className="w-meta-item"><Layout size={16} /> {workshop.date}</span>
                      <span className="w-meta-item"><Clock size={16} /> {workshop.time}</span>
                    </div>
                    <div className="w-footer">
                      <div className="w-instructor">
                        <div className="w-avatar" style={{ border: `1px solid ${accent}40` }}>{workshop.instructor?.charAt(0) || "W"}</div>
                        <div>
                          <span>{workshop.instructor}</span>
                          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{category}</div>
                        </div>
                      </div>
                      <button
                        className="w-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (workshop._id) navigate(`/workshop/${workshop._id}`);
                        }}
                      >
                        View <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )})}
            </motion.div>
          </motion.div>
        </section>

        {/* HOW IT WORKS */}
        <section className="how-it-works section-padding">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <div className="section-header">
              <motion.h2 className="section-title text-gradient" variants={fadeInUp}>Seamless Execution</motion.h2>
              <motion.p className="section-subtitle" variants={fadeInUp}>From discovery to mastery with zero friction.</motion.p>
            </div>

            <motion.div className="timeline" variants={staggerContainer}>
              <div className="timeline-line"></div>
              {[
                { icon: <Search size={28} />, title: "Discover", desc: "Filter through high-signal technical workshops." },
                { icon: <Smartphone size={28} />, title: "Secure Seat", desc: "Instant crypto or fiat registration with QR ticketing." },
                { icon: <Code size={28} />, title: "Build", desc: "Engage in live coding and architecture reviews." },
                { icon: <CheckCircle size={28} />, title: "Certify", desc: "Mint your verifiable accomplishment on-chain." }
              ].map((step, i) => (
                <motion.div key={i} className="t-step" variants={fadeInUp}>
                  <div className="t-icon">{step.icon}</div>
                  <h3 className="t-title">{step.title}</h3>
                  <p className="t-desc">{step.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* STATS SECTION */}
        <section className="section-padding" style={{ paddingTop: 0 }}>
          <motion.div
            className="stats-container"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="stats-grid">
              <div className="s-item">
                <span className="s-num"><Counter from={0} to={15000} /></span>
                <span className="s-label">Active Learners</span>
              </div>
              <div className="s-item">
                <span className="s-num"><Counter from={0} to={300} /></span>
                <span className="s-label">Expert Workshops</span>
              </div>
              <div className="s-item">
                <span className="s-num"><Counter from={0} to={50} /></span>
                <span className="s-label">Enterprise Partners</span>
              </div>
              <div className="s-item">
                <span className="s-num"><Counter from={0} to={99} />%</span>
                <span className="s-label">Satisfaction Rate</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* TESTIMONIALS */}
        <section className="testimonials section-padding">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <div className="section-header">
              <motion.h2 className="section-title text-gradient" variants={fadeInUp}>Backed by the Best</motion.h2>
            </div>

            <motion.div className="testimonials-grid" variants={staggerContainer}>
              {[
                { name: "Alex Johnson", role: "Software Engineer @ Stripe", quote: "The architectural depth of the React masterclass was unparalleled. Exactly what mid-level engineers need to break into senior roles." },
                { name: "Priya Patel", role: "Product Designer @ Linear", quote: "SkillNova bridges the gap between design and engineering. The UI/UX sprint was flawless in execution and highly practical." },
                { name: "Marcus Williams", role: "Tech Lead @ Vercel", quote: "I recommend all my junior hires to complete the Next.js sprint here. The platform feels like a natural extension of modern tooling." }
              ].map((testimonial, i) => (
                <motion.div key={i} className="test-card" variants={fadeInUp}>
                  <Quote size={40} className="test-quote" />
                  <p className="test-text">"{testimonial.quote}"</p>
                  <div className="test-author">
                    <div className="test-avatar">{testimonial.name.charAt(0)}</div>
                    <div className="test-info">
                      <h5>{testimonial.name}</h5>
                      <span>{testimonial.role}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="f-brand-logo">
                <h2 className="text-brand">SkillNova</h2>
              </div>
              <p className="footer-desc">The leading platform for modern technical education. Master high-demand skills through immersive, industry-led workshops.</p>
              <div className="socials">
                <a href="#" className="social-icon" aria-label="Twitter"><Share2 size={18} /></a>
                <a href="#" className="social-icon" aria-label="Discord"><MessageCircle size={18} /></a>
                <a href="#" className="social-icon" aria-label="LinkedIn"><Globe size={18} /></a>
              </div>
            </div>
            
            <div className="footer-col">
              <h4>Platform</h4>
              <ul className="footer-links">
                <li><a href="#">Workshops</a></li>
                <li><a href="#">Mentorship</a></li>
                <li><a href="#">Certifications</a></li>
                <li><a href="#">Enterprise</a></li>
                <li><a href="#">Community</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Resources</h4>
              <ul className="footer-links">
                <li><a href="#">Blog</a></li>
                <li><a href="#">Learning Paths</a></li>
                <li><a href="#">AI Tracks</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Changelog</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Company</h4>
              <ul className="footer-links">
                <li><a href="#">About</a></li>
                <li><a href="#">Partners</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="f-bottom-left">
              <span>&copy; {new Date().getFullYear()} SkillNova Inc. All rights reserved.</span>
              <span className="f-separator">|</span>
              <a href="#" className="f-status">Status</a>
            </div>
            <div className="f-bottom-right">
              <span className="f-tagline">Built for the future of technical education.</span>
            </div>
          </div>
        </footer>
      </div>
      <SkillNovaAI />
    </div>
  );
}

export default Home;