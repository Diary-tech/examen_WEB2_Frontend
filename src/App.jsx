import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';

import AdminLayout from './components/AdminLayout.jsx';
import AdminHome from './pages/AdminHome.jsx';
import AdminStudents from './pages/AdminStudents.jsx';
import AdminCourses from './pages/AdminCourses.jsx';
import AdminExams from './pages/AdminExams.jsx';
import AdminQuestions from './pages/AdminQuestions.jsx';
import AdminExamResults from './pages/AdminExamResults.jsx';

import StudentLayout from './components/StudentLayout.jsx';
import StudentExams from './pages/StudentExams.jsx';
import StudentExam from './pages/StudentExam.jsx';
import StudentExamResult from './pages/StudentExamResult.jsx';
import StudentResults from './pages/StudentResults.jsx';

import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminHome />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="courses" element={<AdminCourses />} />
        <Route path="exams" element={<AdminExams />} />
        <Route path="exams/:id/questions" element={<AdminQuestions />} />
        <Route path="exams/:id/results" element={<AdminExamResults />} />
      </Route>

      <Route path="/student" element={<ProtectedRoute role="student"><StudentLayout /></ProtectedRoute>}>
        <Route index element={<StudentExams />} />
        <Route path="exams/:id" element={<StudentExam />} />
        <Route path="exams/:id/result" element={<StudentExamResult />} />
        <Route path="results" element={<StudentResults />} />
      </Route>
    </Routes>
  );
}

export default App;