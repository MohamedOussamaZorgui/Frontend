import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, LogOut, ShieldCheck, User as UserIcon, Trash2, Power } from 'lucide-react';
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
            toast.error("Session expirée ou accès refusé.");
            navigate('/login');
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
                    <div className="user-profile">
                        <UserIcon size={20} />
                        <span>{currentUser?.fullName} ({currentUser?.role})</span>
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
                                            {/* Bouton Toggle Statut */}
                                            <button onClick={() => toggleStatus(u.id, u.isActive)} title="Changer le statut">
                                                <Power size={18} color={u.isActive ? '#dc2626' : '#16a34a'} />
                                            </button>
                                            {/* Bouton Supprimer */}
                                            <button onClick={() => deleteUser(u.id)} title="Supprimer l'utilisateur">
                                                <Trash2 size={18} color="#94a3b8" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
