import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createProduct,
  updateProduct,
  getProductById,
} from "../services/product";

export default function ProductForm({ editMode }) {
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    description: "",
    stock: 0,
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (editMode) {
      const loadProduct = async () => {
        try {
          const product = await getProductById(id);
          setFormData(product);
        } catch (err) {
          setError("Failed to load product");
        }
      };
      loadProduct();
    }
  }, [editMode, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editMode) {
        await updateProduct(id, formData);
      } else {
        await createProduct(formData);
      }
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">
        {editMode ? "Edit Product" : "Create New Product"}
      </h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <div>
          <label className="block mb-2">Product Name</label>
          <input
            type="text"
            required
            className="w-full p-2 border rounded"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block mb-2">Price</label>
          <input
            type="number"
            step="0.01"
            required
            className="w-full p-2 border rounded"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block mb-2">Description</label>
          <textarea
            required
            className="w-full p-2 border rounded"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block mb-2">Stock Quantity</label>
          <input
            type="number"
            required
            className="w-full p-2 border rounded"
            value={formData.stock}
            onChange={(e) =>
              setFormData({ ...formData, stock: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block mb-2">Image URL</label>
          <input
            type="url"
            className="w-full p-2 border rounded"
            value={formData.image}
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.value })
            }
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Product"}
        </button>
      </form>
    </div>
  );
}
