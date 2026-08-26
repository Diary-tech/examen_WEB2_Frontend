import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { get } from '../api/client.js';

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
    <>
      <nav aria-label="Admin navigation">
        <ul>
          <li><h1>Admin Dashboard</h1></li>
          <li><Link to="/admin">Dashboard</Link></li>
          <li><Link to="/admin/students">Students</Link></li>
          <li><Link to="/admin/courses">Courses</Link></li>
          <li><Link to="/admin/exams">Exams</Link></li>
        </ul>
      </nav>

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
    </>
  );
}