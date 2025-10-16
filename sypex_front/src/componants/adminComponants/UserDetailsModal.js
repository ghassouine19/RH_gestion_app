import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const UserDetailsModal = ({ user, onClose }) => {
    if (!user) {
        return null;
    }

    return (
        <Modal
            open={!!user}
            onClose={onClose}
            aria-labelledby="user-details-modal-title"
            aria-describedby="user-details-modal-description"
        >
            <Box sx={style}>
                <Typography id="user-details-modal-title" variant="h6" component="h2">
                    User Details
                </Typography>
                <Typography id="user-details-modal-description" sx={{ mt: 2 }}>
                    <p><strong>ID:</strong> {user.id}</p>
                    <p><strong>Name:</strong> {user.nom} {user.prenom}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                    <p><strong>Solde:</strong> {user.solde}</p>
                </Typography>
                <Button onClick={onClose} sx={{ mt: 2 }}>Close</Button>
            </Box>
        </Modal>
    );
};

export default UserDetailsModal;
