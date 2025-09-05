import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./Language_selector";
import { GiFarmer, GiFertilizerBag } from "react-icons/gi";
import {
  FaLeaf,
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
  const location = useLocation();
  const { t } = useTranslation();

  // Close cart if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setCartMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setCartMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
    setCartMenuOpen(false);
  };

  const toggleCartMenu = (e) => {
    e.preventDefault();
    setCartMenuOpen((prev) => !prev);
  };

  const menuItems = [
    { to: "/", label: t("home"), icon: <FaLeaf /> },
    { to: "/diagnose", label: t("diagnose"), icon: <FaBrain /> },
    { to: "/marketplace", label: t("marketplace"), icon: <FaStore /> },
    { to: "/awareness", label: t("awareness"), icon: <FaBullhorn /> },
    { to: "/fertilisers", label: t("fertilizers"), icon: <GiFertilizerBag /> },
    { to: "/list_items", label: t("productDetails"), icon: <GiFertilizerBag /> },
  ];

  const cartItems = [
    { to: "/cart/fertilizer", label: t("fertilizerCart") },
    { to: "/cart/product", label: t("productCart") },
    { to: "/orders", label: t("orders") },
  ];

  return (
    <header className="bg-green-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <GiFarmer className="text-4xl text-green-100" />
          <FaLeaf className="text-3xl text-lime-400" />
          <div>
            <h1 className="text-xl font-bold leading-tight">Kisaan Concern</h1>
            <p className="text-[12px] text-lime-200 -mt-1">{t("welcome")}</p>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 items-center text-sm font-medium">
          {menuItems.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-1 hover:text-lime-300 transition"
            >
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
              <FaShoppingCart /> {t("more")} {cartMenuOpen ? "▲" : "▼"}
            </button>
            {cartMenuOpen && (
              <div className="absolute text-black bg-white rounded shadow-lg mt-2 py-2 w-48 z-50">
                {cartItems.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setCartMenuOpen(false)}
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

        {/* Desktop Login */}
        <Link
          to="/login"
          className="hidden md:inline-block bg-green-800 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-full shadow transition-all"
        >
          {t("login")} / {t("register")}
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
          {menuItems.map(({ to, label, icon }) => (
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
              <FaShoppingCart /> {t("cart")} {cartMenuOpen ? "▲" : "▼"}
            </button>
            {cartMenuOpen && (
              <div className="pl-6 mt-2 space-y-2">
                {cartItems.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMenuOpen(false)}
                    className="block py-1 hover:text-lime-300"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Login */}
          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="block w-full text-center mt-2 bg-green-700 hover:bg-green-600 text-white font-semibold py-2 rounded-full shadow transition"
          >
            {t("login")} / {t("register")}
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
