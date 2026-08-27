import { useAuth } from '../context/AuthContext';

export default function StudentHome() {
  const { user } = useAuth();

  return (
    <div className="page">
      <h1>Espace Étudiant</h1>
      <p>Bienvenue {user?.fullName || user?.email}</p>
    </div>
  );
}