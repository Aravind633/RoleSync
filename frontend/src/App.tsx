import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ProtectedRoute } from './core/components/ProtectedRoute';
import { Layout } from './core/components/Layout';
import { Register } from './pages/Auth/Register';
import { Login } from './pages/Auth/Login';


// Temporary Placeholder Components

const Home = () => (
  <div className="flex flex-col items-center justify-center h-[80vh]">
    <h1 className="text-5xl font-extrabold mb-6 text-gray-900">Welcome to RoleSync</h1>
    <p className="text-xl text-gray-600 mb-8">AI-Powered Job Matchmaking</p>
  </div>
);

const Unauthorized = () => <div className="p-8"><h1 className="text-2xl font-bold text-red-600">403 - Unauthorized! Wrong Role.</h1></div>;
const CandidateDashboard = () => <div className="p-8"><h1 className="text-2xl font-bold text-blue-600">🎓 Candidate Dashboard</h1></div>;
const RecruiterDashboard = () => <div className="p-8"><h1 className="text-2xl font-bold text-purple-600">🏢 Recruiter Dashboard</h1></div>;
//  Main App Routing

function App() {
  return (
    <Router>
      <Routes>
        {/* Everything inside here gets the Navbar */}
        <Route element={<Layout />}>
          
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Candidate Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['candidate']} />}>
            <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
          </Route>

          {/* Recruiter Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['recruiter']} />}>
            <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
          </Route>

        </Route>
      </Routes>
    </Router>
  );
}

export default App;