// components/Layout.jsx
import React from 'react';
import Navbar from '../navbar/Navbar';
import Footer from '../footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Navbar />
      <main className="flex-grow w-full">
        <div className="w-full h-full">{children}</div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
