import React, { useState, useEffect } from "react";
import AddUserForm from "../componants/userComponant/AddUserForm";
import UpdateUserForm from "../componants/userComponant/updateUserForm";
import {
    Container,
    Typography,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Paper,
    Box,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import PersonIcon from "@mui/icons-material/Person";
import { getAllUsers } from "../apiService/getElementApi";
import { addUser } from "../apiService/addElementApi";
import {updateUser} from "../apiService/UpdateElementApi";
import "./adminPage.css";

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formInitialData, setFormInitialData] = useState(null);
    const [message, setMessage] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (roleFilter === "ALL") setFilteredUsers(users);
        else setFilteredUsers(users.filter((u) => u.role === roleFilter));
    }, [roleFilter, users]);

    const fetchUsers = async () => {
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error("Erreur fetch users:", error);
            setMessage("Erreur lors du chargement des utilisateurs.");
        }
    };

    const handleAddOrUpdateUser = async (userData) => {
        if (formInitialData) {
            // ⚡ cas modification
            try {
                const response = await updateUser(formInitialData.id, userData);
                if (response) {
                    setUsers((prev) =>
                        prev.map((u) => (u.id === formInitialData.id ? response : u))
                    );
                    setMessage(`Utilisateur "${response.nom}" modifié.`);
                }
            } catch (error) {
                console.error("Erreur API updateUser", error);
                setMessage("Erreur lors de la modification de l'utilisateur.");
            }
        } else {
            // ⚡ cas ajout
            try {
                const response = await addUser(userData);
                if (response) {
                    setUsers((prev) => [...prev, response]);
                    setMessage(`Utilisateur "${response.nom}" ajouté.`);
                }
            } catch (error) {
                console.error("Erreur API addUser", error);
                setMessage("Erreur lors de l'ajout utilisateur.");
            }
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

    const renderRoleIcon = (role) => {
        switch (role) {
            case "ADMIN":
                return <AdminPanelSettingsIcon color="primary" style={{ marginRight: 5 }} />;
            case "RESPONSABLE":
                return <SupervisorAccountIcon color="success" style={{ marginRight: 5 }} />;
            case "EMPLOYE":
                return <PersonIcon color="action" style={{ marginRight: 5 }} />;
            default:
                return null;
        }
    };

    return (
        <Container maxWidth="lg" className="admin-container">
            <Typography variant="h4" gutterBottom className="admin-title">
                Gestion des utilisateurs
            </Typography>

            {message && (
                <Typography variant="body1" className="admin-message">
                    {message}
                </Typography>
            )}

            <Box display="flex" justifyContent="space-between" mb={2}>
                <Button variant="contained" color="primary" onClick={handleOpenAdd}>
                    Ajouter un utilisateur
                </Button>

                <FormControl variant="outlined" size="small" style={{ minWidth: 150 }}>
                    <InputLabel>Filtrer par rôle</InputLabel>
                    <Select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        label="Filtrer par rôle"
                    >
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
                            <TableCell>Nom</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Rôle</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} align="center">
                                    Aucun utilisateur trouvé.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id} className="admin-table-row">
                                    <TableCell>{user.nom}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Box display="flex" alignItems="center" justifyContent="space-between">
                      <span>
                        {renderRoleIcon(user.role)}
                          {user.role}
                      </span>
                                            <IconButton
                                                color="primary"
                                                aria-label="modifier"
                                                size="small"
                                                onClick={() => handleOpenEdit(user)}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Paper>

            {/* ⚡ afficher AddUserForm ou UpdateUserForm selon le cas */}
            {formInitialData ? (
                <UpdateUserForm
                    isOpen={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    onUpdateUser={handleAddOrUpdateUser}
                    user={formInitialData}
                />
            ) : (
                <AddUserForm
                    isOpen={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    onAddUser={handleAddOrUpdateUser}
                />
            )}
        </Container>
    );
};

export default AdminPage;
