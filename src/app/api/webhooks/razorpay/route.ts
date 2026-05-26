import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "../../../../lib/db";
import { sendBookingEmail } from "../../../../lib/email";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");
    const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || "your_webhook_secret_here";

    if (!signature) {
      return NextResponse.json({ error: "Missing Razorpay signature" }, { status: 400 });
    }

    // Cryptographically verify the webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.warn("Invalid Razorpay webhook signature detected!");
      return NextResponse.json({ error: "Invalid signature verification" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    console.log(`Razorpay webhook event received: ${event.event}`);

    // Focus only on payment captured events
    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;
      const paymentId = payment.id;
      const amount = payment.amount / 100; // Convert paisa back to INR

      // 1. Search database to identify this booking transaction
      // Find the booking that matches this orderId or is pending for this slot
      let booking = await prisma.booking.findFirst({
        where: {
          orderId: orderId,
          status: "PENDING",
        },
        include: {
          user: true,
          slot: {
            include: {
              class: true,
            },
          },
        },
      });

      // Alternate fallback check: check by email and amount if orderId matches metadata
      if (!booking && payment.notes?.bookingId) {
        booking = await prisma.booking.findUnique({
          where: { id: payment.notes.bookingId },
          include: {
            user: true,
            slot: {
              include: {
                class: true,
              },
            },
          },
        });
      }

      if (!booking) {
        console.warn(`No pending booking found for Order ID: ${orderId}`);
        return NextResponse.json({ received: true, note: "No matching pending booking found" });
      }

      // 2. Concurrency-Safe State transition to PAID
      const updatedBooking = await prisma.booking.update({
        where: { id: booking.id },
        data: {
          status: "PAID",
          paymentId: paymentId,
          orderId: orderId || booking.orderId,
        },
      });

      console.log(`Booking ${updatedBooking.id} successfully updated to PAID.`);

      // 3. Dispatch Professional Transactional Confirmation Email
      const formattedDate = new Date(booking.slot.date).toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      await sendBookingEmail({
        to: booking.user.email,
        subject: `Confirmed: ${booking.slot.class.title} Reservation with Dhaarna`,
        className: booking.slot.class.title,
        date: formattedDate,
        time: `${booking.slot.startTime} - ${booking.slot.endTime}`,
        price: amount,
        customerName: booking.user.name,
        meetLink: "https://meet.google.com/abc-defg-hij", // Static or dynamic Google Meet link
      });

      console.log(`Booking confirmation email dispatched successfully to ${booking.user.email}.`);
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error("Razorpay webhook transaction error:", error);
    return NextResponse.json({ error: "Webhook handler failed internally" }, { status: 500 });
  }
}
