import type { APIRoute } from "astro";
import crypto from "crypto";
import { adminDb } from "../../lib/firebase/admin";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, classId, userEmail, userName } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return new Response(JSON.stringify({ error: "Missing payment verification parameters" }), { status: 400 });
    }

    const secret = import.meta.env.RAZORPAY_KEY_SECRET;
    
    if (!secret) {
        console.error("RAZORPAY_KEY_SECRET is not defined");
        return new Response(JSON.stringify({ error: "Server configuration error" }), { status: 500 });
    }

    // Verify signature
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return new Response(JSON.stringify({ error: "Invalid payment signature" }), { status: 400 });
    }

    // Optionally save the booking to Firestore
    if (classId) {
      await adminDb.collection('bookings').add({
        classId,
        userName: userName || "Guest",
        userEmail: userEmail || "No Email",
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        createdAt: new Date().toISOString()
      });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Verification Error:", error);
    return new Response(JSON.stringify({ error: "Payment verification failed" }), { status: 500 });
  }
};
