import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import Navbar from "../components/Navbar";
import AppBackground from "../components/AppBackground";
import { API_BASE_URL, getPublicFrontendOrigin, getAuthToken } from "../services/apiConfig";
import { fetchAdminWorkshop, updatePaymentStatus } from "../services/workshopApi";
import "./Home.css";
import "./WorkshopDetail.css";

function WorkshopDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [workshop, setWorkshop] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Verification states
  const [confirmModal, setConfirmModal] = useState({ show: false, student: null, status: "" });
  const [toast, setToast] = useState({ show: false, message: "" });
  const [updatingId, setUpdatingId] = useState(null);

  const token = getAuthToken();

  // QR URL
  const registerUrl = `${getPublicFrontendOrigin()}/register/${id}`;

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAdminWorkshop(id);
        setWorkshop(data.workshopDetails);
        setStudents(data.registeredStudents || []);
      } catch (err) {
        console.error("Error fetching admin workshop details:", err);
        setError("Failed to load workshop data. You may not have permission.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  const handleStatusUpdate = async (studentId, status) => {
    const token = getAuthToken();
    console.log("DEBUG: handleStatusUpdate called", { studentId, status, hasToken: !!token });
    
    if (!token) {
      console.error("CRITICAL: Auth token missing. Update will fail.");
      alert("Authentication error: Please log out and log in again.");
      return;
    }

    setUpdatingId(studentId);
    try {
      console.log(`DEBUG: Sending PATCH to /admin/student/${studentId}/payment-status with status: ${status}`);
      const responseData = await updatePaymentStatus(studentId, status);
      console.log("DEBUG: Status update response data:", responseData);
      
      // Update local state with fresh data from server
      setStudents(prev => {
        const next = prev.map(s => 
          s._id === studentId ? responseData : s
        );
        console.log(`DEBUG: State updated for student ${studentId}`);
        return next;
      });
      
      showToast(`Payment ${status === "completed" ? "Approved" : "Rejected"} successfully!`);
    } catch (err) {
      console.error("CRITICAL: Failed to update status:", err);
      alert(`Error updating payment status: ${err.message}`);
    } finally {
      setUpdatingId(null);
      setConfirmModal({ show: false, student: null, status: "" });
    }
  };

  const triggerConfirm = (e, student, status) => {
    e.stopPropagation();
    setConfirmModal({ show: true, student, status });
  };

  if (loading) {
    return (
      <div className="workshop-detail-page">
        <AppBackground />
        <Navbar />
        <div className="workshop-detail-content">
          <div className="workshop-loading-shell">
            <p className="workshop-loading-text">Loading admin workshop details...</p>
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="workshop-detail-page">
      <AppBackground />
      <Navbar />

      <div className="workshop-detail-content">
        <section className="workshop-overview-shell">
          <div className="workshop-details-card">
            <p className="workshop-kicker">Internal Admin View</p>
            <h1 className="workshop-title">{workshop.title}</h1>

            <div className="workshop-meta-grid">
              <div className="workshop-meta-item">
                <p className="workshop-meta-label">Date</p>
                <p className="workshop-meta-value">{workshop.date}</p>
              </div>
              <div className="workshop-meta-item">
                <p className="workshop-meta-label">Time</p>
                <p className="workshop-meta-value">{workshop.time}</p>
              </div>
              <div className="workshop-meta-item">
                <p className="workshop-meta-label">Location</p>
                <p className="workshop-meta-value">{workshop.location}</p>
              </div>
              <div className="workshop-meta-item">
                <p className="workshop-meta-label">Instructor</p>
                <p className="workshop-meta-value">{workshop.instructor}</p>
              </div>
              <div className="workshop-meta-item">
                <p className="workshop-meta-label">Price (INR)</p>
                <p className="workshop-meta-value">₹{workshop.price}</p>
              </div>
            </div>

            <div className="workshop-description-card">
              <p className="workshop-description-label">Description</p>
              <p className="workshop-description-text">{workshop.description}</p>
            </div>
          </div>
          <div className="workshop-qr-card">
            <div className="workshop-qr-inner">
              <QRCodeCanvas value={registerUrl} size={160} />
            </div>
            <p className="workshop-qr-title">Quick registration via mobile device</p>
          </div>
        </section>

        <section className="workshop-students-shell">
          <div className="workshop-students-header">
            <h3 className="workshop-students-title">Enrolled Students</h3>
            <span className="workshop-students-badge">{students.length} Total</span>
          </div>

          {students.length === 0 ? (
            <div className="workshop-empty-state">No students registered yet</div>
          ) : (
            <div className="workshop-table-shell">
              <table className="workshop-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Student Info</th>
                    <th>Contact</th>
                    <th>Payment Status</th>
                    <th>UTR / Trans ID</th>
                    <th>Screenshot</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, index) => (
                    <tr
                      key={s._id}
                      onClick={() => navigate(`/edit-student/${s._id}`)}
                    >
                      <td>{index + 1}</td>
                      <td className="workshop-name-cell">
                        <div className="student-name">{s.name}</div>
                        <div className="student-college">{s.college}</div>
                      </td>
                      <td>
                        <div className="student-phone">{s.phone}</div>
                        <div className="student-email">{s.email}</div>
                      </td>
                      <td>
                        <span className={`payment-status-tag ${s.paymentStatus}`}>
                          {s.paymentStatus === "completed" 
                            ? "Approved" 
                            : s.paymentStatus === "rejected"
                            ? "Rejected"
                            : s.paymentStatus?.toUpperCase()}
                        </span>
                      </td>
                      <td className="workshop-upi-cell">{s.utrId || s.upiId || "N/A"}</td>
                      <td>
                        {s.paymentScreenshot ? (
                          (() => {
                            const filename = s.paymentScreenshot.split("/").pop();
                            const screenshotUrl = `${API_BASE_URL}/admin/payment-screenshot/${filename}?token=${token}`;
                            return (
                              <a
                                href={screenshotUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="view-screenshot-link"
                              >
                                View
                              </a>
                            );
                          })()
                        ) : (
                          <span className="no-screenshot">No Screenshot</span>
                        )}
                      </td>
                      <td className="workshop-actions-cell" onClick={(e) => e.stopPropagation()}>
                        <div className="verification-actions">
                          {s.paymentStatus === "pending" ? (
                            <>
                              <button 
                                className="btn-approve" 
                                onClick={(e) => triggerConfirm(e, s, "completed")}
                                disabled={updatingId === s._id}
                              >
                                {updatingId === s._id ? "..." : "Approve Payment"}
                              </button>
                              <button 
                                className="btn-reject" 
                                onClick={(e) => triggerConfirm(e, s, "rejected")}
                                disabled={updatingId === s._id}
                              >
                                Reject
                              </button>
                            </>
                          ) : s.paymentStatus === "completed" ? (
                            <span className="payment-status-tag completed">Approved</span>
                          ) : s.paymentStatus === "rejected" ? (
                            <span className="payment-status-tag rejected">Rejected</span>
                          ) : (
                            <span className="no-actions">-</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* Confirmation Modal */}
      {confirmModal.show && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <h2 className="modal-title">
              {confirmModal.status === "completed" ? "Approve Payment" : "Reject Payment"}
            </h2>
            <p className="modal-message">
              {confirmModal.status === "completed" 
                ? `Are you sure you want to mark the payment for ${confirmModal.student?.name} as completed?`
                : `Are you sure you want to reject the payment for ${confirmModal.student?.name}?`
              }
            </p>
            <div className="modal-actions">
              <button 
                className="btn-modal-cancel" 
                onClick={() => setConfirmModal({ show: false, student: null, status: "" })}
              >
                Cancel
              </button>
              <button 
                className={`btn-modal-confirm ${confirmModal.status === "completed" ? "approve" : "reject"}`}
                onClick={() => handleStatusUpdate(confirmModal.student?._id, confirmModal.status)}
              >
                Confirm {confirmModal.status === "completed" ? "Approval" : "Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {toast.show && (
        <div className="success-toast">
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default WorkshopDetail;
