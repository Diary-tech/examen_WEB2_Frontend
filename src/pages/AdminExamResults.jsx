import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { get } from '../api/client.js';
import '../style/style.css';

export default function AdminExamResults() {
    const { id } = useParams();
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        loadResults();
    }, [id]);

    const loadResults = async () => {
        try {
            const data = await get(`/exams/${id}/results`);
            setResults(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const formatDate = (date) => {
        if (!date) return '-';
        const value = new Date(date);
        if (Number.isNaN(value.getTime())) return '-';
        return value.toLocaleString();
    };

    return (
        <div className="page">
            <Link to="/admin/exams">← Back to Exams</Link>

            <h1>
                Exam Results{results?.exam_title ? ` — ${results.exam_title}` : ''}
            </h1>

            {error && <p className="error">{error}</p>}

            {!results ? (
                <p>Loading...</p>
            ) : (
                <>
                    <section>
                        <h2>Summary</h2>
                        <p>Total points: {results.total_points}</p>
                        <p>Attempts: {results.attempts_count}</p>
                        <p>Average score: {results.average ?? '—'}</p>
                    </section>

                    <h2>Student Results</h2>

                    {results.rows.length === 0 ? (
                        <p>No results found.</p>
                    ) : (
                        <table>
                            <thead>
                            <tr>
                                <th>Student</th>
                                <th>Score</th>
                                <th>Submitted At</th>
                            </tr>
                            </thead>
                            <tbody>
                            {results.rows.map((row) => (
                                <tr key={row.student_id}>
                                    <td>{row.student_name}</td>
                                    <td>{row.score}</td>
                                    <td>{formatDate(row.submitted_at)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </>
            )}
        </div>
    );
}