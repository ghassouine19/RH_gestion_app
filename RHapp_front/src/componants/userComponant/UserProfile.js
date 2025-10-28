import React, { useEffect, useState, useRef } from "react";
import { DataGrid } from "@mui/x-data-grid";
import EditProfileForm from "./EditProfileForm";
import { getDemandeByUserId, getUserById } from "../../apiService/getElementApi";
import { uploadUserPhoto } from "../../apiService/addElementApi";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../apiService/httpService";
import { Avatar, Button, Card, CardContent, Grid, Typography, Box } from "@mui/material";
import img from "./profilImg.jpg"; // default image

const UserProfile = () => {
    const [userData, setUserData] = useState(null);
    const [demandes, setDemandes] = useState([]);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const fileInputRef = useRef(null);
    const { userId: userIdFromParams } = useParams();

    useEffect(() => {
        const chargerDataUser = async () => {
            try {
                const userId = userIdFromParams || localStorage.getItem("userId");
                if (!userId) return console.error("User not connected!");

                const data = await getUserById(userId);

                if (data.photo) {
                    data.photoUrl = `${BASE_URL}/api/users/${data.id}/photo`;
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
            setUserData({
                ...userData,
                photoUrl: `${BASE_URL}/api/users/${userData.id}/photo?${new Date().getTime()}`,
            });
        } catch (err) {
            console.error("Error uploading photo", err);
        }
    };

    const handleDownloadWorkCertificate = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/users/${userData.id}/work-certificate`);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `work_certificate_${userData.id}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error("Error downloading work certificate", error);
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

    if (!userData) return <p>Loading page...</p>;

    const isOwnProfile = !userIdFromParams || userIdFromParams === localStorage.getItem("userId");

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Avatar
                                    src={userData.photoUrl || img}
                                    sx={{ width: 150, height: 150, mb: 2, cursor: isOwnProfile ? 'pointer' : 'default' }}
                                    onClick={isOwnProfile ? handleImageClick : null}
                                />
                                {isOwnProfile && <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: "none" }}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                />}
                                <Typography variant="h5">{userData.nom} {userData.prenom}</Typography>
                                <Typography variant="body1">{userData.role}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>User Details</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}><Typography><strong>Email:</strong> {userData.email}</Typography></Grid>
                                <Grid item xs={12} sm={6}><Typography><strong>ID:</strong> {userData.id}</Typography></Grid>
                                <Grid item xs={12} sm={6}><Typography><strong>Vacation Balance:</strong> {userData.soldeConge}</Typography></Grid>
                                <Grid item xs={12} sm={6}><Typography><strong>CIN:</strong> {userData.cin}</Typography></Grid>
                                <Grid item xs={12} sm={6}><Typography><strong>CNSS:</strong> {userData.cnss}</Typography></Grid>
                                <Grid item xs={12} sm={6}><Typography><strong>RIB:</strong> {userData.rib}</Typography></Grid>
                                <Grid item xs={12} sm={6}><Typography><strong>Date of Birth:</strong> {userData.dateNaissance}</Typography></Grid>
                                <Grid item xs={12} sm={6}><Typography><strong>Start Date:</strong> {userData.dateEntree}</Typography></Grid>
                                <Grid item xs={12} sm={6}><Typography><strong>End Date:</strong> {userData.dateSortie}</Typography></Grid>
                            </Grid>
                            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                                {isOwnProfile && (
                                    <Button variant="contained" onClick={() => setShowEditPopup(true)}>
                                        Edit Password
                                    </Button>
                                )}
                                {userData.document && (
                                    <Button variant="outlined" href={`${BASE_URL}/api/users/${userData.id}/document`} target="_blank" rel="noopener noreferrer">
                                        Download Document
                                    </Button>
                                )}
                                <Button variant="contained" color="secondary" onClick={handleDownloadWorkCertificate}>
                                    Generate Work Certificate
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Request History</Typography>
                            <Box sx={{ height: 500, width: '100%', mt: 2 }}>
                                <DataGrid
                                    rows={demandes}
                                    columns={columns}
                                    pageSize={5}
                                    rowsPerPageOptions={[5, 10, 20]}
                                    disableSelectionOnClick
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

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
        </Box>
    );
};

export default UserProfile;
