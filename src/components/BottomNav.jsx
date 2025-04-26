// components/BottomNav.jsx
import { Link, useLocation } from "react-router-dom";
import { Home, Film, Tv, Search } from "lucide-react";

const navItems = [
  { label: "Home", icon: <Home size={20} />, href: "/" },
  { label: "Movies", icon: <Film size={20} />, href: "/movies" },
  { label: "Shows", icon: <Tv size={20} />, href: "/shows" },
  { label: "Search", icon: <Search size={20} />, href: "/search" },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav
      style={{ backgroundColor: "#23243a" }}
      className="fixed bottom-0 left-0 right-0
 text-white border-t border-gray-800 z-50"
    >
      <div className="flex justify-around items-center py-2">
        {navItems.map((item, index) => {
          const isActive = location.pathname.startsWith(item.href);
          return (
            <Link
              key={index}
              to={item.href}
              className={`flex flex-col items-center text-sm transition-colors ${
                isActive ? "text-cyan-700" : "text-white hover:text-red-500"
              }`}
            >
              {item.icon}
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
