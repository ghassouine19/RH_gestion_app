import React, { useState } from "react";
import {
    Container,
    Typography,
    Box,
    Button,
    Paper,
    Grid,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import TimelineIcon from "@mui/icons-material/Timeline";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { useNavigate } from "react-router-dom";
import "./homePage.css";

const HomePage = () => {
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleLoginClick = () => {
        setMessage("Redirection vers la page de connexion...");
        setTimeout(() => {
            navigate("/login");
        }, 800);
    };

    return (
        <Container maxWidth="lg" className="homepage-container">
            {/* Section Hero */}
            <Paper elevation={6} className="hero-card">
                <Typography variant="h3" className="hero-title">Bienvenue sur <span className="brand">RHapp Gestion Congés</span></Typography>
                <Typography variant="h6" className="hero-subtitle">
                    Gérez facilement vos congés et absences en ligne, avec rapidité et
                    simplicité.
                </Typography>

                <Button
                    variant="contained"
                    size="large"
                    startIcon={<LoginIcon />}
                    onClick={handleLoginClick}
                    className="login-button"
                >
                    Se connecter
                </Button>

                {message && (
                    <Typography variant="body1" className="login-message">
                        {message}
                    </Typography>
                )}
            </Paper>

            {/* Section Fonctionnalités */}
            <Box className="features-section">
                <Typography variant="h5" gutterBottom className="features-title">
                    Fonctionnalités clés
                </Typography>

                <Grid container spacing={3} justifyContent="center">
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper className="feature-card" elevation={3}>
                            <CheckCircleOutlineIcon className="feature-icon" />
                            <Typography variant="h6">Demande & Suivi</Typography>
                            <Typography variant="body2">
                                Soumettez vos congés et suivez leur avancement en temps réel.
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Paper className="feature-card" elevation={3}>
                            <VerifiedUserIcon className="feature-icon" />
                            <Typography variant="h6">Validation rapide</Typography>
                            <Typography variant="body2">
                                Les responsables approuvent ou refusent en toute simplicité.
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Paper className="feature-card" elevation={3}>
                            <TimelineIcon className="feature-icon" />
                            <Typography variant="h6">Historique clair</Typography>
                            <Typography variant="body2">
                                Consultez toutes vos demandes passées et futures facilement.
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Paper className="feature-card" elevation={3}>
                            <NotificationsActiveIcon className="feature-icon" />
                            <Typography variant="h6">Notifications</Typography>
                            <Typography variant="body2">
                                Recevez des alertes instantanées pour chaque mise à jour.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default HomePage;
