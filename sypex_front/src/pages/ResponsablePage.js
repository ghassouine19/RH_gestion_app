import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Button, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import './responsablePage.css';
import { getAllDemandes } from "../apiService/getElementApi";
import { updateDemande } from "../apiService/UpdateElementApi";

const ResponsablePage = () => {
    const [demandes, setDemandes] = useState([]);
    const [message, setMessage] = useState("");

    const loadDemandes = async () => {
        try {
            const data = await getAllDemandes();
            const enAttente = data.filter(d => d.statut === "EN_ATTENTE");
            setDemandes(enAttente);
        } catch (error) {
            console.error("❌ Erreur lors du chargement des demandes :", error);
        }
    };

    useEffect(() => {
        loadDemandes();
    }, []);

    // Ici on envoie la chaîne JSON directement
    const handleValider = async (id) => {
        try {
            await updateDemande("ACCEPTE", id);
            setMessage("Demande validée avec succès.");
            loadDemandes();
        } catch (error) {
            console.error("Erreur lors de la validation :", error);
        }
    };

    const handleRejeter = async (id) => {
        try {
            await updateDemande("REFUSE", id);
            setMessage("Demande rejetée.");
            loadDemandes();
        } catch (error) {
            console.error("Erreur lors du rejet :", error);
        }
    };

    return (
        <Container maxWidth="md" className="resp-container">
            <Typography variant="h4" gutterBottom className="resp-title">
                Tableau de bord du Responsable
            </Typography>

            {message && (
                <Typography variant="body1" className="resp-message">
                    {message}
                </Typography>
            )}

            <Box className="resp-table-container">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Type</TableCell>
                            <TableCell>Date début</TableCell>
                            <TableCell>Date fin</TableCell>
                            <TableCell>Motif</TableCell>
                            <TableCell>Utilisateur</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {demandes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    Aucune demande en attente.
                                </TableCell>
                            </TableRow>
                        ) : (
                            demandes.map((demande) => (
                                <TableRow key={demande.id}>
                                    <TableCell>{demande.type}</TableCell>
                                    <TableCell>{demande.dateDebut.split('T')[0]}</TableCell>
                                    <TableCell>{demande.dateFin.split('T')[0]}</TableCell>
                                    <TableCell>{demande.motif}</TableCell>
                                    <TableCell>TEST</TableCell>
                                    <TableCell className="resp-actions-cell">
                                        <Button
                                            variant="contained"
                                            color="success"
                                            size="small"
                                            startIcon={<CheckCircleIcon />}
                                            onClick={() => handleValider(demande.id)}
                                        >
                                            Valider
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            startIcon={<CancelIcon />}
                                            onClick={() => handleRejeter(demande.id)}
                                            className="resp-reject-btn"
                                        >
                                            Rejeter
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Box>
        </Container>
    );
};

export default ResponsablePage;
