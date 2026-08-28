import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function StudentExamResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, examTitle } = location.state || {};

  if (!result) {
    return (
      <div className="page">
        <h1>Result</h1>
        <p className="error">No result to display. Please take the exam first.</p>
        <Link to="/student">Back to exams</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>{examTitle}</h1>
      <h2>Score : {result.score} / {result.total_points}</h2>

      <h3>Correction</h3>
      {result.correction.map((c, index) => (
        <div
          key={c.question_id}
          style={{
            padding: '0.75rem',
            marginBottom: '0.5rem',
            borderLeft: `4px solid ${c.is_correct ? 'green' : 'red'}`,
            backgroundColor: c.is_correct ? '#f0fdf4' : '#fef2f2',
          }}
        >
          <p><strong>{index + 1}. {c.statement}</strong> ({c.points} pts)</p>
          <p>Your answer : {c.student_choice_id ?? 'No response'}</p>
          <p>{c.is_correct ? 'True' : 'False'}</p>
        </div>
      ))}

      <Link to="/student">Back to exams</Link>
    </div>
  );
}