import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { get } from '../api/client.js';

export default function StudentExams() {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        loadExams();
    }, []);
    const loadExams = async () => {
        try {
            const data = await get('/exams/my');
            setExams(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    const formatDate = (date) => {
        if (!date) return '-';
        const value = new Date(date);
        if (Number.isNaN(value.getTime())) return '-';
        return value.toLocaleString();
    };
    if (loading) {
        return (
            <div className="page">
                <h1>Available Exams</h1>
                <p>Loading...</p>
            </div>
        );
    }
    return (
        <div className="page">
            <h1>Available Exams</h1>
            {error && <p className="error">{error}</p>}
            {!error && exams.length === 0 ? (
                <p>No exams are currently available.</p>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {exams.map((exam) => (
                        <tr key={exam.id}>
                            <td>{exam.title}</td>
                            <td>{exam.description || '-'}</td>
                            <td>{formatDate(exam.startsAt)}</td>
                            <td>{formatDate(exam.endsAt)}</td>
                            <td>
                                <Link to={`/student/exams/${exam.id}`}>
                                    Take Exam
                                </Link>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
            <p>
                <Link to="/student">← Back to dashboard</Link>
            </p>
        </div>
    );
}