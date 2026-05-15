import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Workshops from "./pages/Workshops";
import Students from "./pages/Students";
import Analytics from "./pages/Analytics";
import CreateWorkshop from "./pages/CreateWorkshop";
import WorkshopDetail from "./pages/WorkshopDetail";
import PublicWorkshopDetail from "./pages/PublicWorkshopDetail";
import EditStudent from "./pages/EditStudent";
import Settings from "./pages/Settings";
import TeamChat from "./pages/TeamChat";
import EditWorkshop from "./pages/EditWorkshop";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider, useAuth } from "./components/auth/AuthContext";
import AccessDenied from "./pages/AccessDenied";

/**
 * Inner component that can access AuthContext.
 * Refreshes the profile once on mount if the user is already logged in.
 */
const AppRoutes = () => {
  const { user, refreshProfile } = useAuth();

  useEffect(() => {
    if (user) refreshProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />
      <Route path="/register/:id" element={<Register />} />

      <Route path="/workshop/:id" element={<PublicWorkshopDetail />} />

      <Route path="/access-denied" element={<AccessDenied />} />

      <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['admin', 'coworker']}><Dashboard /></ProtectedRoute>} />
      <Route path="/workshops" element={<ProtectedRoute allowedRoles={['admin', 'coworker']}><Workshops /></ProtectedRoute>} />
      <Route path="/students" element={<ProtectedRoute allowedRoles={['admin', 'coworker']}><Students /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute allowedRoles={['admin', 'coworker']}><Analytics /></ProtectedRoute>} />
      <Route path="/team-chat" element={<ProtectedRoute allowedRoles={['admin', 'coworker']}><TeamChat /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute allowedRoles={['admin', 'coworker']}><Settings /></ProtectedRoute>} />

      <Route path="/create-workshop" element={<ProtectedRoute allowedRoles={['admin']}><CreateWorkshop /></ProtectedRoute>} />
      <Route path="/dashboard/workshop/:id" element={<ProtectedRoute allowedRoles={['admin', 'coworker']}><WorkshopDetail /></ProtectedRoute>} />
      <Route path="/edit-student/:id" element={<ProtectedRoute allowedRoles={['admin']}><EditStudent /></ProtectedRoute>} />
      <Route path="/workshops/edit/:id" element={<ProtectedRoute allowedRoles={['admin']}><EditWorkshop /></ProtectedRoute>} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
