import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, X, User, Mail, Phone, Trash2, Edit3, AlertCircle, ChevronLeft, Calendar, Clock, MapPin, Tag, Users, Eye } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import AdminHeader from '../components/dashboard/AdminHeader';
import './EditWorkshop.css';

const EditWorkshop = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [workshop, setWorkshop] = useState({
    title: '',
    description: '',
    category: 'TECHNICAL',
    instructor: '',
    date: '',
    time: '',
    location: '',
    price: 0,
    workshopImage: '',
    status: 'Upcoming'
  });
  
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Student Modal States
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [wsRes, studentsRes] = await Promise.all([
          fetch(`http://localhost:5000/workshops/${id}`),
          fetch(`http://localhost:5000/workshops/${id}/students`)
        ]);
        
        const wsData = await wsRes.json();
        const studentsData = await studentsRes.json();
        
        setWorkshop(wsData);
        setStudents(studentsData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const handleWorkshopChange = (e) => {
    const { name, value } = e.target;
    setWorkshop(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveWorkshop = async () => {
    const price = Number(workshop.price);
    if (!Number.isFinite(price) || price < 0) {
      alert("Workshop price must be 0 or more.");
      return;
    }

    setSaving(true);
    try {
      await fetch(`http://localhost:5000/workshops/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...workshop, price })
      });
      alert("Workshop updated successfully!");
      setSaving(false);
    } catch (err) {
      console.error("Error saving workshop:", err);
      setSaving(false);
    }
  };

  const handleUpdateStudent = async () => {
    try {
      const res = await fetch(`http://localhost:5000/student/${selectedStudent._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedStudent)
      });
      
      const updated = await res.json();
      setStudents(students.map(s => s._id === updated._id ? updated : s));
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Error updating student:", err);
    }
  };

  const handleRemoveStudent = async () => {
    try {
      await fetch(`http://localhost:5000/student/${selectedStudent._id}`, {
        method: 'DELETE'
      });
      
      setStudents(students.filter(s => s._id !== selectedStudent._id));
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error("Error removing student:", err);
    }
  };

  if (loading) return (
    <div className="dashboard-container">
      <Sidebar activeTab="Workshops" />
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)' }}>
        Loading workshop data...
      </div>
    </div>
  );

  return (
    <div className="dashboard-container edit-workshop-container">
      <Sidebar activeTab="Workshops" />
      
      <main className="edit-workshop-main">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <button className="table-icon-btn" onClick={() => navigate('/workshops')}>
            <ChevronLeft size={20} />
          </button>
          <AdminHeader 
            title="Edit Workshop" 
            subtitle={`Management panel for ${workshop.title}`}
            showSettingsActions={false}
          />
        </div>

        <div className="edit-workshop-content">
          {/* Workshop Details Section */}
          <section className="edit-workshop-card">
            <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Tag size={20} color="var(--accent-blue)" /> Workshop Information
            </h3>
            
            <div className="edit-workshop-grid">
              <div className="edit-field">
                <label>Workshop Title</label>
                <input 
                  className="edit-input" 
                  name="title" 
                  value={workshop.title} 
                  onChange={handleWorkshopChange} 
                />
              </div>
              <div className="edit-field">
                <label>Instructor Name</label>
                <input 
                  className="edit-input" 
                  name="instructor" 
                  value={workshop.instructor} 
                  onChange={handleWorkshopChange} 
                />
              </div>
              <div className="edit-field" style={{ gridColumn: 'span 2' }}>
                <label>Description</label>
                <textarea 
                  className="edit-input" 
                  name="description" 
                  rows="3" 
                  style={{ resize: 'none' }}
                  value={workshop.description} 
                  onChange={handleWorkshopChange} 
                />
              </div>
              <div className="edit-field">
                <label>Category</label>
                <select className="edit-input edit-select" name="category" value={workshop.category} onChange={handleWorkshopChange}>
                  <option value="TECHNICAL">Technical</option>
                  <option value="CREATIVE">Creative</option>
                  <option value="BUSINESS">Business</option>
                  <option value="AI">AI & ML</option>
                </select>
              </div>
              <div className="edit-field">
                <label>Status</label>
                <select className="edit-input edit-select" name="status" value={workshop.status || 'Upcoming'} onChange={handleWorkshopChange}>
                  <option value="Live">Live</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="edit-field">
                <label>Date</label>
                <div style={{ position: 'relative' }}>
                  <input className="edit-input" type="date" name="date" value={workshop.date} onChange={handleWorkshopChange} style={{ width: '100%' }} />
                </div>
              </div>
              <div className="edit-field">
                <label>Time</label>
                <input className="edit-input" type="text" name="time" value={workshop.time} onChange={handleWorkshopChange} placeholder="e.g. 10:00 AM - 1:00 PM" />
              </div>
              <div className="edit-field">
                <label>Venue / Location</label>
                <input className="edit-input" name="location" value={workshop.location} onChange={handleWorkshopChange} />
              </div>
              <div className="edit-field">
                <label>WORKSHOP PRICE (₹)</label>
                <input
                  className="edit-input"
                  type="number"
                  min="0"
                  step="1"
                  name="price"
                  value={workshop.price ?? 0}
                  onChange={handleWorkshopChange}
                  placeholder="e.g. 499"
                  required
                />
              </div>
              <div className="edit-field">
                <label>Image URL</label>
                <input className="edit-input" name="workshopImage" value={workshop.workshopImage} onChange={handleWorkshopChange} />
              </div>
            </div>

            <div className="edit-actions">
              <button className="btn btn-cancel" onClick={() => navigate('/workshops')}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSaveWorkshop} disabled={saving}>
                {saving ? 'Saving...' : <><Save size={18} /> Save Changes</>}
              </button>
            </div>
          </section>

          {/* Enrolled Students Section */}
          <section className="edit-workshop-card students-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Users size={20} color="var(--accent-purple)" /> Enrolled Students
              </h3>
              <span className="student-status status-active">{students.length} Students Total</span>
            </div>

            <div className="students-table-wrap">
              <table className="students-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Attendance %</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <tr key={student._id} className="student-row">
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--glass-hover)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '12px' }}>
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight: '600' }}>{student.name}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{student.college}</div>
                          </div>
                        </div>
                      </td>
                      <td>{student.email}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', minWidth: '60px' }}>
                            <div style={{ width: `${student.attendance || 0}%`, height: '100%', background: 'var(--accent-blue)', borderRadius: '2px' }}></div>
                          </div>
                          <span>{student.attendance || 0}%</span>
                        </div>
                      </td>
                      <td>
                        <span className={`student-status ${student.completionStatus === 'Completed' ? 'status-active' : 'status-pending'}`}>
                          {student.completionStatus || 'Pending'}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button 
                            className="table-icon-btn view" 
                            title="View Student"
                            onClick={() => {
                              setSelectedStudent(student);
                              setIsViewModalOpen(true);
                            }}
                          >
                            <Eye size={14} />
                          </button>
                          <button 
                            className="table-icon-btn edit" 
                            title="Edit Student"
                            onClick={() => {
                              setSelectedStudent(student);
                              setIsEditModalOpen(true);
                            }}
                          >
                            <Edit3 size={14} />
                          </button>
                          <button 
                            className="table-icon-btn delete" 
                            title="Remove Student"
                            onClick={() => {
                              setSelectedStudent(student);
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {students.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        No students enrolled in this workshop yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      {/* View Student Modal */}
      <AnimatePresence>
        {isViewModalOpen && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-card" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <div className="modal-header">
                <h3>Student Profile</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px' }}>
                   <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: 'var(--gradient-brand)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px', fontWeight: 'bold' }}>
                    {selectedStudent.name.charAt(0)}
                   </div>
                   <div>
                     <h4 style={{ margin: 0, fontSize: '18px' }}>{selectedStudent.name}</h4>
                     <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px' }}>{selectedStudent.college}</p>
                   </div>
                </div>
                <div className="edit-workshop-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="edit-field">
                    <label>Email</label>
                    <p style={{ margin: 0, fontSize: '14px' }}>{selectedStudent.email}</p>
                  </div>
                  <div className="edit-field">
                    <label>Phone</label>
                    <p style={{ margin: 0, fontSize: '14px' }}>{selectedStudent.phone}</p>
                  </div>
                  <div className="edit-field">
                    <label>Attendance</label>
                    <p style={{ margin: 0, fontSize: '14px', color: 'var(--accent-blue)', fontWeight: '700' }}>{selectedStudent.attendance || 0}%</p>
                  </div>
                  <div className="edit-field">
                    <label>Status</label>
                    <p style={{ margin: 0, fontSize: '14px' }}>{selectedStudent.completionStatus || 'Pending'}</p>
                  </div>
                </div>
                {selectedStudent.notes && (
                  <div className="edit-field">
                    <label>Notes</label>
                    <p style={{ margin: 0, fontSize: '14px', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>{selectedStudent.notes}</p>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={() => setIsViewModalOpen(false)}>Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Student Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal-card"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="modal-header">
                <h3>Edit Student Details</h3>
              </div>
              <div className="edit-workshop-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="edit-field" style={{ gridColumn: 'span 2' }}>
                  <label>Full Name</label>
                  <input 
                    className="edit-input" 
                    value={selectedStudent.name} 
                    onChange={(e) => setSelectedStudent({...selectedStudent, name: e.target.value})}
                  />
                </div>
                <div className="edit-field">
                  <label>Email Address</label>
                  <input 
                    className="edit-input" 
                    value={selectedStudent.email} 
                    onChange={(e) => setSelectedStudent({...selectedStudent, email: e.target.value})}
                  />
                </div>
                <div className="edit-field">
                  <label>Phone Number</label>
                  <input 
                    className="edit-input" 
                    value={selectedStudent.phone} 
                    onChange={(e) => setSelectedStudent({...selectedStudent, phone: e.target.value})}
                  />
                </div>
                <div className="edit-field">
                  <label>Attendance %</label>
                  <input 
                    className="edit-input" 
                    type="number"
                    value={selectedStudent.attendance || 0} 
                    onChange={(e) => setSelectedStudent({...selectedStudent, attendance: parseInt(e.target.value)})}
                  />
                </div>
                <div className="edit-field">
                  <label>Completion Status</label>
                  <select 
                    className="edit-input edit-select" 
                    value={selectedStudent.completionStatus || 'Pending'} 
                    onChange={(e) => setSelectedStudent({...selectedStudent, completionStatus: e.target.value})}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Dropped">Dropped</option>
                  </select>
                </div>
                <div className="edit-field" style={{ gridColumn: 'span 2' }}>
                  <label>Notes</label>
                  <textarea 
                    className="edit-input" 
                    rows="3"
                    style={{ resize: 'none' }}
                    value={selectedStudent.notes || ''} 
                    onChange={(e) => setSelectedStudent({...selectedStudent, notes: e.target.value})}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-cancel" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleUpdateStudent}>Save Changes</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal-card confirm-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="confirm-icon">
                <AlertCircle size={32} />
              </div>
              <h3>Remove Student?</h3>
              <p>Are you sure you want to remove <strong>{selectedStudent.name}</strong> from this workshop? This action cannot be undone.</p>
              <div className="modal-footer" style={{ justifyContent: 'center' }}>
                <button className="btn btn-cancel" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
                <button className="btn btn-danger" onClick={handleRemoveStudent}>Confirm Remove</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EditWorkshop;
