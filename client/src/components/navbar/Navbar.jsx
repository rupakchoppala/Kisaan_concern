import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom"; // 🆕
import { useTranslation } from "react-i18next";
import LanguageSelector from "./Language_selector";
import { GiFarmer, GiFertilizerBag } from "react-icons/gi";
import {
  FaLeaf,
  FaHandsHelping,
  FaStore,
  FaBrain,
  FaBullhorn,
  FaBars,
  FaTimes,
  FaShoppingCart,
} from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartMenuOpen, setCartMenuOpen] = useState(false);
  const cartRef = useRef(null);
  const location = useLocation(); // 🆕
  const { t } = useTranslation();

  // Close cart submenu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setCartMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false);
    setCartMenuOpen(false);
  }, [location.pathname]); // 🆕

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
    setCartMenuOpen(false); // 🆕 Auto-close cart on mobile toggle
  };

  const toggleCartMenu = (e) => {
    e.preventDefault();
    setCartMenuOpen((prev) => !prev);
  };

  return (
    <header className="bg-green-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo & Tagline */}
        <div className="flex items-center space-x-2">
          <GiFarmer className="text-4xl text-green-100" />
          <FaLeaf className="text-3xl text-lime-400" />
          <div>
            <h1 className="text-xl font-bold leading-tight">Kisaan Concern</h1>
            <p className="text-[12px] text-lime-200 -mt-1">
              Empowering Farmers, Enabling Growth
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 items-center text-sm font-medium">
          {[
            { to: "/", label: t("home"), icon: <FaLeaf /> },
            { to: "/diagnose", label: "Diagnose", icon: <FaBrain /> },
            { to: "/marketplace", label: "Marketplace", icon: <FaStore /> },
            { to: "/awareness", label: "Awareness", icon: <FaBullhorn /> },
            { to: "/fertilisers", label: "Fertilizers", icon: <GiFertilizerBag /> },
            { to: "/list_items", label: "Product Details", icon: <GiFertilizerBag /> },
          ].map(({ to, label, icon }) => (
            <Link key={to} to={to} className="flex items-center gap-1 hover:text-lime-300 transition">
              {icon} {label}
            </Link>
          ))}

          {/* Cart Dropdown */}
          <div className="relative" ref={cartRef}>
            <button
              onClick={toggleCartMenu}
              className="flex items-center gap-1 hover:text-lime-300 transition focus:outline-none"
              aria-haspopup="true"
              aria-expanded={cartMenuOpen}
            >
              <FaShoppingCart /> More {cartMenuOpen ? "▲" : "▼"}
            </button>
            {cartMenuOpen && (
              <div className="absolute text-black bg-white rounded shadow-lg mt-2 py-2 w-48 z-50">
                {[
                  { to: "/cart/fertilizer", label: "Fertilizer Cart" },
                  { to: "/cart/product", label: "Product Cart" },
                  { to: "/orders", label: "Orders" },
                ].map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => {
                      setCartMenuOpen(false);
                    }}
                    className="block px-4 py-2 hover:bg-green-200"
                  >
                    {label}
                  </Link>
                ))}
                <div className="px-4 py-2">
                  <LanguageSelector />
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* CTA Button */}
        <Link
          to="/login"
          className="hidden md:inline-block bg-green-800 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-full shadow transition-all"
        >
          Login / Register
        </Link>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="focus:outline-none text-lime-300"
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-green-800 text-white px-6 pb-4 space-y-4 transition-all duration-300">
          {[
            { to: "/", label: "Home", icon: <FaLeaf /> },
            { to: "/diagnose", label: "Diagnose", icon: <FaBrain /> },
            { to: "/marketplace", label: "Marketplace", icon: <FaStore /> },
            { to: "/awareness", label: "Awareness", icon: <FaBullhorn /> },
            { to: "/fertilisers", label: "Fertilizers", icon: <GiFertilizerBag /> },
            { to: "/list_items", label: "Product Details", icon: <GiFertilizerBag /> },
          ].map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className="block py-2 border-b border-green-700"
            >
              <span className="inline-flex items-center gap-2">
                {icon} {label}
              </span>
            </Link>
          ))}

          {/* Cart Mobile Dropdown */}
          <div>
            <button
              onClick={toggleCartMenu}
              className="flex items-center gap-2 w-full py-2 border-b border-green-700 hover:text-lime-300 transition focus:outline-none"
              aria-expanded={cartMenuOpen}
            >
              <FaShoppingCart /> Cart {cartMenuOpen ? "▲" : "▼"}
            </button>
            {cartMenuOpen && (
              <div className="pl-6 mt-2 space-y-2">
                <Link to="/cart/fertilizer" onClick={() => setMenuOpen(false)} className="block py-1 hover:text-lime-300">
                  Fertilizer Cart
                </Link>
                <Link to="/cart/product" onClick={() => setMenuOpen(false)} className="block py-1 hover:text-lime-300">
                  Product Cart
                </Link>
                <Link to="/orders" onClick={() => setMenuOpen(false)} className="block py-1 hover:text-lime-300">
                  Orders
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Login */}
          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="block w-full text-center mt-2 bg-green-700 hover:bg-green-600 text-white font-semibold py-2 rounded-full shadow transition"
          >
            Login / Register
          </Link>

          {/* Mobile Language Selector */}
          <div className="pt-2">
            <LanguageSelector />
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
