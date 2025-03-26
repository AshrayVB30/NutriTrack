import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const PrivacyPolicy = () => {
  return (
    <>
      <Navbar />
      <div className="container my-5">
        <h1 className="text-primary text-center mb-4">🔐 Privacy Policy</h1>
        <div className="card p-4 shadow-sm">
          <h4 className="fw-bold mb-3">1. Introduction</h4>
          <p className="text-muted">
            At <strong>NutriTrack</strong>, we value your privacy and are committed to protecting your personal
            information. This Privacy Policy outlines how we collect, use, and safeguard your data.
          </p>

          <h4 className="fw-bold mt-4">2. Information We Collect</h4>
          <p className="text-muted">
            We may collect personal information such as your name, email address, and nutritional data when you sign
            up and use the NutriTrack platform.
          </p>

          <h4 className="fw-bold mt-4">3. How We Use Your Information</h4>
          <ul className="text-muted">
            <li>📊 To personalize your nutrition and fitness journey.</li>
            <li>🔔 To send reminders and notifications.</li>
            <li>🔒 To improve our services and user experience.</li>
          </ul>

          <h4 className="fw-bold mt-4">4. Data Security</h4>
          <p className="text-muted">
            We take appropriate security measures to protect your data from unauthorized access, alteration, or
            disclosure.
          </p>

          <h4 className="fw-bold mt-4">5. Sharing of Data</h4>
          <p className="text-muted">
            Your data is never shared with third parties without your explicit consent, except where required by law.
          </p>

          <h4 className="fw-bold mt-4">6. Your Rights</h4>
          <p className="text-muted">
            You have the right to access, modify, or delete your personal information at any time.
          </p>

          <h4 className="fw-bold mt-4">7. Changes to Privacy Policy</h4>
          <p className="text-muted">
            NutriTrack reserves the right to update this Privacy Policy. You will be notified of any significant
            changes.
          </p>

          <p className="text-muted mt-4">
            For further questions or concerns about this Privacy Policy, please{" "}
            <a href="/contact" className="text-primary">
              contact us
            </a>
            .
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
