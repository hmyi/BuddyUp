import React from "react";
import { Box, Typography } from "@mui/material";

function PrivacyPolicy() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Privacy Policy
      </Typography>

      <Typography variant="body1" paragraph>
        <strong>Last Updated: [Date]</strong>
      </Typography>
      <Typography variant="body1" paragraph>
        Welcome to BuddyUp. This Privacy Policy explains how we collect, use, disclose,
        and safeguard your personal information when you visit or use our website and
        services (collectively, “Services”). By accessing or using BuddyUp, you agree
        to the terms of this Privacy Policy.
      </Typography>

      <Typography variant="h6" gutterBottom>
        1. Information We Collect
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>a. Information You Provide Directly</strong>: We collect information
        you provide when you create an account, update your profile, or otherwise
        interact with the Services. This may include your name, email address, and any
        other details you choose to share in your user profile.
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>b. Facebook and Google Login</strong>: If you choose to sign in via
        Facebook or Google, we receive basic account information (such as your name,
        email address, and profile image) from these third-party providers. We do not
        access your passwords or other personal data stored with these providers.
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>c. Automatically Collected Information</strong>: Currently, BuddyUp
        does not use analytics tools or marketing trackers. We do not collect additional
        personal data automatically beyond what is essential for our login and site
        functionality. For more details, please review our <em>Cookie Policy</em>.
      </Typography>

      <Typography variant="h6" gutterBottom>
        2. How We Use Your Information
      </Typography>
      <Typography variant="body1" paragraph>
        We use the information we collect to:
      </Typography>
      <Typography variant="body1" component="ul" paragraph>
        <li>Provide, maintain, and improve our Services.</li>
        <li>Authenticate your login and ensure account security.</li>
        <li>Communicate with you regarding updates, features, or support.</li>
        <li>Personalize your experience within BuddyUp.</li>
        <li>Enforce our terms, conditions, and policies.</li>
      </Typography>

      <Typography variant="h6" gutterBottom>
        3. Disclosure of Your Information
      </Typography>
      <Typography variant="body1" paragraph>
        We do not sell or rent your personal information. We may share your information
        in the following situations:
      </Typography>
      <Typography variant="body1" component="ul" paragraph>
        <li>
          <strong>Service Providers:</strong> We may share data with service providers
          who help us operate our website and Services (e.g., hosting, authentication).
          These providers are contractually required to safeguard your data.
        </li>
        <li>
          <strong>Legal Requirements:</strong> We may disclose information if required
          by law, court order, or governmental authority.
        </li>
        <li>
          <strong>Business Transfers:</strong> If we engage in or are involved in a
          merger, acquisition, or sale of assets, your information may be transferred
          as part of that deal.
        </li>
      </Typography>

      <Typography variant="h6" gutterBottom>
        4. Cookies and Local Storage
      </Typography>
      <Typography variant="body1" paragraph>
        We primarily use browser <strong>local storage</strong> to store login tokens
        and essential user data. We do not set first-party analytics or marketing
        cookies. However, third-party login providers (e.g., Facebook, Google) may set
        their own cookies to facilitate secure authentication. For more details, refer
        to our <em>Cookie Policy</em>.
      </Typography>

      <Typography variant="h6" gutterBottom>
        5. Data Retention
      </Typography>
      <Typography variant="body1" paragraph>
        We retain personal information for as long as necessary to fulfill the purposes
        outlined in this Privacy Policy, unless a longer retention period is required
        or permitted by law. You may request deletion of your account at any time.
      </Typography>

      <Typography variant="h6" gutterBottom>
        6. Security
      </Typography>
      <Typography variant="body1" paragraph>
        We implement commercially reasonable security measures designed to protect your
        personal information. However, no security system is impenetrable, and we cannot
        guarantee the absolute security of our systems or your data.
      </Typography>

      <Typography variant="h6" gutterBottom>
        7. Your Choices and Rights
      </Typography>
      <Typography variant="body1" paragraph>
        You can access, update, or correct your personal information at any time by
        logging into your account. If you wish to delete your account or withdraw
        consent to further use of your data, please contact us at [Your Contact Email].
      </Typography>

      <Typography variant="h6" gutterBottom>
        8. Children’s Privacy
      </Typography>
      <Typography variant="body1" paragraph>
        BuddyUp is not directed to individuals under the age of majority in your
        jurisdiction. We do not knowingly collect personal information from minors
        without verifiable parental consent.
      </Typography>

      <Typography variant="h6" gutterBottom>
        9. Changes to This Privacy Policy
      </Typography>
      <Typography variant="body1" paragraph>
        We may update this Privacy Policy from time to time. If we make significant
        changes, we will post a prominent notice on our website or notify you by other
        means, such as email.
      </Typography>

      <Typography variant="h6" gutterBottom>
        10. Contact Us
      </Typography>
      <Typography variant="body1" paragraph>
        If you have any questions or concerns about this Privacy Policy, please reach
        out to us at contact@buddyup.ca.
      </Typography>
    </Box>
  );
}

export default PrivacyPolicy;
