import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { get, post, put, remove } from '../api/client.js';
import '../style/style.css';

export default function AdminExams() {
    const [exams, setExams] = useState([]);
    const [courses, setCourses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [courseId, setCourseId] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startsAt, setStartsAt] = useState('');
    const [endsAt, setEndsAt] = useState('');

    const loadExams = async () => {
        try {
            const data = await get('/exams');
            setExams(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const loadCourses = async () => {
        try {
            const data = await get('/courses');
            setCourses(data);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        loadExams();
        loadCourses();
    }, []);

    const resetForm = () => {
        setCourseId('');
        setTitle('');
        setDescription('');
        setStartsAt('');
        setEndsAt('');
        setEditingId(null);
        setShowForm(false);
    };

    const openCreateForm = () => {
        resetForm();
        setError('');
        setSuccess('');
        setShowForm(true);
    };

    const formatDateForInput = (date) => {
        if (!date) return '';
        const value = new Date(date);
        if (Number.isNaN(value.getTime())) return '';
        const offset = value.getTimezoneOffset();
        const localDate = new Date(value.getTime() - offset * 60000);
        return localDate.toISOString().slice(0, 16);
    };

    const openEditForm = (exam) => {
        setEditingId(exam.id);
        setCourseId(String(exam.course?.id ?? ''));
        setTitle(exam.title || '');
        setDescription(exam.description || '');
        setStartsAt(formatDateForInput(exam.starts_at));
        setEndsAt(formatDateForInput(exam.ends_at));
        setShowForm(true);
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (new Date(startsAt) >= new Date(endsAt)) {
            setError('The exam start date must be before the end date');
            return;
        }

        setLoading(true);

        try {
            if (editingId) {
                await put(`/exams/${editingId}`, {
                    title,
                    description,
                    starts_at: new Date(startsAt).toISOString(),
                    ends_at: new Date(endsAt).toISOString()
                });
                setSuccess('Exam updated successfully.');
            } else {
                await post('/exams', {
                    courseId: Number(courseId),
                    title,
                    description,
                    startsAt: new Date(startsAt).toISOString(),
                    endsAt: new Date(endsAt).toISOString()
                });
                setSuccess('Exam created successfully.');
            }

            resetForm();
            await loadExams();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this exam?')) return;

        setError('');
        setSuccess('');

        try {
            await remove(`/exams/${id}`);
            setSuccess('Exam deleted successfully.');
            await loadExams();
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

    const getCourseName = (exam) => {
        if (exam.course) return `${exam.course.code} - ${exam.course.name}`;

        const course = courses.find((item) => item.id === exam.course?.id);

        return course
            ? `${course.code} - ${course.name}`
            : `Course #${exam.course?.id ?? '?'}`;
    };

    const isLocked = (exam) => {
        return Number(exam.attempt_count) > 0;
    };

    return (
        <div className="page">
            <h1>Manage Exams</h1>

            {error && <p className="error">{error}</p>}
            {success && <p>{success}</p>}

            {!showForm && (
                <button onClick={openCreateForm}>+ Add Exam</button>
            )}

            {showForm && (
                <form onSubmit={handleSubmit}>
                    <h2>{editingId ? 'Edit Exam' : 'Add Exam'}</h2>

                    {!editingId && (
                        <div>
                            <label htmlFor="courseId">Course</label>
                            <select
                                id="courseId"
                                value={courseId}
                                onChange={(e) => setCourseId(e.target.value)}
                                required
                            >
                                <option value="">Select a course</option>

                                {courses.map((course) => (
                                    <option key={course.id} value={course.id}>
                                        {course.code} - {course.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div>
                        <label htmlFor="title">Title</label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="startsAt">Start date</label>
                        <input
                            id="startsAt"
                            type="datetime-local"
                            value={startsAt}
                            onChange={(e) => setStartsAt(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="endsAt">End date</label>
                        <input
                            id="endsAt"
                            type="datetime-local"
                            value={endsAt}
                            onChange={(e) => setEndsAt(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <button type="submit" disabled={loading}>
                            {loading
                                ? 'Submitting...'
                                : editingId
                                    ? 'Update'
                                    : 'Create'}
                        </button>

                        <button type="button" onClick={resetForm}>
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <h2>List of Exams</h2>

            {exams.length === 0 ? (
                <p>No exams found.</p>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Course</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Questions</th>
                        <th>Attempts</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {exams.map((exam) => {
                        const locked = isLocked(exam);

                        return (
                            <tr key={exam.id}>
                                <td>{exam.title}</td>
                                <td>{getCourseName(exam)}</td>
                                <td>{formatDate(exam.starts_at)}</td>
                                <td>{formatDate(exam.ends_at)}</td>
                                <td>{exam.question_count ?? 0}</td>
                                <td>{exam.attempt_count ?? 0}</td>
                                <td>
                                    {locked ? 'Locked' : 'Editable'}
                                </td>

                                <td>
                                    <Link to={`/admin/exams/${exam.id}/questions`}>
                                        Questions
                                    </Link>

                                    {' '}

                                    <Link to={`/admin/exams/${exam.id}/results`}>
                                        Results
                                    </Link>

                                    {' '}

                                    {!locked && (
                                        <>
                                            <button
                                                onClick={() => openEditForm(exam)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => handleDelete(exam.id)}
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            )}
        </div>
    );
}