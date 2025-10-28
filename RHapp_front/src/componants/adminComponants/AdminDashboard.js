import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getAllUsers, getAllDemandes } from '../../apiService/getElementApi';
import { Paper, Grid, Typography, useTheme, Box, Card, CardContent, CardHeader } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PendingActionsIcon from '@mui/icons-material/PendingActions';

const StatCard = ({ title, value, icon }) => {
    return (
        <Card>
            <CardHeader title={title} />
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {icon}
                    <Typography variant="h4" sx={{ ml: 2, fontWeight: 'bold' }}>{value}</Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [demandes, setDemandes] = useState([]);
    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
        getAllUsers().then(setUsers).catch(console.error);
        getAllDemandes().then(setDemandes).catch(console.error);
    }, []);

    const handleUserClick = (params) => {
        navigate(`/user/profile/${params.id}`);
    };

    const roleData = users.reduce((acc, user) => {
        const role = user.role || 'N/A';
        const existingRole = acc.find(item => item.name === role);
        if (existingRole) {
            existingRole.value += 1;
        } else {
            acc.push({ name: role, value: 1 });
        }
        return acc;
    }, []);

    const demandeStatusData = demandes.reduce((acc, demande) => {
        const status = demande.statut || 'N/A';
        const existingStatus = acc.find(item => item.name === status);
        if (existingStatus) {
            existingStatus.value += 1;
        } else {
            acc.push({ name: status, value: 1 });
        }
        return acc;
    }, []);

    const COLORS = {
        EN_ATTENTE: theme.palette.warning.main,
        ACCEPTE: theme.palette.success.main,
        REFUSE: theme.palette.error.main,
    };

    const userColumns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'nom', headerName: 'Last name', width: 150 },
        { field: 'prenom', headerName: 'First name', width: 150 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'role', headerName: 'Role', width: 130 },
        { field: 'soldeConge', headerName: 'Vacation Balance', width: 150 },
    ];

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
                <StatCard title="Total Employees" value={users.length} icon={<PeopleIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <StatCard title="Total Vacation Requests" value={demandes.length} icon={<EventNoteIcon sx={{ fontSize: 40, color: theme.palette.secondary.main }} />} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <StatCard title="Pending Requests" value={demandes.filter(d => d.statut === 'EN_ATTENTE').length} icon={<PendingActionsIcon sx={{ fontSize: 40, color: theme.palette.warning.main }} />} />
            </Grid>
            <Grid item xs={12} lg={6}>
                <Card>
                    <CardHeader title="Employees by Role" />
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={roleData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill={theme.palette.primary.main} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} lg={6}>
                <Card>
                    <CardHeader title="Vacation Requests Status" />
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={demandeStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" paddingAngle={5} label>
                                    {demandeStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[entry.name] || theme.palette.grey[500]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title="All Users" />
                    <CardContent>
                        <div style={{ height: 400, width: '100%' }}>
                            <DataGrid
                                rows={users}
                                columns={userColumns}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                                onRowClick={handleUserClick}
                                disableSelectionOnClick
                            />
                        </div>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default AdminDashboard;