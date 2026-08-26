import Login from './pages/Login.jsx'
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminHome from './pages/AdminHome.jsx';
import StudentHome from './pages/StudentHome.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student"
        element={
          <ProtectedRoute role="student">
            <StudentHome />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
