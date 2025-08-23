import React, { useState } from "react";
import "./addUserForm.css";

const ROLES = ["RESPONSABLE", "ADMIN", "EMPLOYE"];

const AddUserForm = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        email: "",
        password: "",
        role: "",
        soldeConge: 0,
        responsableId: ""
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "soldeConge" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation simple
        if (
            !formData.nom ||
            !formData.prenom ||
            !formData.email ||
            !formData.password ||
            !formData.role ||
            (formData.role === "EMPLOYE" && !formData.responsableId)
        ) {
            alert("Veuillez remplir tous les champs obligatoires.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nom: formData.nom,
                    prenom: formData.prenom,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                    soldeConge: formData.soldeConge,
                    responsableId: formData.role === "EMPLOYE" ? formData.responsableId : null,
                }),
            });

            const data = await response.json();
            console.log("Réponse backend register:", data);

            if (!response.ok) {
                alert("Erreur inscription : " + (data.message || JSON.stringify(data)));
                return;
            }

            alert("Utilisateur ajouté avec succès !");
            setFormData({
                nom: "",
                prenom: "",
                email: "",
                password: "",
                role: "",
                soldeConge: 0,
                responsableId: "",
            });
            onClose();

        } catch (error) {
            console.error("Erreur registration:", error);
            alert("Erreur lors de l'inscription. Veuillez réessayer.");
        }
    };

    return (
        <div className="adduser-overlay">
            <div className="adduser-popup">
                <h2>Ajouter un nouvel utilisateur</h2>
                <form onSubmit={handleSubmit}>
                    <div className="adduser-form-grid">

                        <label>
                            Nom :
                            <input type="text" name="nom" value={formData.nom} onChange={handleChange} required />
                        </label>

                        <label>
                            Prénom :
                            <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} required />
                        </label>

                        <label>
                            Email :
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                        </label>

                        <label>
                            Mot de passe :
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                        </label>

                        <label>
                            Rôle :
                            <select name="role" value={formData.role} onChange={handleChange} required>
                                <option value="">--Choisir un rôle--</option>
                                {ROLES.map(role => (
                                    <option key={role} value={role}>{role}</option>
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
                            <input type="number" name="soldeConge" value={formData.soldeConge} onChange={handleChange} min={0} />
                        </label>
                    </div>

                    <div className="adduser-buttons">
                        <button type="submit">Ajouter</button>
                        <button type="button" onClick={onClose} className="btn-annuler">Annuler</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUserForm;
