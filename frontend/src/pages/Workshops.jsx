import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AppBackground from "../components/AppBackground";
import Sidebar from "../components/dashboard/Sidebar";
import WorkshopHeader from "../components/dashboard/WorkshopHeader";
import WorkshopStats from "../components/dashboard/WorkshopStats";
import WorkshopFilters from "../components/dashboard/WorkshopFilters";
import WorkshopCard from "../components/dashboard/WorkshopCard";
import EmptyWorkshops from "../components/dashboard/EmptyWorkshops";
import { deleteWorkshop, fetchWorkshops } from "../services/workshopApi";
import "./Workshops.css";

const fallbackImages = [
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop"
];

function Workshops() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
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

  const total = workshops.length;
  const live = workshops.filter((_, i) => i % 3 === 0).length;
  const upcoming = workshops.filter((_, i) => i % 3 === 1).length;
  const completed = workshops.filter((_, i) => i % 3 === 2).length;

  const filteredWorkshops = workshops.filter((w) => {
    const originalIndex = workshops.indexOf(w);
    if (activeFilter === 'All') return true;
    const isLive = originalIndex % 3 === 0;
    const isUpcoming = originalIndex % 3 === 1;
    if (activeFilter === 'Live') return isLive;
    if (activeFilter === 'Upcoming') return isUpcoming;
    if (activeFilter === 'Completed') return !isLive && !isUpcoming;
    return true;
  });

  return (
    <div className="dashboard-container">
      <AppBackground />
      <Sidebar activeTab="Workshops" />

      <main className="dashboard-main">
        <WorkshopHeader />

        <WorkshopStats 
          total={total} 
          live={live} 
          upcoming={upcoming} 
          completed={completed} 
        />

        <div className="ws-management-panel">
          <WorkshopFilters activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

          {loading ? (
            <div className="ws-loading-skeleton">
              {[1, 2, 3].map(n => (
                <div key={n} className="skeleton-card">
                  <div className="skeleton-img"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-line title"></div>
                    <div className="skeleton-line desc"></div>
                    <div className="skeleton-line row"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : workshops.length === 0 ? (
            <EmptyWorkshops />
          ) : (
            <motion.div 
              className="ws-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredWorkshops.map((w) => {
                const index = workshops.indexOf(w);
                return (
                  <WorkshopCard 
                    key={w._id} 
                    workshop={w} 
                    index={index}
                    fallbackImage={fallbackImages[index % fallbackImages.length]}
                    onNavigate={navigate}
                    onDelete={handleDelete}
                  />
                );
              })}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Workshops;
