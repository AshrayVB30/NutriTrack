import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>
          © {new Date().getFullYear()} NutriTrack. All rights reserved.
        </p>
        <p>
          <a href="/privacy-policy">Privacy Policy</a> |{" "}
          <a href="/terms">Terms of Service</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
