import React from "react";
import { Box, Typography } from "@mui/material";

function TermsOfService() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Terms of Service
      </Typography>

      <Typography variant="body1" paragraph>
        <strong>Last Updated: [Date]</strong>
      </Typography>
      <Typography variant="body1" paragraph>
        Welcome to BuddyUp. These Terms of Service (“Terms”) govern your access to and
        use of our website, mobile applications, and services (collectively, the “Services”).
        By accessing or using BuddyUp, you agree to be bound by these Terms. If you do not
        agree, you must not use our Services.
      </Typography>

      <Typography variant="h6" gutterBottom>
        1. Eligibility
      </Typography>
      <Typography variant="body1" paragraph>
        You must be the age of majority in your jurisdiction (or have parental consent)
        to use BuddyUp. By using our Services, you represent and warrant that you meet
        these eligibility requirements and that all information you provide during
        registration is accurate and complete.
      </Typography>

      <Typography variant="h6" gutterBottom>
        2. Account Registration & Security
      </Typography>
      <Typography variant="body1" paragraph>
        To access certain features, you may need to create an account, which can be done
        via our standard registration process or by using a third-party login provider
        (e.g., Facebook, Google). You are responsible for maintaining the confidentiality
        of your login credentials and for all activities that occur under your account.
        If you suspect any unauthorized use of your account, please notify us immediately.
      </Typography>

      <Typography variant="h6" gutterBottom>
        3. User Conduct
      </Typography>
      <Typography variant="body1" paragraph>
        You agree not to use BuddyUp in any way that violates applicable laws or regulations,
        infringes on any third party’s rights, or is fraudulent, malicious, or harmful to
        others. Prohibited activities include, but are not limited to:
      </Typography>
      <Typography variant="body1" component="ul" paragraph>
        <li>Posting abusive, harassing, or defamatory content.</li>
        <li>Sharing content that contains malware or other harmful code.</li>
        <li>Attempting to gain unauthorized access to the Services or user accounts.</li>
        <li>Engaging in any activity that disrupts or interferes with the Services.</li>
      </Typography>

      <Typography variant="h6" gutterBottom>
        4. Content Ownership & License
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Your Content:</strong> Any content you post, upload, or otherwise make
        available through the Services remains your property. However, by posting content,
        you grant BuddyUp a non-exclusive, worldwide, royalty-free license to use, display,
        modify, distribute, and reproduce your content solely for the purpose of operating
        and improving the Services.
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>BuddyUp Content:</strong> All text, graphics, user interfaces, trademarks,
        logos, sounds, artwork, and other materials provided by BuddyUp are owned by or
        licensed to us. You may not use or reproduce such materials without our express
        written permission.
      </Typography>

      <Typography variant="h6" gutterBottom>
        5. Third-Party Services & Links
      </Typography>
      <Typography variant="body1" paragraph>
        Our Services may include links to or integrations with third-party websites or
        services (e.g., Facebook, Google for login). We do not control these third-party
        services and are not responsible for their content or privacy practices. Your use
        of such services is subject to their respective terms and policies.
      </Typography>

      <Typography variant="h6" gutterBottom>
        6. Termination
      </Typography>
      <Typography variant="body1" paragraph>
        We reserve the right to suspend or terminate your access to BuddyUp at any time
        if we believe you have violated these Terms or engaged in conduct that disrupts or
        harms our platform or users. You may also delete your account at any time by
        following the instructions within the Services or contacting us directly.
      </Typography>

      <Typography variant="h6" gutterBottom>
        7. Disclaimers
      </Typography>
      <Typography variant="body1" paragraph>
        BuddyUp and its Services are provided on an “as is” and “as available” basis.
        We do not warrant that the Services will be uninterrupted, secure, or error-free.
        To the fullest extent permitted by law, we disclaim all warranties, express or
        implied, including warranties of merchantability, fitness for a particular purpose,
        and non-infringement.
      </Typography>

      <Typography variant="h6" gutterBottom>
        8. Limitation of Liability
      </Typography>
      <Typography variant="body1" paragraph>
        Under no circumstances will BuddyUp be liable for any indirect, incidental,
        special, consequential, or punitive damages arising from or related to your use
        of the Services. Our total liability to you for any claims arising from or related
        to the Services is limited to the amount you paid, if any, for accessing the
        Services or (if greater) the limits set by applicable law.
      </Typography>

      <Typography variant="h6" gutterBottom>
        9. Indemnification
      </Typography>
      <Typography variant="body1" paragraph>
        You agree to defend, indemnify, and hold harmless BuddyUp, its affiliates,
        officers, directors, employees, and agents from and against any claims, damages,
        obligations, losses, liabilities, or expenses (including attorneys’ fees) arising
        from your use of the Services, your breach of these Terms, or your violation of
        any third-party rights.
      </Typography>

      <Typography variant="h6" gutterBottom>
        10. Governing Law & Disputes
      </Typography>
      <Typography variant="body1" paragraph>
        These Terms and any dispute arising out of or related to them or the Services
        will be governed by and construed in accordance with the laws of [Your Province
        or Country], without regard to its conflict-of-law principles. Any legal action
        or proceeding related to these Terms shall be brought exclusively in the courts
        located in [Your Province], and you consent to their jurisdiction.
      </Typography>

      <Typography variant="h6" gutterBottom>
        11. Changes to the Terms
      </Typography>
      <Typography variant="body1" paragraph>
        We may revise these Terms at any time. If we make material changes, we will
        provide advance notice by posting the updated Terms on our website or through
        other means. Your continued use of BuddyUp after the effective date of any
        changes constitutes your acceptance of the new Terms.
      </Typography>

      <Typography variant="h6" gutterBottom>
        12. Contact Information
      </Typography>
      <Typography variant="body1" paragraph>
        If you have questions or concerns about these Terms, please contact us at
        [Your Contact Email].
      </Typography>
    </Box>
  );
}

export default TermsOfService;
