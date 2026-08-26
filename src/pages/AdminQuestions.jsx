import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { get, post, put, remove } from '../api/client.js';

export default function AdminQuestions() {
    const { id } = useParams();
    const [questions, setQuestions] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [statement, setStatement] = useState('');
    const [points, setPoints] = useState('');
    const [choices, setChoices] = useState([
        { label: '', isCorrect: true },
        { label: '', isCorrect: false }
    ]);

    useEffect(() => {
        loadQuestions();
    }, [id]);

    const loadQuestions = async () => {
        try {
            const data = await get(`/exams/${id}/questions`);
            setQuestions(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const resetForm = () => {
        setStatement('');
        setPoints('');
        setChoices([
            { label: '', isCorrect: true },
            { label: '', isCorrect: false }
        ]);
        setEditingId(null);
        setShowForm(false);
    };

    const openCreateForm = () => {
        resetForm();
        setError('');
        setSuccess('');
        setShowForm(true);
    };

    const openEditForm = (question) => {
        setEditingId(question.id);
        setStatement(question.statement);
        setPoints(String(question.points));
        setChoices(
            question.choices.map((choice) => ({
                id: choice.id,
                label: choice.label,
                isCorrect: choice.isCorrect
            }))
        );
        setShowForm(true);
        setError('');
        setSuccess('');
    };

    const updateChoice = (index, field, value) => {
        setChoices((current) =>
            current.map((choice, i) =>
                i === index ? { ...choice, [field]: value } : choice
            )
        );
    };

    const setCorrectChoice = (index) => {
        setChoices((current) =>
            current.map((choice, i) => ({
                ...choice,
                isCorrect: i === index
            }))
        );
    };

    const addChoice = () => {
        if (choices.length >= 6) return;
        setChoices((current) => [
            ...current,
            { label: '', isCorrect: false }
        ]);
    };

    const removeChoice = (index) => {
        if (choices.length <= 2) return;
        setChoices((current) => current.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (choices.length < 2 || choices.length > 6) {
            setError('A question must have between 2 and 6 choices');
            return;
        }

        if (choices.filter((choice) => choice.isCorrect).length !== 1) {
            setError('A question must have exactly one correct choice');
            return;
        }

        if (choices.some((choice) => !choice.label.trim())) {
            setError('All choices must have a label');
            return;
        }

        setLoading(true);

        try {
            const payload = {
                statement,
                points: Number(points),
                choices: choices.map((choice) => ({
                    label: choice.label.trim(),
                    isCorrect: choice.isCorrect
                }))
            };

            if (editingId) {
                await put(`/questions/${editingId}`, payload);
                setSuccess('Question updated successfully.');
            } else {
                await post(`/exams/${id}/questions`, payload);
                setSuccess('Question created successfully.');
            }

            resetForm();
            await loadQuestions();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (questionId) => {
        if (!window.confirm('Delete this question?')) return;

        setError('');
        setSuccess('');

        try {
            await remove(`/questions/${questionId}`);
            setSuccess('Question deleted successfully.');
            await loadQuestions();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="page">
            <Link to="/admin/exams">← Back to Exams</Link>
            <h1>Manage Questions</h1>

            {error && <p className="error">{error}</p>}
            {success && <p>{success}</p>}

            {!showForm && (
                <button onClick={openCreateForm}>+ Add Question</button>
            )}

            {showForm && (
                <form onSubmit={handleSubmit}>
                    <h2>{editingId ? 'Edit Question' : 'Add Question'}</h2>

                    <div>
                        <label htmlFor="statement">Statement</label>
                        <textarea
                            id="statement"
                            value={statement}
                            onChange={(e) => setStatement(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="points">Points</label>
                        <input
                            id="points"
                            type="number"
                            min="1"
                            step="1"
                            value={points}
                            onChange={(e) => setPoints(e.target.value)}
                            required
                        />
                    </div>

                    <h3>Choices</h3>

                    {choices.map((choice, index) => (
                        <div key={index}>
                            <input
                                type="text"
                                placeholder={`Choice ${index + 1}`}
                                value={choice.label}
                                onChange={(e) =>
                                    updateChoice(index, 'label', e.target.value)
                                }
                                required
                            />

                            <label>
                                <input
                                    type="radio"
                                    name="correctChoice"
                                    checked={choice.isCorrect}
                                    onChange={() => setCorrectChoice(index)}
                                />
                                Correct
                            </label>

                            {choices.length > 2 && (
                                <button
                                    type="button"
                                    onClick={() => removeChoice(index)}
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}

                    {choices.length < 6 && (
                        <button type="button" onClick={addChoice}>
                            + Add Choice
                        </button>
                    )}

                    <div>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Submitting...' : editingId ? 'Update' : 'Create'}
                        </button>

                        <button type="button" onClick={resetForm}>
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <h2>Questions</h2>

            {questions.length === 0 ? (
                <p>No questions found.</p>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>Position</th>
                        <th>Question</th>
                        <th>Points</th>
                        <th>Choices</th>
                        <th>Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {questions.map((question) => (
                        <tr key={question.id}>
                            <td>{question.position}</td>
                            <td>{question.statement}</td>
                            <td>{question.points}</td>
                            <td>
                                <ul>
                                    {question.choices?.map((choice) => (
                                        <li key={choice.id}>
                                            {choice.label}
                                            {choice.isCorrect ? ' ✓' : ''}
                                        </li>
                                    ))}
                                </ul>
                            </td>

                            <td>
                                <button onClick={() => openEditForm(question)}>
                                    Edit
                                </button>

                                <button onClick={() => handleDelete(question.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}