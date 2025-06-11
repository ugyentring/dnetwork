import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../services/product";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading)
    return <div className="text-center py-8">Loading product...</div>;
  if (error)
    return <div className="text-red-500 text-center py-8">Error: {error}</div>;
  if (!product)
    return <div className="text-center py-8">Product not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link to="/" className="text-blue-600 hover:text-blue-800">
          &larr; Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <img
            src={product.image || "/images/default-product.jpg"}
            alt={product.name}
            className="w-full h-96 object-contain"
          />
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-2xl font-semibold text-blue-600">
            ${Number(product.price).toFixed(2)}
          </p>

          <div className="flex items-center space-x-2">
            <span
              className={`text-sm ${
                product.stock > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
            <span className="text-gray-500">|</span>
            <span className="text-sm text-gray-600">
              {product.stock} available
            </span>
          </div>

          <p className="text-gray-700 leading-relaxed">{product.description}</p>

          <div className="text-xs text-gray-400">
            <div>Product ID: {product.id}</div>
            <div>Created At: {product.createdAt}</div>
          </div>

          <button
            onClick={() => {
              addToCart(product);
              toast.success("Product added to cart!", { autoClose: 2000 });
            }}
            disabled={product.stock <= 0}
            className={`w-full py-2 px-4 rounded ${
              product.stock > 0
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
}
