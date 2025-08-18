import React, { useState, useEffect } from "react";
import "./userProfile.css";

const EditProfileForm = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        email: "",
        password: "",
        role:"EMPLOYE",
    });

    useEffect(() => {
        if (user) {
            setFormData({
                nom: user.nom || "",
                email: user.email || "",
                password: "",
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="edit-profile-modal">
            <div className="form-personne-container">
                <div className="form-header">
                    <h2>Modifier le profil</h2>
                    <button className="form-close-button" onClick={onClose}>✕</button>
                </div>

                <form className="form-personne" onSubmit={handleSubmit}>
                    <input
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        placeholder="Nom"
                        required
                    />
                    <input
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleChange}
                        placeholder="Prenom"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Nouveau mot de passe"
                    />

                    <button className="form-button-submit" type="submit">
                        Enregistrer
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfileForm;
