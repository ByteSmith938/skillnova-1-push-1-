import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isRegisterPage = location.pathname.startsWith("/register");
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = ["Explore", "Catalog", "Mentorship", "Enterprise"];

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-brand">
        <h1 className="nav-logo text-brand" onClick={() => navigate("/")}>
          SkillNova
        </h1>
      </div>
      <div className="nav-links">
        {navLinks.map((link) => (
          <a key={link} className="nav-link">
            {link}
          </a>
        ))}
      </div>
      <div className="nav-right">
        {!isRegisterPage && (
          <button className="btn btn-ghost" onClick={() => navigate("/login")}>
            Login
          </button>
        )}
        <button className="btn btn-primary" onClick={() => navigate("/register")}>
          Register
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
