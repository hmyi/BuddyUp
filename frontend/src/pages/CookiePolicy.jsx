import React from "react";
import { Box, Typography } from "@mui/material";

function CookiePolicy() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Cookie Policy
      </Typography>

      <Typography variant="body1" paragraph>
        <strong>Last Updated: [Date]</strong>
      </Typography>

      <Typography variant="body1" paragraph>
        This Cookie Policy explains how BuddyUp (“we,” “us,” or “our”) uses cookies
        and similar technologies on our website. By using our website, you agree to the
        use of these technologies in accordance with this policy.
      </Typography>

      <Typography variant="h6" gutterBottom>
        1. What Are Cookies?
      </Typography>
      <Typography variant="body1" paragraph>
        Cookies are small text files that websites store on your device (computer,
        tablet, or mobile) when you visit. They are widely used to make websites work
        more efficiently and to provide reporting information. However, BuddyUp primarily
        uses local storage (instead of traditional cookies) to store certain information
        for user authentication and preferences. 
      </Typography>

      <Typography variant="h6" gutterBottom>
        2. How We Use Local Storage & Cookies
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Local Storage (Access Tokens)</strong>: We store your login tokens and
        user profile data in your browser’s local storage so that you remain signed in
        and can access member-only functionality. Local storage is not technically a
        “cookie,” but it functions similarly by persisting data in your browser. 
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Essential Cookies</strong>: Our backend or third-party authentication
        providers (e.g., Facebook, Google) may set essential cookies for security and
        session management purposes. These are necessary to facilitate secure login and
        ensure our site functions properly.
      </Typography>

      <Typography variant="h6" gutterBottom>
        3. Third-Party Cookies
      </Typography>
      <Typography variant="body1" paragraph>
        BuddyUp integrates with third-party login providers such as Facebook and Google.
        These providers may set and use cookies on their own domains or through our site
        to recognize you during authentication and maintain your login session. We do not
        control these cookies. For more information, please refer to the privacy/cookie
        policies of those third parties.
      </Typography>

      <Typography variant="body1" paragraph>
        We do not use other third-party analytics or marketing cookies at this time. If we
        introduce them in the future, we will update this policy accordingly and provide
        appropriate consent or opt-out mechanisms.
      </Typography>

      <Typography variant="h6" gutterBottom>
        4. Controlling Cookies & Local Storage
      </Typography>
      <Typography variant="body1" paragraph>
        You can control or delete cookies and local storage data through your browser
        settings. However, please note that blocking or deleting essential data may impact
        your ability to log in or use certain features of BuddyUp.
      </Typography>

      <Typography variant="h6" gutterBottom>
        5. Changes to This Policy
      </Typography>
      <Typography variant="body1" paragraph>
        We may update this Cookie Policy to reflect changes to our practices, technology,
        or legal requirements. If we make significant updates, we will post a prominent
        notice on our website or notify you by other appropriate means.
      </Typography>

      <Typography variant="h6" gutterBottom>
        6. Contact Us
      </Typography>
      <Typography variant="body1" paragraph>
        If you have any questions about our use of cookies or local storage, please
        contact us at [your contact email].
      </Typography>
    </Box>
  );
}

export default CookiePolicy;
