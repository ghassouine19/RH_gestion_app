import React, { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import { changePasswordApi } from "../../apiService/UpdateElementApi";
import "./editProfileForm.css";

const EditProfileForm = ({ onClose }) => { // Ajouter onClose si tu veux fermer une popup
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [idUser, setIdUser] = useState(null);

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const userId = decoded.id || decoded.userId || decoded.sub;
                setIdUser(userId);
            } catch (err) {
                console.error("Erreur décodage JWT :", err);
            }
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!idUser) {
            setMessage("Utilisateur introuvable. Veuillez vous reconnecter.");
            return;
        }
        if (!currentPassword || !newPassword) {
            setMessage("Veuillez remplir les deux champs.");
            return;
        }

        try {
            console.log("Envoi données :", { idUser, currentPassword, newPassword });
            await changePasswordApi(
                { idUser: Number(idUser), currentPassword, newPassword },
                token
            );
            setMessage("Mot de passe modifié avec succès !");
            setCurrentPassword("");
            setNewPassword("");
        } catch (error) {
            console.error(error);
            const errMsg =
                error.response?.data?.message ||
                "Erreur lors du changement de mot de passe.";
            setMessage(errMsg);
        }
    };

    const handleClose = () => {
        // Réinitialiser les champs et message
        setCurrentPassword("");
        setNewPassword("");
        setMessage("");
        if (onClose) onClose(); // Si le formulaire est dans une popup
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="password"
                placeholder="Mot de passe actuel"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="Nouveau mot de passe"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <div style={{ marginTop: "10px" }}>
                <button type="submit">Changer le mot de passe</button>
                <button type="button" onClick={handleClose} style={{ marginLeft: "10px" }}>
                    Annuler / Fermer
                </button>
            </div>
            {message && <p>{message}</p>}
        </form>
    );
};

export default EditProfileForm;
