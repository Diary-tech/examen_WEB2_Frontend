import { useState, useEffect } from 'react';
import { get, post, put, remove } from '../api/client.js';

export default function AdminStudents() {
    const [students, setStudents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        try {
            const data = await get('/students');
            setStudents(data);
        }
        catch (err) {
            setError(err.message);
        }
    };

    const resetForm = () => {
        setEmail('');
        setFullName('');
        setPassword('');
        setEditingId(null);
        setShowForm(false);
        setError('');
    };

    const openCreateForm = () => {   
        resetForm();
        setShowForm(true);
    };

    const openEditForm = (student) => {
        setEditingId(student.id);
        setEmail(student.email);
        setFullName(student.fullName);
        setPassword('');
        setShowForm(true);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (editingId) {
                await put(`/students/${editingId}`, { email, fullName });
            } else {
                await post('/students', { email, fullName, password });
            }
            resetForm();
            loadStudents();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    const handleDeactivate = async (id) => {
        if (!confirm('Désactiver cet étudiant ?')) return;
        try {
            await remove(`/students/${id}`);
            loadStudents();
        } catch (err) {
            setError(err.message);
        }
    };
    const handleActivate = async (id) => {
    try {
        await put(`/students/${id}/activate`, {});
        loadStudents();
    } catch (err) {
        setError(err.message);
    }
};
    return (
        <div className="page">
            <h1>Manage Students</h1>
            {!showForm && (
                <button onClick={openCreateForm}>+ Add Student</button>
            )}
            {showForm && (
                <form onSubmit={handleSubmit}>
                    <h2>{editingId ? 'Edit Student' : 'Add Student'}</h2>

                    <input
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    {!editingId && (
                        <input
                            type="password"
                            placeholder="Initial Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    )}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Submitting...' : editingId ? 'Update' : 'Create'}
                        </button>
                        <button type="button" onClick={resetForm}>
                            Cancel
                        </button>
                    </div>
                </form>
            )}
            <h2>List of Students</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student.id}>
                            <td>{student.fullName}</td>
                            <td>{student.email}</td>
                            <td>{student.isActive ? 'Active' : 'Inactive'}</td>
                            <td>
    <button onClick={() => openEditForm(student)}>Edit</button>
    {student.isActive && (
        <button onClick={() => handleDeactivate(student.id)}>
            Desactivate
        </button>
    )}
    {!student.isActive && (
        <button onClick={() => handleActivate(student.id)}>
            Activate
        </button>
    )}
</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}