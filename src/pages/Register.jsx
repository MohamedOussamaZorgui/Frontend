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
    const [formErrors, setFormErrors] = useState({});

    // Liste des rôles disponibles pour la sélection
    const roles = [
        { id: '1', name: 'Administrateur' },
        { id: '2', name: 'Docteur' },
        { id: '3', name: 'Patient' },
        { id: '4', name: 'Responsable' }
    ];

    /**
     * Validation des champs en temps réel
     */
    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'fullName':
                if (value.trim().length < 3) {
                    error = 'Le nom doit contenir au moins 3 caractères';
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    error = 'Email invalide';
                }
                break;
            case 'password':
                if (value.length < 6) {
                    error = 'Le mot de passe doit contenir au moins 6 caractères';
                }
                break;
            default:
                break;
        }

        setFormErrors(prev => ({ ...prev, [name]: error }));
        return error === '';
    };

    /**
     * Gestion du changement de champ avec validation
     */
    const handleFieldChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
        validateField(name, value);
    };

    // Gestion de la création de compte
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation complète avant soumission
        const isFullNameValid = validateField('fullName', formData.fullName);
        const isEmailValid = validateField('email', formData.email);
        const isPasswordValid = validateField('password', formData.password);

        if (!isFullNameValid || !isEmailValid || !isPasswordValid) {
            toast.error("Veuillez corriger les erreurs dans le formulaire.");
            return;
        }

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
                        <label><User size={18} /> Nom Complet *</label>
                        <input
                            type="text"
                            placeholder="Jean Dupont"
                            value={formData.fullName}
                            onChange={(e) => handleFieldChange('fullName', e.target.value)}
                            onBlur={(e) => validateField('fullName', e.target.value)}
                            className={formErrors.fullName ? 'input-error' : ''}
                            required
                        />
                        {formErrors.fullName && <span className="field-error">{formErrors.fullName}</span>}
                    </div>

                    <div className="form-group">
                        <label><Mail size={18} /> Email *</label>
                        <input
                            type="email"
                            placeholder="jean@exemple.com"
                            value={formData.email}
                            onChange={(e) => handleFieldChange('email', e.target.value)}
                            onBlur={(e) => validateField('email', e.target.value)}
                            className={formErrors.email ? 'input-error' : ''}
                            required
                        />
                        {formErrors.email && <span className="field-error">{formErrors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label><Lock size={18} /> Mot de passe (min 6 car.) *</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => handleFieldChange('password', e.target.value)}
                            onBlur={(e) => validateField('password', e.target.value)}
                            className={formErrors.password ? 'input-error' : ''}
                            required
                        />
                        {formErrors.password && <span className="field-error">{formErrors.password}</span>}
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
