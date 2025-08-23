import React, { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import "./addUserForm.css";
import { updateUser } from "../../apiService/UpdateElementApi";

const ROLES = ["RESPONSABLE", "ADMIN", "EMPLOYE"];

const UpdateUserForm = ({ isOpen, onClose, user }) => {
    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        email: "",
        role: "",
        soldeConge: 0,
        responsableId: ""
    });
    const [idUser, setIdUser] = useState(null);

    const token = localStorage.getItem("token");

    // Extraire l'ID depuis le JWT
    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setIdUser(decoded.id || decoded.userId || decoded.sub);
            } catch (err) {
                console.error("Erreur décodage JWT :", err);
            }
        }
    }, [token]);

    // Charger les données du user reçu en props
    useEffect(() => {
        if (user) {
            setFormData({
                nom: user.nom || "",
                prenom: user.prenom || "",
                email: user.email || "",
                role: user.role || "",
                soldeConge: user.soldeConge || 0,
                responsableId: user.responsable ? user.responsable.id : ""
            });
        }
    }, [user]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "soldeConge" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.nom ||
            !formData.prenom ||
            !formData.email ||
            !formData.role ||
            (formData.role === "EMPLOYE" && !formData.responsableId)
        ) {
            alert("Veuillez remplir tous les champs obligatoires.");
            return;
        }

        try {
            const userId = user?.id || idUser;
            const payload = {
                nom: formData.nom,
                prenom: formData.prenom,
                email: formData.email,
                role: formData.role,
                soldeConge: formData.soldeConge,
                responsableId: formData.role === "EMPLOYE" ? formData.responsableId : null,
            };

            const data = await updateUser(userId,payload);
            console.log("Réponse backend update:", data);

            alert("Utilisateur mis à jour avec succès !");
            onClose();

        } catch (error) {
            console.error("Erreur update:", error);
            alert("Erreur lors de la mise à jour. Veuillez réessayer.");
        }
    };

    return (
        <div className="adduser-overlay">
            <div className="adduser-popup">
                <h2>Modifier l'utilisateur</h2>
                <form onSubmit={handleSubmit}>
                    <div className="adduser-form-grid">

                        <label>
                            Nom :
                            <input
                                type="text"
                                name="nom"
                                value={formData.nom}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label>
                            Prénom :
                            <input
                                type="text"
                                name="prenom"
                                value={formData.prenom}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label>
                            Email :
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label>
                            Rôle :
                            <select name="role" value={formData.role} onChange={handleChange} required>
                                <option value="">--Choisir un rôle--</option>
                                {ROLES.map((role) => (
                                    <option key={role} value={role}>
                                        {role}
                                    </option>
                                ))}
                            </select>
                        </label>

                        {formData.role === "EMPLOYE" && (
                            <label>
                                ID du Responsable :
                                <input
                                    type="number"
                                    name="responsableId"
                                    value={formData.responsableId}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                        )}

                        <label>
                            Solde de congés :
                            <input
                                type="number"
                                name="soldeConge"
                                value={formData.soldeConge}
                                onChange={handleChange}
                                min={0}
                            />
                        </label>
                    </div>

                    <div className="adduser-buttons">
                        <button type="submit">Mettre à jour</button>
                        <button type="button" onClick={onClose} className="btn-annuler">
                            Annuler
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateUserForm;
