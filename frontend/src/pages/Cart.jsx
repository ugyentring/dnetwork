import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { loadStripe } from "@stripe/stripe-js";

export default function Cart() {
  const { cartItems, removeFromCart, cartTotal } = useCart();


  const stripePromise = loadStripe("pk_test_51RYuFsP8DOyKgPaeVxy9t0bCHkJ6o2NaumJhvdTeexMNgT978mS12bnX5up7u7GQ41y9Na0lyGccB4HXxPEdLUPw00CpbdX0xI");
  
  //stripe handling checkout
  async function handleCheckout(cartItems) {
    // Map cart items to expected shape for backend
    const mappedItems = cartItems.map(item => ({
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));
    const res = await fetch("http://localhost:5000/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartItems: mappedItems }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Link
            to="/products"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {cartItems.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center border-b py-4"
              >
                <img
                  src={item.product.image || "/images/default-product.jpg"}
                  alt={item.product.name}
                  className="w-20 h-20 object-contain mr-4"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.product.name}</h3>
                  <p className="text-gray-600">
                    ${Number(item.product.price).toFixed(2)}
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span>Qty: {item.quantity}</span>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="flex justify-between items-center mb-4">
              <span>Total:</span>
              <span className="font-semibold">${cartTotal.toFixed(2)}</span>
            </div>
            <button 
            onClick={() => handleCheckout(cartItems)}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
