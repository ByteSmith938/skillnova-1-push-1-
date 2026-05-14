import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Users, Activity, Award } from "lucide-react";
import RoleGuard from "../components/auth/RoleGuard";
import AppBackground from "../components/AppBackground";
import Sidebar from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsCard from "../components/dashboard/StatsCard";
import AttendanceChart from "../components/dashboard/AttendanceChart";
import RecentActivity from "../components/dashboard/RecentActivity";
import QuickActions from "../components/dashboard/QuickActions";
import WorkshopFilters from "../components/dashboard/WorkshopFilters";
import WorkshopCard from "../components/dashboard/WorkshopCard";
import { deleteWorkshop, fetchWorkshops } from "../services/workshopApi";
import "./Dashboard.css";

const fallbackImages = [
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop"
];

function Dashboard() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const loadWorkshops = async () => {
      setLoading(true);

      try {
        const data = await fetchWorkshops();
        if (!isMounted) return;
        setWorkshops(data);
      } catch (err) {
        console.error("Error fetching workshops:", err);
        if (isMounted) {
          setWorkshops([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadWorkshops();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this workshop?")) {
      try {
        await deleteWorkshop(id);
        setWorkshops(workshops.filter(x => x._id !== id));
      } catch (err) {
        console.error("Error deleting workshop:", err);
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="dashboard-container">
      <AppBackground />
      <Sidebar activeTab="Dashboard" />

      <main className="dashboard-main">
        <DashboardHeader />

        <section className="stats-grid-new">
          <StatsCard 
            label="Total Workshops" 
            value={workshops.length} 
            icon={<BookOpen size={24} style={{color: '#00D2FF'}} />} 
            trendText="↑ +3 this week"
            delay={0}
          />
          <StatsCard 
            label="Total Students" 
            value="1,284" 
            icon={<Users size={24} style={{color: '#7000FF'}} />} 
            trendText="↑ +42 today"
            delay={0.1}
          />
          <StatsCard 
            label="Live Sessions" 
            value="12" 
            icon={<Activity size={24} style={{color: '#FF00AA'}} />} 
            trendText="🟢 3 starting soon"
            delay={0.2}
          />
          <StatsCard 
            label="Completion Rate" 
            value="94%" 
            icon={<Award size={24} style={{color: '#00D2FF'}} />} 
            trendText="↑ +2% this month"
            isCircular={true}
            percentage={94}
            delay={0.3}
          />
        </section>

        <section className="analytics-section">
          <AttendanceChart />
          <RecentActivity />
        </section>

        <QuickActions />

        <WorkshopFilters />

        {loading ? (
          <div style={{ color: "var(--text-muted)", textAlign: "center", marginTop: "40px" }}>
            Loading workshops...
          </div>
        ) : workshops.length === 0 ? (
          <motion.div 
            className="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3>No workshops yet</h3>
            <p>Ready to teach? Create your first immersive technical workshop.</p>
            <RoleGuard allowedRoles={['admin']}>
              <button 
                className="btn btn-ghost" 
                onClick={() => navigate("/create-workshop")}
              >
                Start Creating
              </button>
            </RoleGuard>
          </motion.div>
        ) : (
          <motion.div 
            className="dashboard-workshops-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {workshops.map((w, index) => (
              <WorkshopCard 
                key={w._id} 
                workshop={w} 
                index={index}
                fallbackImage={fallbackImages[index % fallbackImages.length]}
                onNavigate={navigate}
                onDelete={handleDelete}
              />
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
