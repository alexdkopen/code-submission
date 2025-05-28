import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { CustomersPage } from './pages/CustomersPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
import './App.css'

function CatchAllRoute() {
  const { user } = useAuth();
  return <Navigate to={user ? "/customers" : "/login"} replace />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <CustomersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navigate to="/customers" replace />
              </ProtectedRoute>
            }
          />
          {/* Catch-all route for any undefined routes */}
          <Route path="*" element={<CatchAllRoute />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
