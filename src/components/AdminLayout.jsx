import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../style/style.css';

export default function AdminLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <nav aria-label="Admin navigation">
        <ul>
          <li><strong>Admin Dashboard</strong></li>
          <li><Link to="/admin">Dashboard</Link></li>
          <li><Link to="/admin/students">Students</Link></li>
          <li><Link to="/admin/courses">Courses</Link></li>
          <li><Link to="/admin/exams">Exams</Link></li>
          <li>
            <button className="logout-btn" onClick={handleLogout}>
              Log out
            </button>
          </li>
        </ul>
      </nav>

      <main>
        <Outlet />
      </main>
    </>
  );
}