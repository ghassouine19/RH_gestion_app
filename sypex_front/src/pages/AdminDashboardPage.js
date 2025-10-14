import React from 'react';
import AdminDashboard from '../componants/adminComponants/AdminDashboard';
import { Container, Typography } from '@mui/material';

const AdminDashboardPage = () => {
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Admin Dashboard
            </Typography>
            <AdminDashboard />
        </Container>
    );
};

export default AdminDashboardPage;