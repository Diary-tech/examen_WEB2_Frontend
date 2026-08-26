import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { get, post } from '../api/client.js';

export default function StudentExam() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [exam, setExam] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadExam();
    }, [id]);

    const loadExam = async () => {
        try {
            const data = await get(`/my/exams/${id}`);
            setExam(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChoiceChange = (questionId, choiceId) => {
        setAnswers((current) => ({
            ...current,
            [questionId]: choiceId,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            const formattedAnswers = Object.entries(answers).map(
                ([questionId, choiceId]) => ({
                    questionId: Number(questionId),
                    choiceId: Number(choiceId),
                })
            );

            await post(`/my/exams/${id}/submit`, {
                answers: formattedAnswers,
            });

            navigate(`/student/exams/${id}/result`);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="page">
                <h1>Exam</h1>
                <p>Loading...</p>
            </div>
        );
    }

    if (error && !exam) {
        return (
            <div className="page">
                <h1>Exam</h1>
                <p className="error">{error}</p>
                <Link to="/student/exams">
                    ← Back to exams
                </Link>
            </div>
        );
    }

    return (
        <div className="page">
            <Link to="/student/exams">
                ← Back to exams
            </Link>

            <h1>{exam.title}</h1>

            {exam.description && (
                <p>{exam.description}</p>
            )}

            {error && (
                <p className="error">{error}</p>
            )}

            <form onSubmit={handleSubmit}>
                {exam.questions
                    .slice()
                    .sort((a, b) => a.position - b.position)
                    .map((question, index) => (
                        <div key={question.id}>
                            <h2>
                                {index + 1}. {question.statement}
                            </h2>

                            <p>
                                Points: {question.points}
                            </p>

                            {question.choices
                                .slice()
                                .sort(
                                    (a, b) =>
                                        a.position - b.position
                                )
                                .map((choice) => (
                                    <label key={choice.id}>
                                        <input
                                            type="radio"
                                            name={`question-${question.id}`}
                                            value={choice.id}
                                            checked={
                                                answers[question.id] ===
                                                choice.id
                                            }
                                            onChange={() =>
                                                handleChoiceChange(
                                                    question.id,
                                                    choice.id
                                                )
                                            }
                                        />

                                        {choice.label}
                                    </label>
                                ))}
                        </div>
                    ))}

                <button
                    type="submit"
                    disabled={submitting}
                >
                    {submitting
                        ? 'Submitting...'
                        : 'Submit Exam'}
                </button>
            </form>
        </div>
    );
}