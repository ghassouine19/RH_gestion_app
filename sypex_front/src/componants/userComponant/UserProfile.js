import React, { useEffect, useState } from "react";
import "./userProfile.css";
import img from "./profilImg.jpg";
import { DataGrid } from "@mui/x-data-grid";
import EditProfileForm from "./EditProfileForm";
import { getDemandeByUserId, getUserById } from "../../apiService/getElementApi";

const UserProfile = () => {
    const [userData, setUserData] = useState(null);
    const [demandes, setDemandes] = useState([]);
    const [showEditPopup, setShowEditPopup] = useState(false);

    useEffect(() => {
        const chargerDataUser = async () => {
            try {
                const userId = localStorage.getItem("userId");
                if (!userId) {
                    console.error("Utilisateur non connecté !");
                    return;
                }

                // Récupérer l'utilisateur
                const data = await getUserById(userId);
                setUserData(data);

                // Récupérer ses demandes
                let rows = await getDemandeByUserId(data.id);

                // Si l'API renvoie un seul objet, on le met dans un tableau
                if (!Array.isArray(rows)) {
                    rows = [rows];
                }

                // Formater les demandes
                const formattedRows = rows.map((demande, index) => ({
                    id: demande.id || index + 1,
                    dateDebut: demande.dateDebut,
                    dateFin: demande.dateFin,
                    dateCreation: demande.dateCreation,
                    dateDecision: demande.dateDecision,
                    motif: demande.motif,
                    statut: demande.statut,
                    type: demande.type,
                    commentaire: demande.commentaire,
                }));

                setDemandes(formattedRows);
                console.log("Demandes formatées:", formattedRows);
            } catch (err) {
                console.log(err.message);
            }
        };
        chargerDataUser();
    }, []);


    const columns = [
        { field: "id", headerName: "Id Demande", width: 120 },
        { field: "dateDebut", headerName: "Date de début", width: 150 },
        { field: "dateFin", headerName: "Date Fin", width: 150 },
        { field: "dateCreation", headerName: "Date de Création", width: 160 },
        { field: "dateDecision", headerName: "Date de décision", width: 160 },
        { field: "motif", headerName: "Motif", width: 180 },
        { field: "statut", headerName: "Statut", width: 140 },
        { field: "type", headerName: "Type", width: 140 },
        { field: "commentaire", headerName: "Commentaire", width: 200 }
    ];

    if (!userData) {
        return <p>Chargement de la page...</p>;
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-photo">
                    <img src={img} alt="Profil" />
                </div>
                <div className="profile-info">
                    <h2>{userData.nom} {userData.prenom}</h2>
                    <p><strong>Email :</strong> {userData.email}</p>
                    <p><strong>ID :</strong> {userData.id}</p>
                    <p><strong>Rôle :</strong> {userData.role}</p>
                </div>
                <div className="form-button-container">
                    <button className="form-button-submit" onClick={() => setShowEditPopup(true)}>
                        Modifier mes informations
                    </button>
                </div>
            </div>

            <div className="reservation-history">
                <h3>Historique des demandes</h3>
                <div style={{ height: 500, width: "100%" }}>
                    <DataGrid
                        rows={demandes}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5, 10, 20]}
                        disableSelectionOnClick
                    />
                </div>
            </div>

            {showEditPopup && (
                <div className="modal-overlay">
                    <EditProfileForm
                        user={userData}
                        onClose={() => setShowEditPopup(false)}
                        onSave={(updatedData) => {
                            setUserData(updatedData);
                            setShowEditPopup(false);
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default UserProfile;
