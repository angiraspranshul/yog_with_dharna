import Header from "../../components/Header";
import Footer from "../../components/Footer";
import BookingContainer from "./BookingContainer";
import { prisma } from "../../lib/db";

const fallbackClasses = [
  {
    id: "1",
    title: "Vinyasa Flow",
    description: "A dynamic and fluid practice connecting breath to movement. Flow through creative sequences designed to build full-body strength, active flexibility, and calm mindfulness.",
    duration: 60,
    level: "All Levels",
    price: 500,
  },
  {
    id: "2",
    title: "Hatha Alignment & Strength",
    description: "A slower-paced session focused on foundational poses, physical alignment, and deep breathing techniques. Excellent for beginners and seasoned yogis looking to refine their practice.",
    duration: 75,
    level: "Beginner",
    price: 600,
  },
  {
    id: "3",
    title: "Restorative & Yin Yoga",
    description: "Calm your nervous system and release deep-seated physical and mental tension. Passive floor poses are held for 3–5 minutes to target deep connective tissues and induce deep relaxation.",
    duration: 60,
    level: "Beginner",
    price: 550,
  },
  {
    id: "4",
    title: "Power Yoga Cardio",
    description: "A high-energy, vigorous flow that combines traditional yoga asanas with core-strengthening intervals and high-intensity moves. Be ready to build stamina, sweat, and feel energized!",
    duration: 60,
    level: "Intermediate",
    price: 600,
  },
  {
    id: "5",
    title: "Pranayama & Meditation",
    description: "A dedicated sanctuary session focusing on ancient breath control techniques (Pranayama) followed by guided meditation. Designed to calm mental chatter, improve focus, and relieve anxiety.",
    duration: 45,
    level: "Beginner",
    price: 400,
  },
  {
    id: "6",
    title: "Ashtanga Primary Series Intro",
    description: "A structured, physically demanding practice based on the traditional Ashtanga primary series. Synchronize breath, locks (bandhas), and gaze (drishti) for an intense moving meditation.",
    duration: 90,
    level: "Advanced",
    price: 700,
  }
];

export const revalidate = 0; // Dynamic rendering for real-time bookings

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ class?: string }>;
}) {
  let classes = [];
  let dbError = false;

  try {
    classes = await prisma.class.findMany();
  } catch (error) {
    console.error("Database connection fallback active on book page:", error);
    dbError = true;
  }

  const displayClasses = classes.length > 0 ? classes : fallbackClasses;
  const params = await searchParams;
  const initialClassId = params.class || "";

  return (
    <>
      <Header />
      <main className="flex-1 py-12 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-3 mb-10 text-center sm:text-left">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            Book a Yoga Session
          </h1>
          <p className="text-muted text-sm sm:text-base max-w-lg">
            Pick a class, choose an active date/time slot, and fill in your details to secure your spot.
          </p>
        </div>

        <BookingContainer 
          classes={displayClasses} 
          initialClassId={initialClassId} 
          dbError={dbError}
        />
      </main>
      <Footer />
    </>
  );
}
