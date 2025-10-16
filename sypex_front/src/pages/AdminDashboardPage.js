import React from 'react';
import AdminDashboard from '../componants/adminComponants/AdminDashboard';
import { Container } from '@mui/material';

const AdminDashboardPage = () => {
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <AdminDashboard />
        </Container>
    );
};

export default AdminDashboardPage;