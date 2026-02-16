# 💻 MedManager - Frontend App (React/Vite)

Une interface moderne, réactive et élégante pour la gestion des données médicales.

---

## 🎨 Design & Expérience Utilisateur

L'interface a été conçue pour être **ultra-moderne** :
-   **Design System** : Utilisation de la police *Outfit* et d'une palette de couleurs harmonieuse.
-   **Aesthetics** : Effets de *Glassmorphism*, ombres subtiles et micro-animations.
-   **Notifications** : Intégration de `react-hot-toast` pour des retours utilisateurs élégants.
-   **Icons** : Utilisation de la bibliothèque `lucide-react`.

---

## 🏗️ Architecture du Frontend

-   **`src/pages/`** : Pages principales de l'application (Login, Register, Dashboard).
-   **`src/assets/`** : Ressources statiques (images, logo).
-   **`src/App.jsx`** : Gestion centrale du routage avec `react-router-dom`.
-   **`src/index.css`** : Design system global et variables CSS.

---

## 🔑 Comptes de Test

| Rôle | Email | Mot de passe |
| :--- | :--- | :--- |
| **Administrateur** | `admin@medmanager.com` | `admin123` |
| **Patient** | `patient@test.com` | `password123` |

---

## ⚙️ Installation

1. Accédez au dossier :
   ```bash
   cd Frontend
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```

---

## 🏃 Lancement

```bash
# Démarrer le serveur de développement (Vite)
npm run dev
```
L'application sera accessible sur `http://localhost:5173`.

---

## 🔒 Routes Protégées

Le frontend gère la sécurité de manière intelligente :
-   Vérification de la présence du **Token JWT** avant d'accéder au Dashboard.
-   Redirection automatique vers `/login` si l'utilisateur n'est pas authentifié.
-   Affichage conditionnel des boutons d'action (Suppression/Statut) basé sur le rôle stocké dans le profil.
