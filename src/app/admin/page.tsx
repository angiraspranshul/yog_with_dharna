import { redirect } from "next/navigation";
import { getAdminSession } from "../../lib/auth";
import { prisma } from "../../lib/db";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AdminDashboard from "./AdminDashboard";

export const revalidate = 0; // Disable server cache for real-time bookings

export default async function AdminPage() {
  // 1. Session Auth check
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  let bookings: any[] = [];
  let classes: any[] = [];
  let slots: any[] = [];
  let dbError = false;

  try {
    // Fetch live db collections
    bookings = await prisma.booking.findMany({
      include: {
        user: true,
        slot: {
          include: {
            class: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    classes = await prisma.class.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    slots = await prisma.timeSlot.findMany({
      include: {
        class: true,
      },
      orderBy: {
        date: "asc",
      },
    });

  } catch (error) {
    console.error("Database connection fallback active on admin page:", error);
    dbError = true;
  }

  // High-fidelity fallback mock data for instant cloud preview testing
  const fallbackClasses = [
    { id: "1", title: "Vinyasa Flow", duration: 60, level: "All Levels", price: 500 },
    { id: "2", title: "Hatha Alignment", duration: 75, level: "Beginner", price: 600 },
    { id: "3", title: "Restorative Yin", duration: 60, level: "Beginner", price: 550 },
  ];

  const fallbackSlots = [
    {
      id: "slot-1",
      classId: "1",
      class: fallbackClasses[0],
      date: new Date(),
      startTime: "08:00",
      endTime: "09:00",
      capacity: 15,
      bookedCount: 4,
    },
    {
      id: "slot-2",
      classId: "2",
      class: fallbackClasses[1],
      date: new Date(),
      startTime: "11:00",
      endTime: "12:15",
      capacity: 10,
      bookedCount: 10, // Full
    },
  ];

  const fallbackBookings = [
    {
      id: "book-1",
      amount: 500,
      status: "PAID",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      user: { name: "Ananya Iyer", email: "ananya@example.com", phone: "+91 98765 12345" },
      slot: fallbackSlots[0],
    },
    {
      id: "book-2",
      amount: 600,
      status: "PENDING",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      user: { name: "Kabir Mehta", email: "kabir@example.com", phone: "+91 98111 22233" },
      slot: fallbackSlots[1],
    },
  ];

  const displayBookings = bookings.length > 0 ? bookings : fallbackBookings;
  const displayClasses = classes.length > 0 ? classes : fallbackClasses;
  const displaySlots = slots.length > 0 ? slots : fallbackSlots;

  return (
    <>
      <Header />
      <main className="flex-1 py-12 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full">
        <AdminDashboard
          bookings={displayBookings}
          classes={displayClasses}
          slots={displaySlots}
          dbError={dbError}
        />
      </main>
      <Footer />
    </>
  );
}
