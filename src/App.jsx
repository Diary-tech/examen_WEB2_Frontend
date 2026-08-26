import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import AdminLayout from './components/AdminLayout.jsx';
import AdminHome from './pages/AdminHome.jsx';
import AdminStudents from './pages/AdminStudents.jsx';
import StudentHome from './pages/StudentHome.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminCourses from './pages/AdminCourses.jsx';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminHome />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="courses" element={<AdminCourses />} />
      </Route>

      <Route
        path="/student"
        element={
          <ProtectedRoute role="student">
            <StudentHome />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;