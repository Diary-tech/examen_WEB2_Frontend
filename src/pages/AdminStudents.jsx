import { useState, useEffect } from 'react';
import { get, post, put, remove } from '../api/client.js';

export default function AdminStudents() {
    const [students, setStudents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        loadStudents();
    }, []);

    return (
        <div className="page">
            <h1>Manage Students</h1>
            {!showForm && (
                <button onClick={openCreateForm}>+ Ajouter un étudiant</button>
            )}
            {showForm && (
                <form onSubmit={handleSubmit}>
                    <h2>{editingId ? 'Modifier l\'étudiant' : 'Ajouter un étudiant'}</h2>

                    <input
                        type="text"
                        placeholder="Nom complet"
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
                            placeholder="Mot de passe initial"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    )}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Enregistrement...' : editingId ? 'Mettre à jour' : 'Créer'}
                        </button>
                        <button type="button" onClick={resetForm}>
                            Annuler
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}