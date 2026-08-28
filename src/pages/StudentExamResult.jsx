import { Link, useLocation } from 'react-router-dom';
import '../style/style.css';

export default function StudentExamResult() {
  const location = useLocation();
  const { result, examTitle } = location.state || {};

  if (!result) {
    return (
      <div className="page">
        <h1>Result</h1>
        <p className="error">
          No result to display. Please take the exam first.
        </p>
        <Link to="/student">Back to exams</Link>
      </div>
    );
  }

  const title = examTitle || result.exam_title || result.examTitle || 'Exam result';
  const maxScore = result.max_score ?? result.maxScore ?? result.total_points ?? '?';
  const corrections = result.corrections || result.correction || [];

  return (
    <div className="page">
      <h1>{title}</h1>
      <h2>
        Score : {result.score} / {maxScore}
      </h2>

      <h3>Correction</h3>

      {corrections.length === 0 ? (
        <p>No correction available.</p>
      ) : (
        corrections.map((c, index) => {
          const isCorrect = c.is_correct ?? c.isCorrect;
          const selected =
            c.selected_choice_id ??
            c.selectedChoiceId ??
            c.student_choice_id ??
            'No response';

          return (
            <div
              key={c.question_id ?? c.questionId ?? index}
              style={{
                padding: '0.75rem',
                marginBottom: '0.5rem',
                borderLeft: `4px solid ${isCorrect ? 'green' : 'red'}`,
                backgroundColor: isCorrect ? '#f0fdf4' : '#fef2f2',
              }}
            >
              <p>
                <strong>
                  {index + 1}. {c.statement}
                </strong>{' '}
                ({c.points} pts)
              </p>
              <p>Your answer : {selected}</p>
              <p>{isCorrect ? '✓ Correct' : '✗ Incorrect'}</p>
            </div>
          );
        })
      )}

      <Link to="/student">Back to exams</Link>
    </div>
  );
}