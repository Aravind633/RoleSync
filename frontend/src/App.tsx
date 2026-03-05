import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ProtectedRoute } from './core/components/ProtectedRoute';
import { Register } from './pages/Auth/Register';
const Home = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <h1 className="text-4xl font-bold mb-4">Welcome to RoleSync</h1>
    <div className="flex gap-4">
      <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded">Login</Link>
      <Link to="/register" className="px-4 py-2 bg-green-600 text-white rounded">Register</Link>
    </div>
  </div>
);

const Login = () => <div className="p-8"><h1 className="text-2xl font-bold">Login Page</h1></div>;
// const Register = () => <div className="p-8"><h1 className="text-2xl font-bold">Register Page</h1></div>;
const Unauthorized = () => <div className="p-8"><h1 className="text-2xl font-bold text-red-600">403 - Unauthorized! Wrong Role.</h1></div>;

const CandidateDashboard = () => <div className="p-8"><h1 className="text-2xl font-bold text-blue-600">🎓 Candidate Dashboard</h1></div>;
const RecruiterDashboard = () => <div className="p-8"><h1 className="text-2xl font-bold text-purple-600">🏢 Recruiter Dashboard</h1></div>;

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        
        <Route element={<ProtectedRoute allowedRoles={['candidate']} />}>
          <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
        </Route>

       
        <Route element={<ProtectedRoute allowedRoles={['recruiter']} />}>
          <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
        </Route>
        
      </Routes>
    </Router>
  );
}

export default App;