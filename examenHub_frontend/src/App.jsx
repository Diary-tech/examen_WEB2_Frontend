import Login from './pages/Login.jsx'
import './App.css'
import { Routes, Route } from 'react-router-dom';
import AdminHome from './pages/AdminHome.jsx';
import StudentHome from './pages/StudentHome.jsx';

function App() {

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminHome />} />
      <Route path="/student" element={<StudentHome />} />
    </Routes>
  )
}

export default App
