import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, LogOut, ShieldCheck, User as UserIcon, Trash2, Power, Plus, Edit2, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

/**
 * Composant Dashboard - Interface d'administration et Back-Office
 */
const Dashboard = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]); // Liste des utilisateurs
    const [currentUser, setCurrentUser] = useState(null); // Utilisateur connecté
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false); // Modal création/édition
    const [editMode, setEditMode] = useState(false); // Mode édition
    const [formData, setFormData] = useState({
        id: null,
        fullName: '',
        email: '',
        password: '',
        role_id: '3'
    });

    const roles = [
        { id: '1', name: 'Administrateur' },
        { id: '2', name: 'Docteur' },
        { id: '3', name: 'Patient' },
        { id: '4', name: 'Responsable' }
    ];

    // Effet initial pour vérifier l'authentification
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!userStr || !token) {
            navigate('/login');
            return;
        }

        const user = JSON.parse(userStr);
        setCurrentUser(user);
        fetchUsers(token);
    }, [navigate]);

    /**
     * Récupère la liste des utilisateurs depuis le backend
     */
    const fetchUsers = async (token) => {
        try {
            const res = await axios.get('http://localhost:5001/api/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (err) {
            console.error("Erreur fetch users:", err);
            const status = err.response?.status;

            if (status === 403) {
                toast.error("Accès refusé : Vous n'avez pas les permissions nécessaires (Admin/Responsable requis).");
            } else if (status === 401) {
                toast.error("Session expirée. Veuillez vous reconnecter.");
                navigate('/login');
            } else {
                toast.error("Une erreur est survenue lors de la récupération des utilisateurs.");
            }
        } finally {
            setLoading(false);
        }
    };

    /**
     * Gère la déconnexion
     */
    const handleLogout = () => {
        localStorage.clear();
        toast.success("Déconnexion réussie.");
        setTimeout(() => navigate('/login'), 500);
    };

    /**
     * Ouvre le modal pour créer un utilisateur
     */
    const openCreateModal = () => {
        setEditMode(false);
        setFormData({ id: null, fullName: '', email: '', password: '', role_id: '3' });
        setShowModal(true);
    };

    /**
     * Ouvre le modal pour éditer un utilisateur
     */
    const openEditModal = (user) => {
        setEditMode(true);
        setFormData({
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            password: '',
            role_id: String(roles.find(r => r.name === user.role)?.id || '3')
        });
        setShowModal(true);
    };

    /**
     * Soumet le formulaire de création/édition
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            if (editMode) {
                // Modification
                await axios.put(`http://localhost:5001/api/users/${formData.id}`,
                    { fullName: formData.fullName, email: formData.email, role_id: formData.role_id },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success("Utilisateur modifié avec succès.");
            } else {
                // Création
                await axios.post('http://localhost:5001/api/users',
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success("Utilisateur créé avec succès.");
            }
            setShowModal(false);
            fetchUsers(token);
        } catch (err) {
            toast.error(err.response?.data?.message || "Erreur lors de l'opération.");
        }
    };

    /**
     * Bascule le statut d'un compte utilisateur (Actif/Inactif)
     */
    const toggleStatus = async (userId, currentStatus) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`http://localhost:5001/api/users/${userId}/status`,
                { isActive: !currentStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Statut de l'utilisateur mis à jour.");
            fetchUsers(token); // Rafraîchissement de la liste
        } catch (err) {
            toast.error("Action non autorisée (Réservé à l'Administrateur).");
        }
    };

    /**
     * Supprime un utilisateur après confirmation
     */
    const deleteUser = async (userId) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5001/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Utilisateur supprimé avec succès.");
            fetchUsers(token);
        } catch (err) {
            toast.error("Action non autorisée.");
        }
    };

    return (
        <div className="dashboard-layout">
            {/* Barre latérale de navigation */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <ShieldCheck size={32} />
                    <span>MedManager</span>
                </div>
                <nav>
                    <div className="nav-item active">
                        <Users size={20} /> Utilisateurs
                    </div>
                </nav>
                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="btn-logout">
                        <LogOut size={20} /> Déconnexion
                    </button>
                </div>
            </aside>

            {/* Contenu principal */}
            <main className="main-content">
                <header className="main-header">
                    <h1>Gestion des Utilisateurs</h1>
                    <div className="header-actions">
                        {currentUser?.role === 'Administrateur' && (
                            <button onClick={openCreateModal} className="btn-create">
                                <Plus size={20} /> Créer un utilisateur
                            </button>
                        )}
                        <div className="user-profile">
                            <UserIcon size={20} />
                            <span>{currentUser?.fullName} ({currentUser?.role})</span>
                        </div>
                    </div>
                </header>

                <div className="table-container">
                    {loading ? <p>Chargement des données...</p> : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Nom Complet</th>
                                    <th>Email</th>
                                    <th>Rôle</th>
                                    <th>Statut</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id}>
                                        <td>{u.fullName}</td>
                                        <td>{u.email}</td>
                                        <td><span className={`badge role-${u.role?.toLowerCase()}`}>{u.role}</span></td>
                                        <td>
                                            <span className={`status-dot ${u.isActive ? 'active' : 'inactive'}`}></span>
                                            {u.isActive ? 'Actif' : 'Inactif'}
                                        </td>
                                        <td className="actions-cell">
                                            {currentUser?.role === 'Administrateur' && (
                                                <>
                                                    <button onClick={() => openEditModal(u)} title="Modifier">
                                                        <Edit2 size={18} color="#3b82f6" />
                                                    </button>
                                                    <button onClick={() => toggleStatus(u.id, u.isActive)} title="Changer le statut">
                                                        <Power size={18} color={u.isActive ? '#dc2626' : '#16a34a'} />
                                                    </button>
                                                    <button onClick={() => deleteUser(u.id)} title="Supprimer l'utilisateur">
                                                        <Trash2 size={18} color="#94a3b8" />
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>

            {/* Modal Création/Édition */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editMode ? 'Modifier l\'utilisateur' : 'Créer un utilisateur'}</h2>
                            <button onClick={() => setShowModal(false)} className="btn-close">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Nom Complet</label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            {!editMode && (
                                <div className="form-group">
                                    <label>Mot de passe</label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required={!editMode}
                                        placeholder="Minimum 6 caractères"
                                    />
                                </div>
                            )}
                            <div className="form-group">
                                <label>Rôle</label>
                                <select
                                    value={formData.role_id}
                                    onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
                                >
                                    {roles.map(role => (
                                        <option key={role.id} value={role.id}>{role.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-cancel">
                                    Annuler
                                </button>
                                <button type="submit" className="btn-primary">
                                    {editMode ? 'Modifier' : 'Créer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
