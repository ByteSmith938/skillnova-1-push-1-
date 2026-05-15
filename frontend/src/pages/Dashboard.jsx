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
import { fetchAnalytics } from "../services/analyticsService";
import "./Dashboard.css";

const fallbackImages = [
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop"
];

function Dashboard() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalWorkshops: 0,
    totalStudents: 0,
    liveSessions: 0,
    completionRate: 0,
    trendData: [],
    recentActivity: []
  });
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);

      try {
        const workshopsData = await fetchWorkshops();
        if (isMounted) setWorkshops(workshopsData);
      } catch (err) {
        console.error("Error fetching workshops:", err);
        if (isMounted) setWorkshops([]);
      }

      try {
        const analyticsData = await fetchAnalytics();
        if (isMounted) {
          setAnalytics(analyticsData);
          setAnalyticsError(false);
        }
      } catch (err) {
        console.error("Error fetching analytics:", err);
        if (isMounted) setAnalyticsError(true);
      }

      if (isMounted) setLoading(false);
    };

    loadData();

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
          {analyticsError ? (
            <>
              <StatsCard 
                label="Total Workshops" 
                value={workshops.length} 
                icon={<BookOpen size={24} style={{color: '#00D2FF'}} />} 
                delay={0}
              />
              <StatsCard 
                label="Total Students" 
                value="—" 
                icon={<Users size={24} style={{color: '#7000FF'}} />} 
                delay={0.1}
              />
              <StatsCard 
                label="Live Sessions" 
                value="—" 
                icon={<Activity size={24} style={{color: '#FF00AA'}} />} 
                delay={0.2}
              />
              <StatsCard 
                label="Completion Rate" 
                value="—" 
                icon={<Award size={24} style={{color: '#00D2FF'}} />} 
                isCircular={true}
                percentage={0}
                delay={0.3}
              />
            </>
          ) : (
            <>
              <StatsCard 
                label="Total Workshops" 
                value={analytics.totalWorkshops} 
                icon={<BookOpen size={24} style={{color: '#00D2FF'}} />} 
                delay={0}
              />
              <StatsCard 
                label="Total Students" 
                value={analytics.totalStudents.toLocaleString()} 
                icon={<Users size={24} style={{color: '#7000FF'}} />} 
                delay={0.1}
              />
              <StatsCard 
                label="Live Sessions" 
                value={analytics.liveSessions} 
                icon={<Activity size={24} style={{color: '#FF00AA'}} />} 
                delay={0.2}
              />
              <StatsCard 
                label="Completion Rate" 
                value={`${analytics.completionRate}%`} 
                icon={<Award size={24} style={{color: '#00D2FF'}} />} 
                isCircular={true}
                percentage={analytics.completionRate}
                delay={0.3}
              />
            </>
          )}
        </section>

        <section className="analytics-section">
          <AttendanceChart data={analyticsError ? [] : analytics.trendData} />
          <RecentActivity activities={analyticsError ? [] : analytics.recentActivity} />
        </section>

        <QuickActions />

        <WorkshopFilters />

        {loading ? (
          <div style={{ color: "var(--text-muted)", textAlign: "center", marginTop: "40px" }}>
            Loading workshops...
          </div>
        ) : !Array.isArray(workshops) || workshops.length === 0 ? (
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
            {(workshops || []).map((w, index) => (
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
