import React from "react";
import { Container, Typography, Box, Paper } from "@mui/material";

const TermsOfService = () => (
    <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
                Terms of Service
            </Typography>
            <Box mt={2}>
                <Typography variant="body1" gutterBottom>
                    Welcome to <strong>BuddyUp</strong>. By using our website, you agree to comply with these Terms of Service.
                </Typography>

                <Typography variant="h6" gutterBottom mt={3}>
                    1. Use of Service
                </Typography>
                <Typography variant="body1" gutterBottom>
                    BuddyUp provides a platform where users can post, explore, and join events. Users must respect other community members, adhere to event guidelines, and use the platform responsibly.
                </Typography>

                <Typography variant="h6" gutterBottom mt={3}>
                    2. User Responsibilities
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Users are responsible for the accuracy of the information they share. BuddyUp is not liable for any misinformation or issues arising from user-generated events or content.
                </Typography>

                <Typography variant="h6" gutterBottom mt={3}>
                    3. Prohibited Activities
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Users agree not to post content or organize events that are illegal, offensive, discriminatory, or violate intellectual property rights.
                </Typography>

                <Typography variant="h6" gutterBottom mt={3}>
                    4. Modification of Terms
                </Typography>
                <Typography variant="body1" gutterBottom>
                    BuddyUp reserves the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting on this page.
                </Typography>

                <Typography variant="h6" gutterBottom mt={3}>
                    5. Contact
                </Typography>
                <Typography variant="body1">
                    For questions or concerns regarding these terms, contact us at: <strong>support@buddyup.com</strong>
                </Typography>
            </Box>
        </Paper>
    </Container>
);

export default TermsOfService;