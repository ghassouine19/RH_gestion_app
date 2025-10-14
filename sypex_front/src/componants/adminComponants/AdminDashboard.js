import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getAllUsers, getAllDemandes } from '../../apiService/getElementApi';
import { Paper, Grid, Typography, useTheme, Box } from '@mui/material';

const StatCard = ({ title, value, icon }) => {
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

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [demandes, setDemandes] = useState([]);
    const theme = useTheme();

    useEffect(() => {
        getAllUsers().then(setUsers).catch(console.error);
        getAllDemandes().then(setDemandes).catch(console.error);
    }, []);

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

    return (
        <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
                <StatCard title="Total Employees" value={users.length} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <StatCard title="Total Vacation Requests" value={demandes.length} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <StatCard title="Pending Requests" value={demandes.filter(d => d.statut === 'EN_ATTENTE').length} />
            </Grid>
            <Grid item xs={12} lg={6}>
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
                        Employees by Role
                    </Typography>
                    <ResponsiveContainer>
                        <BarChart data={roleData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill={theme.palette.primary.main} />
                        </BarChart>
                    </ResponsiveContainer>
                </Paper>
            </Grid>
            <Grid item xs={12} lg={6}>
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
                        Vacation Requests Status
                    </Typography>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie data={demandeStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} innerRadius={80} fill="#8884d8" paddingAngle={5} label>
                                {demandeStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[entry.name] || theme.palette.grey[500]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default AdminDashboard;