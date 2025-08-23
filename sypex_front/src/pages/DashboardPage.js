import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Typography,
    Paper,
    Grid,
    Divider,
} from "@mui/material";
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import WorkIcon from "@mui/icons-material/Work";
import EventIcon from "@mui/icons-material/Event";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DemandeForm from "../componants/userComponant/DemandeForm";
import { getDemandeByUserId, getUserById } from "../apiService/getElementApi";
import "./dashboardPage.css";

// --- Enum des statuts
const StatutDemande = {
    EN_ATTENTE: "EN_ATTENTE",
    ACCEPTE: "ACCEPTE",
    REFUSE: "REFUSE",
};

// --- util: decode JWT
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
    if (typeof role === "string" && role.startsWith("ROLE_")) {
        role = role.replace("ROLE_", "");
    }
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

function formatDate(dateString) {
    if (!dateString) return "";
    const options = { day: "numeric", month: "long", year: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", options);
}

const DashboardPage = () => {
    const [user, setUser] = useState({ id: null, nom: "",prenom: "", email: "", role: "", statut: "", soldeConge: null });
    const [demandes, setDemandes] = useState([]);
    const [openForm, setOpenForm] = useState(false);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) return;
        const payload = parseJwt(token);
        const id = extractUserId(payload);
        const role = extractRole(payload);
        if (id) {
            setUser((prev) => ({ ...prev, id, role }));
            localStorage.setItem("userId", String(id));
        }
    }, [token]);

    useEffect(() => {
        if (user.id) {
            getUserById(user.id)
                .then((u) =>
                    setUser((prev) => ({
                        ...prev,
                        nom: u.nom,
                        prenom: u.prenom,
                        email: u.email,
                        statut: u.statut,
                        soldeConge: u.soldeConge,
                    }))
                )
                .catch((err) => console.error("Erreur user:", err));
        }
    }, [user.id]);

    useEffect(() => {
        if (user.id) fetchDemandes(user.id);
    }, [user.id]);

    const fetchDemandes = async (id) => {
        try {
            const data = await getDemandeByUserId(id);
            setDemandes(data);
        } catch (error) {
            console.error("Erreur chargement demandes :", error);
        }
    };

    // --- rendu du statut
    const renderStatut = (statut) => {
        switch (statut) {
            case StatutDemande.ACCEPTE:
                return (
                    <span className="status-approved">
                        <CheckCircleIcon /> Statut : {statut}
                    </span>
                );
            case StatutDemande.REFUSE:
                return (
                    <span className="status-refused">
                        <PendingActionsIcon /> Statut : {statut}
                    </span>
                );
            case StatutDemande.EN_ATTENTE:
            default:
                return (
                    <span className="status-pending">
                        <PendingActionsIcon /> Statut : {statut}
                    </span>
                );
        }
    };

    return (
        <Box className="dashboard-container">
            <Grid container spacing={4}>
                {/* Profil utilisateur */}
                <Grid item xs={12} md={4}>
                    <Paper className="user-card">
                        <Typography variant="h5" gutterBottom>
                            Profil utilisateur
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <div className="user-info">
                            <PersonIcon className="icon" />
                            <span>{user.nom || "Chargement..."} {user.prenom}</span>
                        </div>
                        <div className="user-info">
                            <EmailIcon className="icon" />
                            <span>{user.email || "Chargement..."}</span>
                        </div>
                        <div className="user-info">
                            <WorkIcon className="icon" />
                            <span>{user.role || "Chargement..."}</span>
                        </div>
                        <div className="user-info">
                            <EditCalendarIcon className="icon" />
                            <span>{user.soldeConge || "Chargement..."} jours</span>
                        </div>
                    </Paper>
                </Grid>

                {/* Demandes */}
                <Grid item xs={12} md={8}>
                    <Paper className="demande-card">
                        <Box className="demande-header">
                            <Typography variant="h5">Mes demandes de congés</Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddCircleIcon />}
                                onClick={() => setOpenForm(true)}
                            >
                                Nouvelle demande
                            </Button>
                        </Box>
                        <Divider sx={{ mb: 2 }} />

                        {demandes.length === 0 ? (
                            <Typography>Aucune demande enregistrée.</Typography>
                        ) : (
                            <List className="demande-list">
                                {demandes.map((c) => (
                                    <ListItem key={c.id} divider className="demande-item">
                                        <ListItemIcon>
                                            <EventIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={`${c.type} du ${formatDate(
                                                c.dateDebut
                                            )} au ${formatDate(c.dateFin)}`}
                                            secondary={renderStatut(c.statut)}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            {openForm && (
                <DemandeForm
                    isOpen={openForm}
                    onClose={() => {
                        setOpenForm(false);
                        if (user.id) fetchDemandes(user.id);
                    }}
                />
            )}
        </Box>
    );
};

export default DashboardPage;
