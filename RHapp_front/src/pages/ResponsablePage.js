import React, { useState, useEffect } from "react";
import {
    Container,
    Typography,
    Box,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import "./responsablePage.css";
import { updateDemande } from "../apiService/UpdateElementApi";
import { getAllDemandes, getDemandesForResponsable } from "../apiService/getElementApi";

// --- decode JWT
function parseJwt(token) {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
        const jsonPayload = decodeURIComponent(
            atob(padded)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("parseJwt error:", e);
        return {};
    }
}

function extractRole(payload) {
    let role =
        payload.role ||
        (Array.isArray(payload.roles) && payload.roles[0]) ||
        (Array.isArray(payload.authorities) && payload.authorities[0]) ||
        payload.scope;
    if (Array.isArray(role)) role = role[0];
    if (typeof role === "string" && role.startsWith("ROLE_")) role = role.replace("ROLE_", "");
    return role;
}

function extractUserId(payload) {
    return (
        payload.id ??
        payload.userId ??
        payload.uid ??
        (payload.sub && !isNaN(Number(payload.sub)) ? Number(payload.sub) : undefined)
    );
}

const ResponsablePage = () => {
    const [demandes, setDemandes] = useState([]);
    const [message, setMessage] = useState("");
    const [role, setRole] = useState("");
    const [responsableId, setResponsableId] = useState(null);

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) return;
        const payload = parseJwt(token);
        const r = extractRole(payload);
        const id = extractUserId(payload);

        setRole(r || "");
        if (id) {
            setResponsableId(id);
            localStorage.setItem("userId", String(id));
        }
    }, [token]);

    const loadDemandes = async () => {
        try {
            let data = [];
            if (role === "ADMIN") {
                data = await getAllDemandes();
            } else if (role === "RESPONSABLE" && responsableId) {
                data = await getDemandesForResponsable(responsableId);
            } else return;

            const enAttente = Array.isArray(data)
                ? data.filter((d) => d.statut === "EN_ATTENTE")
                : [];
            setDemandes(enAttente);
        } catch (error) {
            console.error("Erreur chargement demandes :", error);
        }
    };

    useEffect(() => {
        if (role === "ADMIN" || (role === "RESPONSABLE" && responsableId)) {
            loadDemandes();
        }
    }, [role, responsableId]);

    const handleValider = async (id) => {
        try {
            await updateDemande("ACCEPTE", id, token);
            setMessage("Demande validée avec succès.");
            loadDemandes();
        } catch (error) {
            console.error("Erreur validation :", error);
        }
    };

    const handleRejeter = async (id) => {
        try {
            await updateDemande("REFUSE", id, token);
            setMessage("Demande rejetée.");
            loadDemandes();
        } catch (error) {
            console.error("Erreur rejet :", error);
        }
    };

    return (
        <Container maxWidth="lg" className="resp-container">
            <Typography variant="h4" gutterBottom className="resp-title">
                Tableau de bord du Responsable
            </Typography>

            {message && (
                <Typography variant="body1" className="resp-message">
                    {message}
                </Typography>
            )}

            <Paper className="resp-table-wrapper" elevation={3}>
                <Table>
                    <TableHead className="resp-table-head">
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
                                <TableRow key={demande.id} className="resp-table-row">
                                    <TableCell>{demande.type}</TableCell>
                                    <TableCell>{demande.dateDebut?.split("T")[0]}</TableCell>
                                    <TableCell>{demande.dateFin?.split("T")[0]}</TableCell>
                                    <TableCell>{demande.motif}</TableCell>
                                    <TableCell>
                                        {(demande.user?.nom || demande.nomUser) +
                                            " " +
                                            (demande.user?.prenom || demande.prenomUser)}
                                    </TableCell>
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
            </Paper>
        </Container>
    );
};

export default ResponsablePage;
