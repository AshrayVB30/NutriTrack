// Contact.jsx
import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Contact = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto my-10 p-6 max-w-lg bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">Contact Us</h1>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full border rounded px-3 py-2"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full border rounded px-3 py-2"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="message" className="block font-medium mb-1">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows="4"
              className="w-full border rounded px-3 py-2"
              placeholder="How can we help you?"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white font-semibold py-2 rounded hover:opacity-90"
          >
            Send Message
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
