import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          E-Commerce
        </Link>

        <div className="space-x-4">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>
          <Link to="/products" className="hover:text-blue-600">
            Products
          </Link>
          <Link to="/cart" className="hover:text-blue-600">
            Cart
          </Link>
          <Link to="/login" className="hover:text-blue-600">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
