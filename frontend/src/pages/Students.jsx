import { useEffect, useState } from "react";
import { API_BASE_URL, getAuthHeaders } from "../services/apiConfig";
import { motion } from "framer-motion";
import { Users, UserCheck, Award, Activity } from "lucide-react";
import AppBackground from "../components/AppBackground";
import Sidebar from "../components/dashboard/Sidebar";
import AdminHeader from "../components/dashboard/AdminHeader";
import StudentFilters from "../components/dashboard/StudentFilters";
import StudentTable from "../components/dashboard/StudentTable";
import EmptyStudents from "../components/dashboard/EmptyStudents";
import StatsCard from "../components/dashboard/StatsCard";
import "./Students.css";

function Students() {
  const [students, setStudents] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const [studentsRes, workshopsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/students`, { headers: getAuthHeaders(), cache: "no-store" }),
          fetch(`${API_BASE_URL}/workshops`, { cache: "no-store" })
        ]);

        if (!studentsRes.ok) throw new Error("Failed to fetch students");
        if (!workshopsRes.ok) throw new Error("Failed to fetch workshops");

        const studentsData = await studentsRes.json();
        const workshopsData = await workshopsRes.json();

        // Handle wrapped workshop response if present
        const wsList = workshopsData && typeof workshopsData === 'object' && Array.isArray(workshopsData.workshops)
          ? workshopsData.workshops
          : Array.isArray(workshopsData) ? workshopsData : [];

        if (isMounted) {
          setStudents(Array.isArray(studentsData) ? studentsData : []);
          setWorkshops(wsList);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        if (isMounted) {
          setStudents([]);
          setWorkshops([]);
          setLoading(false);
        }
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this student?")) {
      setStudents(students.filter(s => s._id !== id));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const total = students.length;
  const active = Math.floor(total * 0.85) || 0; 

  const filteredStudents = Array.isArray(students) ? students.filter(s => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Active') return true; 
    if (activeFilter === 'In Workshop') return s.workshopId;
    if (activeFilter === 'Completed') return false; 
    if (activeFilter === 'Inactive') return false; 
    return true;
  }) : [];

  return (
    <div className="dashboard-container">
      <AppBackground />
      <Sidebar activeTab="Students" />

      <main className="dashboard-main">
        <AdminHeader 
          title="Student Management"
          subtitle="Manage learners, attendance, registrations and workshop participation"
          searchPlaceholder="Search students..."
          btnText="Add Student"
        />

        <section className="stats-grid-new">
          <StatsCard 
            label="Total Students" 
            value={total} 
            icon={<Users size={24} style={{color: '#00D2FF'}} />} 
            trendText="↑ +42 this month"
            delay={0}
          />
          <StatsCard 
            label="Active Learners" 
            value={active} 
            icon={<UserCheck size={24} style={{color: '#10b981'}} />} 
            trendText="🟢 12 online now"
            delay={0.1}
          />
          <StatsCard 
            label="Completed Courses" 
            value={Math.floor(total * 0.4) || 0} 
            icon={<Award size={24} style={{color: '#FF00AA'}} />} 
            trendText="Certificates Earned"
            delay={0.2}
          />
          <StatsCard 
            label="Attendance Rate" 
            value="89%" 
            icon={<Activity size={24} style={{color: '#7000FF'}} />} 
            trendText="↑ +5% this week"
            isCircular={true}
            percentage={89}
            delay={0.3}
          />
        </section>

        <div className="ws-management-panel">
          <StudentFilters activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

          {loading ? (
            <div className="st-loading-skeleton">
              {[1, 2, 3, 4, 5].map(n => (
                <div key={n} className="st-skeleton-row"></div>
              ))}
            </div>
          ) : students.length === 0 ? (
            <EmptyStudents />
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <StudentTable 
                students={filteredStudents} 
                workshops={workshops} 
                onDelete={handleDelete}
              />
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Students;
