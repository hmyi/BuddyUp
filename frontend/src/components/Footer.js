import React from 'react';
import { Box, Link, Stack } from '@mui/material';
import { Link as RouterLink } from "react-router-dom";

const Footer = () => (
    <Box component={"footer"} sx={{bgcolor:"#f5f5f5", p:3, mt:"auto"}}>
        <Stack direction="row" spacing={5} justifyContent={"center"}>
            <span>©2025 BuudyUp</span>
            <Link component={RouterLink} to="/terms-of-service" color={"inherit"} underline={"hover"}>
                Terms of Service
            </Link>
            <Link component={RouterLink} to={"/privacy-policy"} color={"inherit"} underline={"hover"}>
                Privacy Policy
            </Link>
        </Stack>
    </Box>
);

export default Footer;