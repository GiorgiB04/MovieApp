import React from "react";
import { Link } from "react-router-dom";
import logo from "../img/logo.png";

const Navbar = () => {
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Movies", href: "/movies" },
    { label: "TV Shows", href: "/shows" },
    { label: "People", href: "/people" },
    { label: "Search", href: "/search" },
  ];

  return (
    <nav className="fixed h-20 top-0 left-0 right-0 bg-[#23243a] bg-opacity-80 backdrop-blur-md text-white z-50 hidden md:flex items-center justify-between px-10 shadow-md">
      {/* Logo */}
      <Link to="/" className="flex items-center space-x-2">
        <img
          src={logo}
          alt="PrimeFilmy Logo"
          className="h-9 w-auto object-contain"
        />
      </Link>

      {/* Menu */}
      <div className="flex space-x-8">
        {navItems.map((item, idx) => (
          <Link
            key={idx}
            to={item.href}
            className="relative group text-sm font-semibold tracking-widest uppercase"
          >
            <span className="text-white group-hover:text-blue-500 transition-colors duration-300">
              {item.label}
            </span>
            <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-gradient-to-r from-sky-500 cyan-500 blue-500 group-hover:w-full transition-all duration-500 ease-out"></span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
