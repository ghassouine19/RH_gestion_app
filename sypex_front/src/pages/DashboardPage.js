import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Paper,
    Grid,
    useTheme,
    Button,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getDemandeByUserId, getUserById } from "../apiService/getElementApi";
import DemandeForm from "../componants/userComponant/DemandeForm";

// --- Helper functions ---
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
        return {};
    }
}

function extractUserId(payload) {
    return (
        payload.id ??
        payload.userId ??
        payload.uid ??
        (payload.sub && !isNaN(Number(payload.sub)) ? Number(payload.sub) : undefined)
    );
}

// --- New Components ---

const StatCard = ({ title, value, icon }) => {
    const theme = useTheme();
    return (
        <Paper sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            height: 160,
            justifyContent: 'space-between',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.4)',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)',
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <Typography variant="h6" color="text.secondary">{title}</Typography>
                {icon}
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{value}</Typography>
        </Paper>
    );
};

const LeaveTypeChart = ({ data }) => {
    const theme = useTheme();
    const COLORS = [theme.palette.primary.main, theme.palette.secondary.main, theme.palette.error.main, theme.palette.warning.main];

    const leaveTypeData = data.reduce((acc, demande) => {
        if (demande.statut === 'ACCEPTE') {
            const type = demande.type || 'N/A';
            const existingType = acc.find(item => item.name === type);
            if (existingType) {
                existingType.value += 1;
            } else {
                acc.push({ name: type, value: 1 });
            }
        }
        return acc;
    }, []);

    return (
        <Paper sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            height: 400,
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.4)',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)',
        }}>
            <Typography variant="h5" gutterBottom>
                Vacation Types
            </Typography>
            <ResponsiveContainer>
                <PieChart>
                    <Pie data={leaveTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={80} outerRadius={120} fill="#8884d8" paddingAngle={5} label>
                        {leaveTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </Paper>
    );
};


const DashboardPage = () => {
    const [user, setUser] = useState({ id: null, nom: "", prenom: "", email: "", role: "", statut: "", soldeConge: 0 });
    const [demandes, setDemandes] = useState([]);
    const [openForm, setOpenForm] = useState(false);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) return;
        const payload = parseJwt(token);
        const id = extractUserId(payload);
        if (id) {
            setUser((prev) => ({ ...prev, id }));
        }
    }, [token]);

    useEffect(() => {
        if (user.id) {
            getUserById(user.id)
                .then((u) => setUser(u))
                .catch((err) => console.error("Erreur user:", err));
            getDemandeByUserId(user.id)
                .then((d) => setDemandes(d))
                .catch((err) => console.error("Erreur demandes:", err));
        }
    }, [user.id]);

    const handleAddDemande = (newDemande) => {
        setDemandes(prev => [...prev, newDemande]);
    };

    const approvedDemandes = demandes.filter(d => d.statut === 'ACCEPTE');
    const daysTaken = approvedDemandes.reduce((acc, d) => {
        const start = new Date(d.dateDebut);
        const end = new Date(d.dateFin);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return acc + diffDays;
    }, 0);

    const remainingBalance = user.soldeConge - daysTaken;

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Welcome, {user.prenom} {user.nom}
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddCircleIcon />}
                    onClick={() => setOpenForm(true)}
                >
                    New Request
                </Button>
            </Box>
            <Grid container spacing={4}>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard title="Remaining Vacation Balance" value={`${remainingBalance} days`} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard title="Days of Vacation Taken" value={`${daysTaken} days`} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard title="Pending Requests" value={demandes.filter(d => d.statut === 'EN_ATTENTE').length} />
                </Grid>
                <Grid item xs={12}>
                    <LeaveTypeChart data={demandes} />
                </Grid>
            </Grid>
            <DemandeForm
                isOpen={openForm}
                onClose={() => setOpenForm(false)}
                onAddDemande={handleAddDemande}
            />
        </Box>
    );
};

export default DashboardPage;
