import { useEffect, useState } from 'react';
import { get } from '../api/client.js';

export default function StudentResults() {
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const data = await get('/my/results');
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <h1>My Results</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>My Results</h1>

      {error && <p className="error">{error}</p>}

      {!error && results.length === 0 ? (
        <p>No results available at the moment.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Exam</th>
              <th>Course</th>
              <th>Score</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={`${r.exam_id}-${r.submitted_at}`}>
                <td>{r.title}</td>
                <td>{r.course_code}</td>
                <td>{r.score} / {r.total_points}</td>
                <td>{new Date(r.submitted_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}