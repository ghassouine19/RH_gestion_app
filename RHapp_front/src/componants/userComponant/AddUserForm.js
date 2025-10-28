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
    InputAdornment,
    IconButton,
    DialogContentText,
} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import { BASE_URL } from "../../apiService/httpService";

const ROLES = ["RESPONSABLE", "ADMIN", "EMPLOYE"];

const AddUserForm = ({ isOpen, onClose, onAddUser }) => {
    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        email: "",
        password: "",
        role: "",
        soldeConge: 0,
        cin: "",
        cnss: "",
        rib: "",
        dateNaissance: "",
        dateEntree: "",
        dateSortie: "",
        photo: null,
        document: null,
        responsableId: ""
    });
    const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: name === "soldeConge" ? Number(value) : value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.nom ||
            !formData.prenom ||
            !formData.email ||
            !formData.password ||
            !formData.role ||
            (formData.role === "EMPLOYE" && !formData.responsableId)
        ) {
            setNotification({ open: true, message: "Veuillez remplir tous les champs obligatoires.", severity: "error" });
            return;
        }

        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }

        try {
            const response = await fetch(`${BASE_URL}/auth/register`, {
                method: "POST",
                body: data,
            });

            const responseData = await response.json();

            if (!response.ok) {
                setNotification({ open: true, message: `Erreur inscription : ${responseData.message || JSON.stringify(responseData)}`, severity: "error" });
                return;
            }

            setNotification({ open: true, message: "Utilisateur ajouté avec succès !", severity: "success" });
            onAddUser(responseData);
            onClose();

        } catch (error) {
            setNotification({ open: true, message: "Erreur lors de l'inscription. Veuillez réessayer.", severity: "error" });
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
                <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Add a New User</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 3 }}>
                        Please fill out the form below to add a new user to the system.
                    </DialogContentText>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Last Name"
                                name="nom"
                                value={formData.nom}
                                onChange={handleChange}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="First Name"
                                name="prenom"
                                value={formData.prenom}
                                onChange={handleChange}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                type="email"
                                label="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                type="password"
                                label="Password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                variant="outlined"
                                label="Role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <WorkIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            >
                                {ROLES.map(role => (
                                    <MenuItem key={role} value={role}>{role}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        {formData.role === "EMPLOYE" && (
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    type="number"
                                    label="Manager ID"
                                    name="responsableId"
                                    value={formData.responsableId}
                                    onChange={handleChange}
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SupervisedUserCircleIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                        )}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                type="number"
                                label="Vacation Balance"
                                name="soldeConge"
                                value={formData.soldeConge}
                                onChange={handleChange}
                                InputProps={{
                                    inputProps: { min: 0 },
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <BeachAccessIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="CIN"
                                name="cin"
                                value={formData.cin}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="CNSS"
                                name="cnss"
                                value={formData.cnss}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="RIB"
                                name="rib"
                                value={formData.rib}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Date of Birth"
                                name="dateNaissance"
                                type="date"
                                value={formData.dateNaissance}
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Start Date"
                                name="dateEntree"
                                type="date"
                                value={formData.dateEntree}
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="End Date"
                                name="dateSortie"
                                type="date"
                                value={formData.dateSortie}
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                component="label"
                            >
                                Upload Photo
                                <input
                                    type="file"
                                    hidden
                                    name="photo"
                                    onChange={handleChange}
                                />
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                component="label"
                            >
                                Upload Document
                                <input
                                    type="file"
                                    hidden
                                    name="document"
                                    onChange={handleChange}
                                />
                            </Button>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: '16px 24px' }}>
                    <Button onClick={onClose} color="inherit">Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" size="large">Add User</Button>
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

export default AddUserForm;
