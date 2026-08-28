import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../style/style.css';

export default function StudentLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <nav aria-label="Student navigation">
        <ul>
          <li><strong>Student Dashboard</strong></li>
          <li><Link to="/student">Available Exams</Link></li>
          <li><Link to="/student/results">My Results</Link></li>
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