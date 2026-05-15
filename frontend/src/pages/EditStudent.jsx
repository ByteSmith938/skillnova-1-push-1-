import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  CreditCard, 
  ArrowLeft, 
  Trash2, 
  Save, 
  ExternalLink,
  Phone,
  Mail,
  School,
  Hash,
  CheckCircle2,
  AlertCircle,
  X,
  Activity
} from "lucide-react";
import { API_BASE_URL, getAuthHeaders, getAuthToken } from "../services/apiConfig";
import { useAuth } from "../components/auth/AuthContext";
import Sidebar from "../components/dashboard/Sidebar";
import AppBackground from "../components/AppBackground";
import "./EditStudent.css";

function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: "",
    college: "",
    phone: "",
    email: "",
    upiId: "",
    utrId: "",
    workshopId: "",
    paymentStatus: "",
    paymentScreenshot: ""
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  console.log("DEBUG: EditStudent rendering", { id, loading, hasUser: !!user, role: user?.role });

  // Role check: Only admin can edit
  useEffect(() => {
    if (!loading && user) {
      console.log("DEBUG: Role check", user.role);
      if (user.role !== 'admin') {
        console.warn("DEBUG: Non-admin access, redirecting...");
        navigate("/dashboard");
      }
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        console.log(`DEBUG: Fetching student ${id}`);
        const res = await fetch(`${API_BASE_URL}/student/${id}`, {
          headers: getAuthHeaders()
        });
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            console.error("DEBUG: Auth error fetching student", res.status);
            navigate("/dashboard");
            return;
          }
          throw new Error("Student not found");
        }
        const data = await res.json();
        console.log("DEBUG: Student data loaded", data);
        setForm(data);
      } catch (err) {
        console.error("DEBUG: Fetch error", err);
        showToast("Error fetching student details", "error");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchStudent();
  }, [id, navigate]);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 4000);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    console.log("DEBUG: Saving student changes", form);

    try {
      const res = await fetch(`${API_BASE_URL}/student/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error("Failed to update");

      showToast("Student profile updated successfully!");
      
      setTimeout(() => {
        const workshopId = form.workshopId || form.selectedWorkshopId;
        if (workshopId) {
          navigate(`/dashboard/workshop/${workshopId}`);
        } else {
          navigate("/dashboard");
        }
      }, 1500);
    } catch (err) {
      console.error("DEBUG: Save error", err);
      showToast("Error updating student records", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    console.log("DEBUG: Deleting student", id);
    try {
      const res = await fetch(`${API_BASE_URL}/student/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });

      if (!res.ok) throw new Error("Failed to delete student");

      showToast("Student removed successfully", "success");
      setTimeout(() => navigate(-1), 1200);
    } catch (err) {
      console.error("DEBUG: Delete error", err);
      showToast("Error deleting student profile", "error");
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-student-page">
        <AppBackground />
        <Sidebar activeTab="Students" />
        <main className="edit-student-main">
          <div className="loading-container">
            <div className="spinner"></div>
            <p style={{ color: "var(--accent-blue)", fontWeight: "bold" }}>Retrieving student profile...</p>
            <p style={{ color: "var(--text-muted)", fontSize: "12px" }}>ID: {id}</p>
          </div>
        </main>
      </div>
    );
  }

  // Double check admin role before rendering
  if (user && user.role !== 'admin') {
    return null;
  }

  if (!user && !loading) {
    navigate("/login");
    return null;
  }

  const screenshotUrl = form.paymentScreenshot 
    ? `${API_BASE_URL}/admin/payment-screenshot/${form.paymentScreenshot.split("/").pop()}?token=${getAuthToken()}`
    : null;

  return (
    <div className="edit-student-page">
      <AppBackground />
      <Sidebar activeTab="Students" />
      
      <main className="edit-student-main">
        <header className="edit-student-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
            <button className="dh-icon-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1>Student Details</h1>
              <p>View and manage registered student information</p>
            </div>
          </div>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="edit-student-grid">
            {/* PERSONAL DETAILS */}
            <section className="edit-section-card">
              <div className="section-header">
                <div className="section-icon"><User size={20} /></div>
                <h3>Personal Details</h3>
              </div>
              
              <div className="form-group-grid">
                <div className="form-group">
                  <label><User size={12} style={{marginRight: '6px'}} /> Full Name</label>
                  <input 
                    name="name" 
                    className="form-input" 
                    value={form.name} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label><School size={12} style={{marginRight: '6px'}} /> College / University</label>
                  <input 
                    name="college" 
                    className="form-input" 
                    value={form.college} 
                    onChange={handleChange} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label><Phone size={12} style={{marginRight: '6px'}} /> Phone Number</label>
                  <input 
                    name="phone" 
                    className="form-input" 
                    value={form.phone} 
                    onChange={handleChange} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label><Mail size={12} style={{marginRight: '6px'}} /> Email Address</label>
                  <input 
                    name="email" 
                    type="email"
                    className="form-input" 
                    value={form.email} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>
            </section>

            {/* PAYMENT DETAILS */}
            <section className="edit-section-card">
              <div className="section-header">
                <div className="section-icon"><CreditCard size={20} /></div>
                <h3>Payment Details</h3>
              </div>

              <div className="form-group-grid">
                <div className="form-group">
                  <label><Hash size={12} style={{marginRight: '6px'}} /> UTR / Transaction ID</label>
                  <input 
                    name="utrId" 
                    className="form-input" 
                    value={form.utrId || form.upiId || ""} 
                    onChange={handleChange} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label><Activity size={12} style={{marginRight: '6px'}} /> Payment Status</label>
                  <select 
                    name="paymentStatus" 
                    className="form-select" 
                    value={form.paymentStatus} 
                    onChange={handleChange}
                  >
                    <option value="pending">Pending Verification</option>
                    <option value="completed">Completed / Approved</option>
                    <option value="rejected">Rejected / Invalid</option>
                    <option value="free">Free / Exempted</option>
                  </select>
                </div>

                <div className="form-group" style={{marginTop: '12px'}}>
                  <label>Payment Proof</label>
                  {screenshotUrl ? (
                    <a 
                      href={screenshotUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="proof-button"
                    >
                      <ExternalLink size={18} /> View Payment Proof
                    </a>
                  ) : (
                    <div className="proof-button" style={{opacity: 0.5, cursor: 'not-allowed'}}>
                      No screenshot uploaded
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>

          <div className="edit-actions-bar">
            <button 
              type="button" 
              className="btn btn-delete"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 size={18} /> Delete Student
            </button>
            
            <button 
              type="button" 
              className="btn btn-cancel"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? (
                <>Saving Changes...</>
              ) : (
                <>
                  <Save size={18} /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </main>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="custom-modal-overlay">
            <motion.div 
              className="custom-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h2 className="modal-title" style={{ color: '#ef4444' }}>Delete Student Profile?</h2>
              <p className="modal-message">
                Are you sure you want to permanently delete <strong>{form.name}</strong>? This action cannot be undone.
              </p>
              <div className="modal-actions">
                <button className="btn-modal-cancel" onClick={() => setShowDeleteModal(false)}>
                  Go Back
                </button>
                <button className="btn-modal-confirm reject" onClick={handleDelete}>
                  Yes, Delete Forever
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div 
            className={`success-toast ${toast.type === 'error' ? 'rejected' : ''}`}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              background: toast.type === 'error' ? 'rgba(239, 68, 68, 0.95)' : 'rgba(16, 185, 129, 0.95)'
            }}
          >
            {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default EditStudent;
