import React, { useState } from "react";
import { Container, Typography, Box, Button, Paper } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
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
        <Container maxWidth="md" className="homepage-container">
            <Paper elevation={4} className="hero-card">
                <Typography variant="h3" className="hero-title">
                    Bienvenue sur <span className="brand">Sypex Gestion Congés</span>
                </Typography>
                <Typography variant="h6" className="hero-subtitle">
                    Gérez facilement vos congés et absences en ligne, avec rapidité et simplicité.
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

            <Box className="features-section">
                <Typography variant="h5" gutterBottom className="features-title">
                    🚀 Fonctionnalités clés
                </Typography>
                <ul className="features-list">
                    <li>
                        <CheckCircleIcon /> Demande et suivi des congés
                    </li>
                    <li>
                        <CheckCircleIcon /> Validation rapide par les responsables
                    </li>
                    <li>
                        <CheckCircleIcon /> Historique clair et complet
                    </li>
                    <li>
                        <CheckCircleIcon /> Notifications en temps réel
                    </li>
                </ul>
            </Box>
        </Container>
    );
};

export default HomePage;
