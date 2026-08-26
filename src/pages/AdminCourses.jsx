import { useState, useEffect } from 'react';
import { get, post, put, remove } from '../api/client.js';

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const data = await get('/courses');
      setCourses(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setCode('');
    setName('');
    setDescription('');
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  const openCreateForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (course) => {
    setEditingId(course.id);
    setCode(course.code);
    setName(course.name);
    setDescription(course.description || '');
    setShowForm(true);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (editingId) {
        await put(`/courses/${editingId}`, { code, name, description });
      } else {
        await post('/courses', { code, name, description });
      }
      resetForm();
      loadCourses();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Confirm deletion ?')) return;
    try {
      await remove(`/courses/${id}`);
      loadCourses();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <h1>Courses managing</h1>

      {error && <p className="error">{error}</p>}

      {!showForm && (
        <button onClick={openCreateForm}>+ Add Course</button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit}>
          <h2>{editingId ? 'Edit Course' : 'Add Course'}</h2>

          <input
            type="text"
            placeholder="Code (ex. PROG2)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Nom du cours"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <textarea
            placeholder="Description (optionnel)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <h2>List of Courses</h2>
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>{course.code}</td>
              <td>{course.name}</td>
              <td>{course.description || '—'}</td>
              <td>
                <button onClick={() => openEditForm(course)}>Edit</button>
                <button onClick={() => handleDelete(course.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}