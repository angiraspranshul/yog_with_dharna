import type { APIRoute } from "astro";
import Razorpay from "razorpay";
import { adminDb } from "../../lib/firebase/admin";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { classId } = await request.json();

    if (!classId) {
      return new Response(JSON.stringify({ error: "Missing classId" }), { status: 400 });
    }

    // Fetch class details from Firestore to get the correct price securely
    const classDoc = await adminDb.collection('classes').doc(classId).get();
    if (!classDoc.exists) {
      return new Response(JSON.stringify({ error: "Class not found" }), { status: 404 });
    }

    const classData = classDoc.data();
    const amount = classData?.price * 100; // Razorpay expects amount in paise (1 INR = 100 paise)

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || import.meta.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET || import.meta.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount,
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
      notes: {
        classId: classId,
        className: classData?.name
      }
    };

    const order = await razorpay.orders.create(options);

    return new Response(JSON.stringify({ 
      id: order.id, 
      currency: order.currency, 
      amount: order.amount,
      key: import.meta.env.PUBLIC_RAZORPAY_KEY_ID // Send public key to client
    }), { status: 200 });

  } catch (error) {
    console.error("Razorpay Error:", error);
    return new Response(JSON.stringify({ error: "Payment initialization failed" }), { status: 500 });
  }
};
