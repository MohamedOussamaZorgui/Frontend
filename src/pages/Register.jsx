import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, BriefcaseMedical } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

/**
 * Composant de la page d'inscription
 */
const Register = () => {
    const navigate = useNavigate();

    // État gérant l'ensemble des champs du formulaire
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        role_id: '3' // Patient par défaut
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Liste des rôles disponibles pour la sélection
    const roles = [
        { id: '1', name: 'Administrateur' },
        { id: '2', name: 'Docteur' },
        { id: '3', name: 'Patient' },
        { id: '4', name: 'Responsable' }
    ];

    // Gestion de la création de compte
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Appel à l'API d'inscription
            await axios.post('http://localhost:5001/api/auth/register', formData);
            toast.success("Inscription réussie ! Vous pouvez vous connecter.");

            // Redirection vers la page de login
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            const message = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || "Une erreur est survenue lors de l'inscription.";
            toast.error(message);
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card" style={{ animation: 'fadeIn 0.8s ease-out' }}>
                <div className="auth-header">
                    <UserPlus size={48} className="auth-icon" />
                    <h2>Inscription</h2>
                    <p>Rejoignez notre plateforme médicale</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label><User size={18} /> Nom Complet</label>
                        <input
                            type="text"
                            placeholder="Jean Dupont"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label><Mail size={18} /> Email</label>
                        <input
                            type="email"
                            placeholder="jean@exemple.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label><Lock size={18} /> Mot de passe (min 6 car.)</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label><BriefcaseMedical size={18} /> Votre rôle</label>
                        <select
                            value={formData.role_id}
                            onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
                            className="role-select"
                        >
                            {roles.map(role => (
                                <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? "Création en cours..." : "Créer mon compte"}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Déjà inscrit ? <Link to="/login">Se connecter ici</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
