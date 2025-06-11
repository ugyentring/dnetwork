import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link 
          to="/" 
          className="text-2xl font-semibold text-gray-800 hover:text-indigo-600 transition-colors duration-300"
        >
          <span className="text-indigo-600">E</span>-Commerce
        </Link>

        <div className="flex space-x-8">
          <Link 
            to="/" 
            className="text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-300 relative group"
          >
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link 
            to="/products" 
            className="text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-300 relative group"
          >
            Products
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link 
            to="/cart" 
            className="text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-300 relative group"
          >
            Cart
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          {!user ? (
            <Link 
              to="/login" 
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-medium rounded-md hover:shadow-md transition-all duration-300 hover:from-indigo-700 hover:to-indigo-600"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={logout}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-400 text-white font-medium rounded-md hover:shadow-md transition-all duration-300 hover:from-red-700 hover:to-red-600"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}