import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";

export async function POST(request: Request) {
  try {
    const { fullName, email, phone, slotId } = await request.json();

    if (!fullName || !email || !slotId) {
      return NextResponse.json(
        { error: "Missing required fields: fullName, email, or slotId" },
        { status: 400 }
      );
    }

    // Use Prisma interactive transaction to guarantee database-level concurrency safety
    const result = await prisma.$transaction(async (tx) => {
      // 1. Fetch slot with pessimistic locking (if supported) or strict checks
      const slot = await tx.timeSlot.findUnique({
        where: { id: slotId },
        include: { class: true },
      });

      if (!slot) {
        throw new Error("SELECTED_SLOT_NOT_FOUND");
      }

      // 2. Concurrency Safety: Check capacity limits
      if (slot.bookedCount >= slot.capacity) {
        throw new Error("SLOT_FULLY_BOOKED");
      }

      // 3. Upsert User (Find existing by email or create new)
      let user = await tx.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (!user) {
        user = await tx.user.create({
          data: {
            email: email.toLowerCase(),
            name: fullName,
            phone: phone || null,
          },
        });
      }

      // 4. Update the booked count inside the time slot
      await tx.timeSlot.update({
        where: { id: slotId },
        data: {
          bookedCount: {
            increment: 1,
          },
        },
      });

      // 5. Create the Booking entry as PENDING
      const booking = await tx.booking.create({
        data: {
          userId: user.id,
          slotId: slot.id,
          status: "PENDING", // Confirmed paid upon Razorpay capture hook
          amount: slot.class.price,
        },
        include: {
          slot: {
            include: {
              class: true,
            },
          },
          user: true,
        },
      });

      return booking;
    });

    return NextResponse.json({ success: true, booking: result });

  } catch (error: any) {
    console.error("Booking transaction failed:", error);

    if (error.message === "SELECTED_SLOT_NOT_FOUND") {
      return NextResponse.json(
        { error: "The selected time slot does not exist." },
        { status: 404 }
      );
    }

    if (error.message === "SLOT_FULLY_BOOKED") {
      return NextResponse.json(
        { error: "This session is fully booked. Please select another time." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal booking error. Please try again." },
      { status: 500 }
    );
  }
}
