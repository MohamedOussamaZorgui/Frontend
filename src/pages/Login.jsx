import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, UserCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

/**
 * Composant de la page de connexion
 */
const Login = () => {
    const navigate = useNavigate();

    // États pour le formulaire et le chargement
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Gestion de la soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Appel API pour la connexion
            const response = await axios.post('http://localhost:5001/api/auth/login', {
                email,
                password
            });
            console.log("Connexion réussie :", response.data);

            // Sauvegarde sécurisée du token et des informations utilisateur
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            toast.success("Connexion réussie !");

            // Redirection vers le dashboard après un court délai
            setTimeout(() => navigate('/dashboard'), 1000);
        } catch (err) {
            const status = err.response?.status;
            const message = err.response?.data?.message || "Erreur de connexion.";

            if (status === 400) {
                toast.error("Identifiants incorrects. Veuillez vérifier votre email et mot de passe.");
            } else if (status === 403) {
                toast.error("Compte inactif. Veuillez contacter un administrateur.");
            } else {
                toast.error(message);
            }
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            {/* Carte de connexion avec animation d'entrée */}
            <div className="auth-card" style={{ animation: 'fadeIn 0.8s ease-out' }}>
                <div className="auth-header">
                    <UserCircle size={64} className="auth-icon" />
                    <h2>Connexion</h2>
                    <p>Accédez à votre espace médical</p>
                </div>

                {/* Affichage des messages d'erreur si présents */}
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label><Mail size={18} /> Email</label>
                        <input
                            type="email"
                            placeholder="exemple@medical.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label><Lock size={18} /> Mot de passe</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? "Connexion en cours..." : "Se connecter"}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Vous n'avez pas de compte ? <Link to="/register">S'inscrire ici</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
