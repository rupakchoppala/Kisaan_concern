import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaSeedling, FaTools, FaPhoneAlt, FaEnvelope,FaStore } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-green-900 text-white py-12 px-6">
      <div className="max-w-6xl mx-auto text-center md:text-left">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: About AgroConnect */}
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-lime-400">About AgroConnect</h3>
            <p className="text-lg text-gray-300 mb-4">
              Empowering farmers through AI-powered solutions, expert guidance, and direct consumer
              sales. Together, we build a sustainable future for agriculture.
            </p>
            <Link to="/about" className="text-lime-400 hover:text-lime-500 text-lg font-semibold">
              <FaSeedling className="inline-block mr-2" />
              Learn more about us
            </Link>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-lime-400">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/diagnose" 
                  className="text-gray-300 hover:text-lime-400 font-semibold transition-all duration-300"
                  activeClassName="text-lime-500"
                >
                  <FaTools className="inline-block mr-2" />
                  AI Disease Diagnosis
                </Link>
              </li>
              <li>
                <Link 
                  to="/marketplace" 
                  className="text-gray-300 hover:text-lime-400 font-semibold transition-all duration-300"
                  activeClassName="text-lime-500"
                >
                  <FaStore className="inline-block mr-2" />
                  Farmer’s Marketplace
                </Link>
              </li>
              <li>
                <Link 
                  to="/experts" 
                  className="text-gray-300 hover:text-lime-400 font-semibold transition-all duration-300"
                  activeClassName="text-lime-500"
                >
                  <FaSeedling className="inline-block mr-2" />
                  Connect with Experts
                </Link>
              </li>
              <li>
                <Link 
                  to="/support" 
                  className="text-gray-300 hover:text-lime-400 font-semibold transition-all duration-300"
                  activeClassName="text-lime-500"
                >
                  <FaPhoneAlt className="inline-block mr-2" />
                  Support & Awareness
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Social Media */}
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-lime-400">Follow Us</h3>
            <div className="flex justify-center space-x-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook className="text-2xl hover:text-lime-400 transition-all duration-300" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter className="text-2xl hover:text-lime-400 transition-all duration-300" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="text-2xl hover:text-lime-400 transition-all duration-300" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <FaLinkedin className="text-2xl hover:text-lime-400 transition-all duration-300" />
              </a>
            </div>
          </div>

          {/* Column 4: Contact Us */}
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-lime-400">Contact Us</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-300 hover:text-lime-400 font-semibold transition-all duration-300"
                >
                  <FaEnvelope className="inline-block mr-2" />
                  Email Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-300 hover:text-lime-400 font-semibold transition-all duration-300"
                >
                  <FaPhoneAlt className="inline-block mr-2" />
                  Call Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 pt-6 mt-6 text-gray-400">
          <p className="text-center text-lg">
            © {new Date().getFullYear()} AgroConnect. All rights reserved.
          </p>
          <p className="text-center mt-2 text-sm">
            Built with love to empower farmers and create a sustainable future.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
