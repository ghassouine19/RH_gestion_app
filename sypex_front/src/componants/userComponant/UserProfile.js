import React, {useEffect, useState} from "react";
import "./userProfile.css";
import img from "./profilImg.jpg";
import { DataGrid } from "@mui/x-data-grid";
import EditProfileForm from "./EditProfileForm";
import {getDemandeByUserId, getUserById} from "../../apiService/getElementApi";

const UserProfile = ({ user}) => {

    const [userData, setUserData] = useState(null);

    const [demandes, setDemandes] = useState([]);

    const [showEditPopup, setShowEditPopup] = useState(false);

    useEffect(()=>{
            const chargerDataUser= async ()=>{
                try {
                    const data = await getUserById();
                    setUserData(data);
                    console.log(data.id);
                    const rows = await getDemandeByUserId(data.id);
                    setDemandes(rows);
                    console.log("demandes:",rows);
                } catch (err) {
                    console.log(err.message)
                }
            };
            chargerDataUser();
        },
        []);


    const columns = [
        {
            field : "id" ,
            headerName : "Id Demande" ,
            width : 100
        },

        {
            field : "dateDebut" ,
            headerName : "Date de debut" ,
            width : 150
        },

        {field : "dateFin" ,
            headerName : "Date Fin" ,
            width : 150
        },

        {
            field : "dateCreation" ,
            headerName : "Date de Creation" ,
            width : 150
        },

        {field : "dateDecision" ,
            headerName : "Date de decision" ,
            width : 150
        },

        {
            field : "motif" ,
            headerName : "motif" ,
            width : 150
        },

        {
            field: "statut",
            headerName: "Statut",
            width: 150
        },
        {
            field: "type",
            headerName: "Type",
            width: 150
        },
        {
            field : "commentaire" ,
            headerName : "Commentaire" ,
            width : 100
        }


    ];

    if (!userData) {
        return (
            <div>
                <p>chargement de la page...</p>
            </div>
        );
    }
    return (
        <div className="profile-container">

            <div className="profile-header">
                <div className="profile-photo">
                    <img src={img} alt="Profil" />
                </div>
                <div className="profile-info">
                    <h2>{userData.nom} {userData.prenom}</h2>
                    <p><strong>Email :</strong>{userData.email} </p>
                    <p><strong>Telephone :</strong>{userData.telephone}</p>
                    <p><strong>ID :</strong>{userData.id} </p>
                    <p><strong>Rôle :</strong>{userData.role}</p>
                </div>
                <div className="form-button-container">
                    <button className="form-button-submit" onClick={() => setShowEditPopup(true)}>
                        Modifier mes informations
                    </button>
                </div>
            </div>

            <div className="reservation-history">
                <h3>Historique des Réservations</h3>

                <div style={{ height: 500, width: '100%' }}>
                    <DataGrid rows={demandes} columns={columns} />
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
