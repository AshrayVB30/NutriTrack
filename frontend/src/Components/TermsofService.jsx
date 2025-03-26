import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const TermsOfService = () => {
  return (
    <>
      <Navbar />
      <div className="container my-5">
        <h1 className="text-primary text-center mb-4">📄 Terms of Service</h1>
        <div className="card p-4 shadow-sm">
          <h4 className="fw-bold mb-3">1. Introduction</h4>
          <p className="text-muted">
            Welcome to <strong>NutriTrack</strong>. By using our platform, you agree to comply with and be bound by
            these Terms of Service. Please read them carefully before using the app.
          </p>

          <h4 className="fw-bold mt-4">2. Use of Service</h4>
          <p className="text-muted">
            You agree to use the NutriTrack app solely for tracking your nutrition, fitness, and hydration goals.
            Unauthorized access or misuse of the platform is strictly prohibited.
          </p>

          <h4 className="fw-bold mt-4">3. Account Responsibility</h4>
          <p className="text-muted">
            You are responsible for maintaining the confidentiality of your account credentials and for all
            activities conducted under your account.
          </p>

          <h4 className="fw-bold mt-4">4. Data and Privacy</h4>
          <p className="text-muted">
            Our Privacy Policy outlines how we collect, use, and protect your data. By using NutriTrack, you consent
            to our data practices.
          </p>

          <h4 className="fw-bold mt-4">5. Termination</h4>
          <p className="text-muted">
            We reserve the right to suspend or terminate your account if you violate any terms mentioned here.
          </p>

          <h4 className="fw-bold mt-4">6. Changes to Terms</h4>
          <p className="text-muted">
            NutriTrack may modify these Terms of Service at any time. You will be notified of any changes, and
            continued use of the app implies acceptance of the revised terms.
          </p>

          <p className="text-muted mt-4">
            If you have any questions regarding these Terms of Service, please{" "}
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

export default TermsOfService;
