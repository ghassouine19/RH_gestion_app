import React, { useState, useEffect } from "react";
import AddUserForm from "../componants/userComponant/AddUserForm";
import UpdateUserForm from "../componants/userComponant/updateUserForm";
import {
    Container, Typography, Button, Table, TableHead,
    TableRow, TableCell, TableBody, IconButton, Paper,
    Box, Select, MenuItem, FormControl, InputLabel
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import PersonIcon from "@mui/icons-material/Person";
import { getAllUsers } from "../apiService/getElementApi";
import { deleteUser} from "../apiService/deleteElementApi";
import "./adminPage.css";

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formInitialData, setFormInitialData] = useState(null);
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [message, setMessage] = useState("");

    useEffect(() => { fetchUsers(); }, []);

    useEffect(() => {
        if (roleFilter === "ALL") setFilteredUsers(users);
        else setFilteredUsers(users.filter(u => u.role === roleFilter));
    }, [roleFilter, users]);

    const fetchUsers = async () => {
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (err) {
            console.error(err);
            setMessage("Erreur lors du chargement des utilisateurs.");
        }
    };

    const handleAddOrUpdateUser = (updatedUser) => {
        if (formInitialData) {
            setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
            setMessage(`Utilisateur "${updatedUser.nom}" modifié.`);
        } else {
            setUsers(prev => [...prev, updatedUser]);
            setMessage(`Utilisateur "${updatedUser.nom}" ajouté.`);
        }
    };

    const handleOpenAdd = () => {
        setFormInitialData(null);
        setIsFormOpen(true);
    };

    const handleOpenEdit = (user) => {
        setFormInitialData(user);
        setIsFormOpen(true);
    };

    const handleDelete = async (id, nom) => {
        if (!window.confirm(`Voulez-vous vraiment supprimer l’utilisateur "${nom}" ?`)) return;
        try {
            await deleteUser(id);
            setUsers(prev => prev.filter(u => u.id !== id));
            setMessage(`Utilisateur "${nom}" supprimé.`);
        } catch (err) {
            console.error(err);
            setMessage("Erreur lors de la suppression.");
        }
    };

    const renderRoleIcon = (role) => {
        switch (role) {
            case "ADMIN": return <AdminPanelSettingsIcon color="primary" style={{ marginRight: 5 }} />;
            case "RESPONSABLE": return <SupervisorAccountIcon color="success" style={{ marginRight: 5 }} />;
            case "EMPLOYE": return <PersonIcon color="action" style={{ marginRight: 5 }} />;
            default: return null;
        }
    };

    return (
        <Container maxWidth="lg" className="admin-container">
            <Typography variant="h4" gutterBottom className="admin-title">Gestion des utilisateurs</Typography>

            {message && <Typography variant="body1" className="admin-message">{message}</Typography>}

            <Box display="flex" justifyContent="space-between" mb={2}>
                <Button variant="contained" color="primary" onClick={handleOpenAdd}>Ajouter un Collaborateur</Button>
                <FormControl variant="outlined" size="small" style={{ minWidth: 150 }}>
                    <InputLabel>Filtrer par rôle</InputLabel>
                    <Select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} label="Filtrer par rôle">
                        <MenuItem value="ALL">Tous</MenuItem>
                        <MenuItem value="ADMIN">Admin</MenuItem>
                        <MenuItem value="RESPONSABLE">Responsable</MenuItem>
                        <MenuItem value="EMPLOYE">Employé</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Paper className="admin-table-wrapper" elevation={3}>
                <Table>
                    <TableHead className="admin-table-head">
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nom</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Rôle</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">Aucun utilisateur trouvé.</TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map(user => (
                                <TableRow key={user.id} className="admin-table-row">
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.nom}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{renderRoleIcon(user.role)}{user.role}</TableCell>
                                    <TableCell align="center">
                                        <IconButton color="primary" size="small" onClick={() => handleOpenEdit(user)}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton color="error" size="small" onClick={() => handleDelete(user.id, user.nom)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Paper>

            {isFormOpen && formInitialData ? (
                <UpdateUserForm
                    isOpen={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    user={formInitialData}
                    onUpdateUser={handleAddOrUpdateUser}
                />
            ) : isFormOpen && !formInitialData ? (
                <AddUserForm
                    isOpen={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    onAddUser={handleAddOrUpdateUser}
                />
            ) : null}
        </Container>
    );
};

export default AdminPage;
