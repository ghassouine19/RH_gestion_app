import React, { useEffect, useState, useRef } from "react";
import "./userProfile.css";
import img from "./profilImg.jpg"; // image par défaut
import { DataGrid } from "@mui/x-data-grid";
import EditProfileForm from "./EditProfileForm";
import { getDemandeByUserId, getUserById } from "../../apiService/getElementApi";
import { uploadUserPhoto } from "../../apiService/addElementApi";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../apiService/httpService";

const UserProfile = () => {
    const [userData, setUserData] = useState(null);
    const [demandes, setDemandes] = useState([]);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const fileInputRef = useRef(null);
    const { userId: userIdFromParams } = useParams();

    // Charger l'utilisateur et ses demandes
    useEffect(() => {
        const chargerDataUser = async () => {
            try {
                const userId = userIdFromParams || localStorage.getItem("userId");
                if (!userId) return console.error("Utilisateur non connecté !");

                const data = await getUserById(userId);

                // Si backend ne renvoie pas de photoUrl, on construit l'URL
                if (data.photo) {
                    data.photoUrl = `${BASE_URL}/users/${data.id}/photo`;
                }

                setUserData(data);

                let rows = await getDemandeByUserId(data.id);
                if (!Array.isArray(rows)) rows = [rows];

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
            } catch (err) {
                console.log(err.message);
            }
        };
        chargerDataUser();
    }, [userIdFromParams]);

    const handleImageClick = () => fileInputRef.current.click();

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file || !userData) return;

        try {
            await uploadUserPhoto(userData.id, file);
            // Met à jour la photo après upload
            setUserData({
                ...userData,
                photoUrl: `${BASE_URL}/users/${userData.id}/photo?${new Date().getTime()}`,
            });
        } catch (err) {
            console.error("Erreur lors de l'upload de la photo", err);
        }
    };

    const columns = [
        { field: "id", headerName: "Id Demande", width: 120 },
        { field: "dateDebut", headerName: "Date de début", width: 150 },
        { field: "dateFin", headerName: "Date Fin", width: 150 },
        { field: "dateCreation", headerName: "Date de Création", width: 160 },
        { field: "dateDecision", headerName: "Date de décision", width: 160 },
        { field: "motif", headerName: "Motif", width: 180 },
        { field: "statut", headerName: "Statut", width: 140 },
        { field: "type", headerName: "Type", width: 140 },
        { field: "commentaire", headerName: "Commentaire", width: 200 },
    ];

    if (!userData) return <p>Chargement de la page...</p>;

    const isOwnProfile = !userIdFromParams || userIdFromParams === localStorage.getItem("userId");


    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-photo">
                    <img
                        src={userData.photoUrl || img} // <-- utilise la photo backend si existe
                        alt="Profil"
                        onClick={isOwnProfile ? handleImageClick : null}
                        style={{ cursor: isOwnProfile ? "pointer" : "default" }}
                    />
                    {isOwnProfile && <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                        accept="image/*"
                    />}
                </div>
                <div className="profile-info">
                    <h2>{userData.nom} {userData.prenom}</h2>
                    <p><strong>Email :</strong> {userData.email}</p>
                    <p><strong>ID :</strong> {userData.id}</p>
                    <p><strong>Rôle :</strong> {userData.role}</p>
                </div>
                {isOwnProfile && <div className="form-button-container">
                    <button className="form-button-submit" onClick={() => setShowEditPopup(true)}>
                        Modifier mon password
                    </button>
                </div>}
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
