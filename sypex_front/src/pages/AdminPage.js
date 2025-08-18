import React, { useState, useEffect } from "react";
import AddUserForm from "../componants/userComponant/AddUserForm";
import { Button, Typography, Table, TableHead, TableRow, TableCell, TableBody, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { getAllUsers} from "../apiService/getElementApi";
import { addUser } from "../apiService/addElementApi";

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formInitialData, setFormInitialData] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

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
            // Modification locale
            setUsers(prev => prev.map(u => (u.id === formInitialData.id ? { ...u, ...userData } : u)));
            setMessage(`Utilisateur "${userData.nom}" modifié.`);
        } else {
            // Ajout via API
            try {
                const response = await addUser(userData);
                if (response) {
                    setUsers(prev => [...prev, response]);
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

    return (
        <div style={{ padding: 20 }}>
            <Typography variant="h4" gutterBottom>Gestion des utilisateurs</Typography>

            <Button variant="contained" onClick={handleOpenAdd} style={{ marginBottom: 20 }}>
                Ajouter un utilisateur
            </Button>

            {message && <Typography color="success.main" gutterBottom>{message}</Typography>}

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Nom</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Rôle</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {users.map(user => (
                        <TableRow key={user.id}>
                            <TableCell>{user.nom}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>
                                <IconButton color="primary" aria-label="modifier" onClick={() => handleOpenEdit(user)}>
                                    <EditIcon />
                                </IconButton>
                                {/* Delete supprimé pour le moment */}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <AddUserForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onAddUser={handleAddOrUpdateUser}
                initialData={formInitialData}
            />
        </div>
    );
};

export default AdminPage;
