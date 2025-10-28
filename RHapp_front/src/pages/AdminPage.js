import React, { useState, useEffect } from "react";
import AddUserForm from "../componants/userComponant/AddUserForm";
import UpdateUserForm from "../componants/userComponant/updateUserForm";
import { DataGrid } from '@mui/x-data-grid';
import {
    Container, Typography, Button, IconButton, Paper,
    Box, Chip
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import PersonIcon from "@mui/icons-material/Person";
import { getAllUsers } from "../apiService/getElementApi";
import { deleteUser} from "../apiService/deleteElementApi";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formInitialData, setFormInitialData] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (err) {
            console.error(err);
            setMessage("Erreur lors du chargement des utilisateurs.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddOrUpdateUser = (updatedUser) => {
        if (formInitialData) {
            setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
            setMessage(`Utilisateur "${updatedUser.nom}" modifié.`);
        } else {
            fetchUsers();
            setMessage(`Utilisateur ajouté avec succès.`);
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

    const handleRowClick = (params) => {
        navigate(`/user/profile/${params.id}`);
    };

    const renderRole = (params) => {
        const role = params.value;
        let icon, label, color;

        switch (role) {
            case "ADMIN":
                icon = <AdminPanelSettingsIcon />;
                label = "Admin";
                color = "primary";
                break;
            case "RESPONSABLE":
                icon = <SupervisorAccountIcon />;
                label = "Responsable";
                color = "success";
                break;
            case "EMPLOYE":
                icon = <PersonIcon />;
                label = "Employé";
                color = "info"
                break;
            default:
                return null;
        }
        return <Chip icon={icon} label={label} color={color} variant="outlined" size="small" />;
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'nom', headerName: 'Nom', width: 150, editable: true },
        { field: 'prenom', headerName: 'Prénom', width: 150, editable: true },
        { field: 'email', headerName: 'Email', width: 200, editable: true },
        {
            field: 'role',
            headerName: 'Rôle',
            width: 150,
            renderCell: renderRole,
        },
        {
            field: 'dateEntree',
            headerName: 'Date d entrée',
            type: 'date',
            width: 150,
            valueGetter: (params) => {
                if (params && params.value) {
                    return new Date(params.value);
                }
                return null;
            },
        },
        {
            field: 'responsable',
            headerName: 'Responsable',
            width: 150,
            valueGetter: (params) => {
                if (params && params.value) {
                    return `${params.value.nom} ${params.value.prenom}`;
                }
                return 'N/A';
            },
        },
        {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            width: 120,
            renderCell: (params) => (
                <>
                    <IconButton color="primary" size="small" onClick={() => handleOpenEdit(params.row)}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton color="error" size="small" onClick={() => handleDelete(params.row.id, params.row.nom)}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </>
            ),
        },
    ];


    return (
        <Container maxWidth="xl" className="admin-container">
            <Typography variant="h4" gutterBottom className="admin-title">Gestion des utilisateurs</Typography>

            {message && <Typography variant="body1" className="admin-message">{message}</Typography>}

            <Box display="flex" justifyContent="space-between" mb={2}>
                <Button variant="contained" color="primary" onClick={handleOpenAdd}>Ajouter un Collaborateur</Button>
            </Box>

            <Paper className="admin-table-wrapper" elevation={3} sx={{
                height: 600,
                width: '100%',
                p: 3,
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.4)',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)',
            }}>
                <DataGrid
                    rows={users}
                    columns={columns}
                    loading={loading}
                    pageSizeOptions={[5, 10, 25]}
                    initialState={{
                        pagination: {
                          paginationModel: {
                            pageSize: 10,
                          },
                        },
                      }}
                    onRowClick={handleRowClick}
                    checkboxSelection
                    disableRowSelectionOnClick
                />
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
