import Stripe from "stripe";
import express from "express";
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", async (req, res) => {
  try {
    console.log("[Stripe Checkout] Incoming cartItems:", req.body.cartItems);
    const { cartItems } = req.body;
    // Validate prices
    for (const item of cartItems) {
      console.log(`Item: ${item.name}, Price: ${item.price}, Type: ${typeof item.price}`);
      if (isNaN(Number(item.price))) {
        return res.status(400).json({ error: `Invalid price for item '${item.name}': ${item.price}` });
      }
    }
    const line_items = cartItems.map(item => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("[Stripe Checkout] Error:", err);
    res.status(500).json({ error: err.message, details: err });
  }
});

export default router;