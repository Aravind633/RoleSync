import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './core/components/ProtectedRoute';
import { Layout } from './core/components/Layout';
import { Register } from './pages/Auth/Register';
import { Login } from './pages/Auth/Login';

import { CandidateDashboard } from './pages/Candidate/CandidateDashboard';
import { RecruiterDashboard } from './pages/Recruiter/RecruiterDashboard';
import { useAuthStore } from './store/authStore';

const Home = () => (
  <div className="flex flex-col items-center justify-center h-[80vh]">
    <h1 className="text-5xl font-extrabold mb-6 text-gray-900">Welcome to RoleSync</h1>
    <p className="text-xl text-gray-600 mb-8">AI-Powered Job Matchmaking</p>
  </div>
);

const Unauthorized = () => (
  <div className="p-8 text-center mt-20">
    <h1 className="text-3xl font-bold text-red-600">403 - Unauthorized</h1>
    <p className="text-gray-600 mt-2">You do not have the correct role to view this page.</p>
  </div>
);

function App() {
  const { checkAuth, isCheckingAuth } = useAuthStore();

  // Run checkAuth the exact millisecond the app loads
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Show a loading spinner instead of a white screen while checking authentication!
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Candidate Routes */}
          <Route element={<ProtectedRoute allowedRoles={['candidate']} />}>
            <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
          </Route>
          
          {/* Recruiter Routes */}
          <Route element={<ProtectedRoute allowedRoles={['recruiter']} />}>
            <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
          </Route>

        </Route>
      </Routes>
    </Router>
  );
}

export default App;