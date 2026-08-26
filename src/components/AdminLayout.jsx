import { Link, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <>
      <nav aria-label="Admin navigation">
        <ul>
          <li><strong>Admin Dashboard</strong></li>
          <li><Link to="/admin">Dashboard</Link></li>
          <li><Link to="/admin/students">Students</Link></li>
          <li><Link to="/admin/courses">Courses</Link></li>
          <li><Link to="/admin/exams">Exams</Link></li>
        </ul>
      </nav>

      <main>
        <Outlet />
      </main>
    </>
  );
}