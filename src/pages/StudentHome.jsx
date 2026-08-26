import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function StudentHome() {
  const { user, logout } = useAuth();
  return (
      <div className="page">
        <h1>Espace Étudiant</h1>
        <p>Bienvenue {user?.fullName || user?.email}</p>
        <nav>
          <Link to="/student/exams">Examens disponibles</Link>
          {' '}
          <Link to="/student/results">Mes résultats</Link>
          {' '}
          <button onClick={logout}>Logout</button>
        </nav>
      </div>
  );
}