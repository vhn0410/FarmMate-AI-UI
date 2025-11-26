import { Bell, ChevronsLeft, Moon, Sun, X, AlertTriangle, AlertCircle } from "lucide-react";
import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Mock hooks for demo - replace with your actual implementations
const useTheme = () => {
  const [theme, setTheme] = useState("light");
  return { theme, setTheme };
};

const useKeycloak = () => ({
  tokenParsed: { preferred_username: "demo_user" }
});



export const Header = ({ collapsed = false, setCollapsed = () => {} }) => {
  const { theme, setTheme } = useTheme();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const keycloak = useKeycloak();
  const navigate = useNavigate();

 
  const handleLogout = () => {
    console.log("Logging out...");
    navigate("/logout"); // Uncomment when using react-router
    alert("Đăng xuất thành công!");
    setShowLogoutModal(false);
  };


  return (
    <>
      <header className="relative z-10 flex h-[60px] items-center justify-between px-4 ">
        <div className="flex items-center gap-x-3">
          <button 
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors" 
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronsLeft className={`w-5 h-5 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>
        
        <div className="flex items-center gap-x-3">
          {/* User Profile */}
          <div className="flex items-center gap-x-3">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
              {keycloak.tokenParsed?.preferred_username}
            </p>
            <button 
              className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm hover:shadow-lg transition-shadow"
              onClick={() => setShowLogoutModal(true)}
            >
              {keycloak.tokenParsed?.preferred_username?.charAt(0).toUpperCase() || "U"}
            </button>
          </div>
        </div>
      </header>

      {/* Logout Modal */}
      {showLogoutModal && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          />
          <div className="fixed z-50 right-4 top-[70px] w-48 rounded-lg bg-white p-4 shadow-xl dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <button
              className="w-full rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600 transition-colors font-medium"
              onClick={handleLogout}
            >
              Đăng xuất
            </button>
          </div>
        </>
      )}
    </>
  );
};

Header.propTypes = {
  collapsed: PropTypes.bool,
  setCollapsed: PropTypes.func,
};

