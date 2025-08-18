import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    List,
    ListItem,
    ListItemText,
    Typography,
} from "@mui/material";
import DemandeForm from "../componants/userComponant/DemandeForm";
import { getAllDemandes } from "../apiService/getElementApi";

const DashboardPage = () => {
    const [user] = useState({
        name: localStorage.getItem("username") || "Employé Test",
        email: localStorage.getItem("email") || "employe@example.com",
        role: localStorage.getItem("role") || "EMPLOYE",
    });

    const [demandes, setDemandes] = useState([]);
    const [openForm, setOpenForm] = useState(false);

    useEffect(() => {
        console.log("Utilisateur connecté :", user);
        console.log("Rôle actuel :", user.role);
    }, [user]);

    // Charger toutes les demandes
    useEffect(() => {
        const fetchDemandes = async () => {
            try {
                const data = await getAllDemandes();
                setDemandes(data);
            } catch (error) {
                console.error("Erreur lors du chargement des demandes :", error);
            }
        };
        fetchDemandes();
    }, []);

    // Ajouter une nouvelle demande
    const handleAddDemande = (nouvelleDemande) => {
        setDemandes((prev) => [...prev, nouvelleDemande]);
    };

    return (
        <>
            <Box sx={{ padding: 4 }}>
                {/* Informations utilisateur */}
                <Typography variant="h4" gutterBottom>
                    Bonjour, {user.name}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Email : {user.email}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                    Rôle : <strong>{user.role}</strong>
                </Typography>

                {/* Liste des demandes */}
                <Box sx={{ marginTop: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Vos demandes de congés
                    </Typography>

                    {demandes.length === 0 ? (
                        <Typography>Aucune demande enregistrée.</Typography>
                    ) : (
                        <List>
                            {demandes.map((c) => (
                                <ListItem key={c.id} divider>
                                    <ListItemText
                                        primary={`${c.type} du ${c.dateDebut} au ${c.dateFin}`}
                                        secondary={`Statut : ${c.status}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}

                    {/* Bouton pour ajouter une demande */}
                    <Button
                        variant="contained"
                        sx={{ marginTop: 3 }}
                        onClick={() => setOpenForm(true)}
                    >
                        Nouvelle demande de congé
                    </Button>
                </Box>
            </Box>

            {/* Formulaire d'ajout de demande */}
            {openForm && (
                <DemandeForm
                    isOpen={openForm}
                    onClose={() => setOpenForm(false)}
                    onAddDemande={handleAddDemande}
                />
            )}
        </>
    );
};

export default DashboardPage;
