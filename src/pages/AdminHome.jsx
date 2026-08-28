import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { get } from '../api/client.js';
import '../style/AdminHome.css';
import '../style/style.css';

export default function AdminHome() {
  const [counts, setCounts] = useState({
    students: null,
    courses: null,
    exams: null,
  });

  const [error, setError] = useState('');

  useEffect(() => {
    loadCounts();
  }, []);

  const loadCounts = async () => {
    try {
      const [students, courses, exams] = await Promise.all([
        get('/students'),
        get('/courses'),
        get('/exams'),
      ]);

      setCounts({
        students: students.length,
        courses: courses.length,
        exams: exams.length,
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
    <h1>Admin Dashboard</h1>
      <main>
        <section className="stats">
          <article className="stat-card">
            <h2>{counts.students ?? '...'}</h2>
            <p>Students</p>
          </article>

          <article className="stat-card">
            <h2>{counts.courses ?? '...'}</h2>
            <p>Courses</p>
          </article>

          <article className="stat-card">
            <h2>{counts.exams ?? '...'}</h2>
            <p>Exams</p>
          </article>
        </section>

        {error && <p className="error">{error}</p>}

        <section>
          <h2>Quick Links</h2>
          <ul>
            <li><Link to="/admin/students">Manage Students</Link></li>
            <li><Link to="/admin/courses">Manage Courses</Link></li>
            <li><Link to="/admin/exams">Manage Exams</Link></li>
          </ul>
        </section>
      </main>
    </div>
  );
}