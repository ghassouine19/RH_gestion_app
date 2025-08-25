import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { changePasswordApi } from "../../apiService/UpdateElementApi";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "./editProfileForm.css";
import { Box } from "@mui/material";

const EditProfileForm = ({ onClose }) => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
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

    const toggleCurrentPassword = () => setShowCurrentPassword(!showCurrentPassword);
    const toggleNewPassword = () => setShowNewPassword(!showNewPassword);

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
                error.response?.data?.message || "Erreur lors du changement de mot de passe.";
            setMessage(errMsg);
        }
    };

    const handleClose = () => {
        setCurrentPassword("");
        setNewPassword("");
        setMessage("");
        if (onClose) onClose();
    };

    return (
        <Box className="epf-wrapper">
            <form onSubmit={handleSubmit} className="epf-container">
                <h2 className="epf-title">Changer le mot de passe</h2>

                <label className="epf-label">Mot de passe actuel</label>
                <div className="epf-password-wrapper">
                    <input
                        type={showCurrentPassword ? "text" : "password"}
                        className="epf-input"
                        placeholder="Mot de passe actuel"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <span className="epf-eye" onClick={toggleCurrentPassword}>
                        {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                    </span>
                </div>

                <label className="epf-label">Nouveau mot de passe</label>
                <div className="epf-password-wrapper">
                    <input
                        type={showNewPassword ? "text" : "password"}
                        className="epf-input"
                        placeholder="Nouveau mot de passe"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <span className="epf-eye" onClick={toggleNewPassword}>
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </span>
                </div>

                <button type="submit" className="epf-button">Changer le mot de passe</button>
                <button type="button" onClick={handleClose} className="epf-button" style={{ marginTop: "10px" }}>
                    Annuler / Fermer
                </button>

                {message && <p className="epf-message">{message}</p>}
            </form>
        </Box>
    );
};

export default EditProfileForm;
