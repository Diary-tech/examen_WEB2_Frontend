import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { get } from '../api/client.js';

export default function StudentExamResult() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadResult();
  }, [id]);

  const loadResult = async () => {
    try {
      const results = await get('/my/results');
      const found = results.find((r) => r.examId === Number(id));
      if (!found) {
        setError("No result found for this exam.");
      } else {
        setResult(found);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <h1>Result</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <h1>Result</h1>
        <p className="error">{error}</p>
        <Link to="/student">Back to exams</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>{result.examTitle}</h1>
      <h2>Score : {result.score} / {result.maxScore}</h2>

      <h3>Correction</h3>
      {result.corrections.map((c, index) => (
        <div
          key={c.questionId}
          style={{
            padding: '0.75rem',
            marginBottom: '0.5rem',
            borderLeft: `4px solid ${c.isCorrect ? 'green' : 'red'}`,
            backgroundColor: c.isCorrect ? '#f0fdf4' : '#fef2f2',
          }}
        >
          <p><strong>{index + 1}. {c.statement}</strong> ({c.points} pts)</p>
          <p>Your answer : {c.selectedChoiceId ?? 'No response'}</p>
          <p>{c.isCorrect ? 'True' : `False`}</p>
        </div>
      ))}

      <Link to="/student">Back to exams</Link>
    </div>
  );
}