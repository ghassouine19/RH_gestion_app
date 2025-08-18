import React, { useState } from "react";
import "./demandeForm.css";
import { addDemande } from "../../apiService/addElementApi";

const DemandeForm = ({ isOpen, onClose, onAddDemande }) => {
    const [formData, setFormData] = useState({
        type: "",
        dateDebut: "",
        dateFin: "",
        motif: "",
        statut: "",
        commentaire: "",
        dateCreation: "",
        dateDecision: ""
        // idUser: ""
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            type: formData.type,
            dateDebut: `${formData.dateDebut}T00:00:00`,
            dateFin: `${formData.dateFin}T00:00:00`,
            motif: formData.motif || "Demande depuis formulaire",
            statut: "EN_ATTENTE", // valeur par défaut
            commentaire: formData.commentaire || "",
            dateCreation: new Date().toISOString().slice(0, 19),
            dateDecision: null,
            idUser: 1 //test
        };

        try {
            const response = await addDemande(payload);
            if (response) {
                console.log("Demande ajoutée avec succès");
                onAddDemande && onAddDemande(response);
                onClose();
            } else {
                console.log("Erreur lors de l'ajout");
            }
        } catch (error) {
            console.error("Erreur dans l'ajout:", error);
        }
    };

    return (
        <div className="overlay">
            <div className="popup">
                <h2>Nouvelle demande de congé</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Type de congé :
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                        >
                            <option value="">--Choisir--</option>
                            <option value="ANNUEL">Congé annuel</option>
                            <option value="MALADIE">Congé maladie</option>
                            <option value="EXCEPTIONNEL">Congé exceptionnel</option>
                        </select>
                    </label>
                    <br />
                    <label>
                        Date début :
                        <input
                            type="date"
                            name="dateDebut"
                            value={formData.dateDebut}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Date fin :
                        <input
                            type="date"
                            name="dateFin"
                            value={formData.dateFin}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Commentaire :
                        <textarea
                            name="commentaire"
                            value={formData.commentaire}
                            onChange={handleChange}
                        />
                    </label>
                    <br />
                    <br />
                    <button type="submit">Ajouter</button>
                    <button type="button" onClick={onClose} className="btn-annuler">
                        Annuler
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DemandeForm;
