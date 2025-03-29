import React from "react";
import { Container, Typography, Box, Paper } from "@mui/material";

const PrivacyPolicy = () => (
    <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
                Privacy Policy
            </Typography>
            <Box mt={2}>
                <Typography variant="body1" gutterBottom>
                    At <strong>BuddyUp</strong>, your privacy is important. This Privacy Policy explains how we collect, use, and protect your personal information.
                </Typography>

                <Typography variant="h6" gutterBottom mt={3}>
                    1. Information We Collect
                </Typography>
                <Typography variant="body1" gutterBottom>
                    We collect personal information such as name, email address, and event preferences when you register or participate in events on our platform.
                </Typography>

                <Typography variant="h6" gutterBottom mt={3}>
                    2. How We Use Your Information
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Your information is used to manage your account, personalize your experience, improve our services, and communicate important updates.
                </Typography>

                <Typography variant="h6" gutterBottom mt={3}>
                    3. Sharing Information
                </Typography>
                <Typography variant="body1" gutterBottom>
                    We do not sell your personal information. We may share your details with event organizers or other users when you choose to join an event.
                </Typography>

                <Typography variant="h6" gutterBottom mt={3}>
                    4. Data Security
                </Typography>
                <Typography variant="body1" gutterBottom>
                    BuddyUp employs industry-standard measures to protect your information. However, we cannot guarantee absolute security of online data transmissions.
                </Typography>

                <Typography variant="h6" gutterBottom mt={3}>
                    5. Cookies
                </Typography>
                <Typography variant="body1" gutterBottom>
                    BuddyUp uses cookies to enhance user experience. You can disable cookies via your browser settings, but doing so may limit site functionality.
                </Typography>

                <Typography variant="h6" gutterBottom mt={3}>
                    6. Changes to this Policy
                </Typography>
                <Typography variant="body1" gutterBottom>
                    We may update this Privacy Policy periodically. Changes will be posted here and become effective upon posting.
                </Typography>

                <Typography variant="h6" gutterBottom mt={3}>
                    7. Contact Us
                </Typography>
                <Typography variant="body1">
                    For any privacy-related questions, please contact us at: <strong>privacy@buddyup.com</strong>
                </Typography>
            </Box>
        </Paper>
    </Container>
);

export default PrivacyPolicy;