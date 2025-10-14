import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Grid,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Snackbar,
    Alert,
    DialogContentText,
} from "@mui/material";
import { addDemande } from "../../apiService/addElementApi";

const DemandeForm = ({ isOpen, onClose, onAddDemande }) => {
    const [formData, setFormData] = useState({
        type: "",
        dateDebut: "",
        dateFin: "",
        motif: "",
    });
    const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userId = localStorage.getItem("userId");
        if (!userId) {
            setNotification({ open: true, message: "Erreur: Utilisateur non identifié.", severity: "error" });
            return;
        }

        const payload = {
            type: formData.type,
            dateDebut: `${formData.dateDebut}T00:00:00`,
            dateFin: `${formData.dateFin}T00:00:00`,
            motif: formData.motif || "Demande de congé",
            idUser: Number(userId),
        };

        try {
            const response = await addDemande(payload);
            if (response) {
                setNotification({ open: true, message: "Demande de congé ajoutée avec succès !", severity: "success" });
                onAddDemande && onAddDemande(response);
                onClose();
            } else {
                setNotification({ open: true, message: "Erreur lors de l'ajout de la demande.", severity: "error" });
            }
        } catch (error) {
            setNotification({ open: true, message: "Erreur: " + error.message, severity: "error" });
        }
    };

    const handleCloseNotification = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setNotification({ ...notification, open: false });
    };

    return (
        <>
            <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>New Vacation Request</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 3 }}>
                        Please fill out the form below to request a new vacation.
                    </DialogContentText>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <FormControl fullWidth required variant="outlined">
                                <InputLabel>Vacation Type</InputLabel>
                                <Select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    label="Vacation Type"
                                >
                                    <MenuItem value={"ANNUEL"}>Annual</MenuItem>
                                    <MenuItem value={"MALADIE"}>Sickness</MenuItem>
                                    <MenuItem value={"EXCEPTIONNEL"}>Exceptional</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                type="date"
                                label="Start Date"
                                name="dateDebut"
                                value={formData.dateDebut}
                                onChange={handleChange}
                                required
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                type="date"
                                label="End Date"
                                name="dateFin"
                                value={formData.dateFin}
                                onChange={handleChange}
                                required
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Reason"
                                name="motif"
                                value={formData.motif}
                                onChange={handleChange}
                                multiline
                                rows={4}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: '16px 24px' }}>
                    <Button onClick={onClose} color="inherit">Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" size="large">Submit Request</Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification}>
                <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }} variant="filled">
                    {notification.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default DemandeForm;
